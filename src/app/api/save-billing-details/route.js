import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
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
const COLLECTION_NAME = 'Transactions';

// Telegram bot configuration
const telegramBotToken = process.env.BUYER_ALERT_TGBOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_BUYERALERT_CHANNEL_ID;

const validateBillingDetails = (billingDetails) => {
  const requiredFields = [
    'firstName',
    'lastName',
    'emailID',
    'phoneNumber',
    'city',
    'state',
    'country'
  ];

  return requiredFields.filter(field => !billingDetails[field]);
};

// Function to send Telegram notification
const sendTelegramNotification = async (message) => {
  if (!telegramBotToken || !telegramChatId) {
    console.error('Telegram configuration missing:', {
      hasToken: !!telegramBotToken,
      hasChatId: !!telegramChatId
    });
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};

export async function POST(request) {
  try {
    // Ensure request body exists and is properly parsed
    const body = await request.json();
    
    if (!body) {
      return NextResponse.json({
        success: false,
        error: 'Request body is missing'
      }, { status: 400 });
    }

    const { orderID, billingDetails, paymentProvider } = body;

    // Validate required fields
    if (!orderID || !billingDetails || !paymentProvider) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: orderID, billingDetails, or paymentProvider'
      }, { status: 400 });
    }

    // Validate billing details structure
    if (typeof billingDetails !== 'object') {
      return NextResponse.json({
        success: false,
        error: 'Invalid billing details format'
      }, { status: 400 });
    }

    console.log('Received billing request:', { body });

    // Round off the amount to 2 decimal places
    const roundedAmount = parseFloat(billingDetails.amount).toFixed(2);

    // Create the document data with proper structure
    const docData = {
      orderID,
      customerDetails: {
        firstName: billingDetails.firstName,
        lastName: billingDetails.lastName,
        emailID: billingDetails.emailID,
        mobileNumber: billingDetails.phoneNumber,
        city: billingDetails.city,
        state: billingDetails.state,
        country: billingDetails.country,
        address: billingDetails.address,
        pinCode: billingDetails.pinCode,
      },
      paymentProvider,
      orderDetails: {
        amount: roundedAmount,
        currency: billingDetails.currency,
        item: billingDetails.item
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentStatus: 'PENDING',
      // Add paymentTransactionID for UPI or WISE with an empty value
      ...(paymentProvider === 'UPI' || paymentProvider === 'Wise' ? { paymentTransactionID: '' } : {})
    };

    // Save to Firestore with error handling
    try {
      console.log('Saving to Firestore for order:', orderID);
      await db.collection(COLLECTION_NAME).doc(orderID).set(docData, { merge: true });
      console.log('Successfully saved to Firestore for order:', orderID);

      // Send Telegram notification for new order
      const notificationMessage = `
<b>🔔 New Payment Notification</b>

<b>ORDER DETAILS:</b>
🆔 Order ID: ${orderID}
📦 Item: ${billingDetails.item}
💰 Amount: ${billingDetails.currency} ${roundedAmount}
💳 Payment Method: ${paymentProvider}
📊 Status: PAYMENT INITIATED

<b>CUSTOMER DETAILS:</b>
👤 Name: ${billingDetails.firstName} ${billingDetails.lastName}
📧 Email: ${billingDetails.emailID}
📞 Mobile: ${billingDetails.phoneNumber}
📍 Location: ${billingDetails.city}, ${billingDetails.state}, ${billingDetails.country}
      `;

      await sendTelegramNotification(notificationMessage);

    } catch (firestoreError) {
      console.error('Firestore save error:', firestoreError);
      throw new Error('Failed to save to database');
    }

    return NextResponse.json({
      success: true,
      message: 'Billing details saved successfully',
      orderID
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to save billing details'
    }, { status: 500 });
  }
} 