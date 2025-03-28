import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// PayPal API endpoints
const API_ENDPOINTS = {
  production: 'https://api-m.paypal.com',
  sandbox: 'https://api-m.sandbox.paypal.com'
};

const BASE_URL = process.env.PAYPAL_ENV === 'production' 
  ? API_ENDPOINTS.production 
  : API_ENDPOINTS.sandbox;

const COLLECTION_NAME = 'Transactions';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const db = admin.firestore();

// Get PayPal access token
async function getPayPalAccessToken() {
  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Send notification to Telegram
async function sendTelegramNotification(orderId, paymentDetails) {
  try {
    const botToken = process.env.BUYER_ALERT_TGBOT_TOKEN;
    const chatId = process.env.TELEGRAM_BUYERALERT_CHANNEL_ID;

    if (!botToken || !chatId) {
      console.log('Telegram notification skipped: Missing configuration');
      return;
    }

    const message = `
<b>🔔 Payment Update Notification</b>

<b>ORDER DETAILS:</b>
🆔 Order ID: ${orderId}
📊 Status: ${paymentDetails.status}
💳 Transaction ID: ${paymentDetails.transactionId || 'N/A'}
💰 Amount: US$ ${paymentDetails.amount || 'N/A'}

${paymentDetails.responseMessage ? `<b>NOTE:</b> ${paymentDetails.responseMessage}` : ''}
    `.trim();

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    // Don't throw error as this is not critical
  }
}

export async function POST(request) {
  try {
    const { orderID } = await request.json();

    // Get order details from Firebase
    const orderRef = db.collection(COLLECTION_NAME).doc(orderID);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    const orderData = orderDoc.data();
    const paypalOrderId = orderData?.paymentTransactionID;

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // First, verify the order status with PayPal
    const orderStatusResponse = await fetch(`${BASE_URL}/v2/checkout/orders/${paypalOrderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    const orderStatus = await orderStatusResponse.json();
    
    if (!orderStatusResponse.ok) {
      console.error('PayPal order status check failed:', {
        status: orderStatusResponse.status,
        statusText: orderStatusResponse.statusText,
        orderStatus,
        orderId: paypalOrderId
      });
      throw new Error(orderStatus.message || 'Failed to verify PayPal order status');
    }

    // Check if order is already completed
    if (orderStatus.status === 'COMPLETED') {
      const captureId = orderStatus.purchase_units[0].payments.captures[0].id;
      const amount = orderStatus.purchase_units[0].amount.value;
      const paymentDetails = {
        status: 'COMPLETED',
        transactionId: captureId,
        amount: amount,
        responseMessage: 'Payment already completed'
      };

      // Update Firebase and send notification
      await orderRef.update({
        paymentStatus: 'COMPLETED',
        paymentProvider: 'PayPal',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPaymentUpdate: admin.firestore.FieldValue.serverTimestamp(),
        transactionDetails: orderStatus // Store raw PayPal order status response
      });

      // Only send notification if status changed
      if (orderData?.paymentStatus !== 'COMPLETED') {
        await sendTelegramNotification(orderID, paymentDetails);
      }
      
      return NextResponse.json({
        success: true,
        data: {
          status: 'COMPLETED',
          transactionDetails: orderStatus
        }
      });
    }

    // Only proceed with capture if order is in APPROVED state
    if (orderStatus.status !== 'APPROVED') {
      throw new Error(`Order is in ${orderStatus.status} state. Cannot capture payment.`);
    }

    // Capture payment
    const response = await fetch(`${BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    const capture = await response.json();
    console.log('PayPal capture response:', JSON.stringify(capture, null, 2));

    if (!response.ok) {
      console.error('PayPal capture error details:', {
        status: response.status,
        statusText: response.statusText,
        captureResponse: capture,
        orderStatus: orderStatus.status,
        orderId: paypalOrderId
      });
      
      const errorDetails = capture.details?.[0];
      const errorMessage = errorDetails 
        ? `${errorDetails.issue}: ${errorDetails.description}` 
        : capture.message || 'Failed to capture PayPal payment';
      
      throw new Error(errorMessage);
    }

    // Update order status in Firebase after successful capture
    const captureId = capture.purchase_units[0].payments.captures[0].id;
    const status = capture.status === 'COMPLETED' ? 'COMPLETED' : 'FAILED';
    const amount = capture.purchase_units[0].payments.captures[0].amount.value;

    await orderRef.update({
      paymentStatus: status,
      paymentProvider: 'PayPal',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastPaymentUpdate: admin.firestore.FieldValue.serverTimestamp(),
      transactionDetails: capture // Store raw PayPal capture response
    });

    // Only send notification if status changed
    if (orderData?.paymentStatus !== status) {
      await sendTelegramNotification(orderID, {
        status,
        transactionId: captureId,
        amount: amount,
        responseMessage: status === 'COMPLETED' ? 'Payment successful' : 'Payment failed'
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status,
        transactionDetails: capture
      }
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to capture PayPal payment'
    }, { status: 500 });
  }
} 