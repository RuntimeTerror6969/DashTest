import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// PayPal API endpoints
const API_ENDPOINTS = {
  production: 'https://api-m.paypal.com',
  sandbox: 'https://api-m.sandbox.paypal.com'
};

const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'production' 
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
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
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

export async function POST(request) {
  try {
    const { amount, currency, orderID, billingDetails } = await request.json();

    if (!amount || !currency || !orderID || !billingDetails) {
      console.error('Missing required fields:', { amount, currency, orderID, hasBillingDetails: !!billingDetails });
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      }, { status: 400 });
    }

    // Get PayPal access token
    console.log('Getting PayPal access token...');
    const accessToken = await getPayPalAccessToken();
    console.log('Successfully obtained PayPal access token');

    // Format the amount properly
    const formattedAmount = Number(amount).toFixed(2);

    // Get and validate the base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log('PayPal Integration URLs:', {
      baseUrl,
      returnUrl: `${baseUrl}/paypal-response?orderId=${orderID}`,
      cancelUrl: `${baseUrl}/paypal-response?orderId=${orderID}&status=CANCELLED`,
      source: process.env.NEXT_PUBLIC_BASE_URL ? 'environment variable' : 'default'
    });

    // Validate base URL
    try {
      new URL(baseUrl);
    } catch (error) {
      console.error('Invalid base URL:', baseUrl);
      throw new Error('Invalid base URL configuration');
    }

    // Create PayPal order
    console.log('Creating PayPal order with data:', {
      amount: formattedAmount,
      currency,
      orderID,
      baseUrl
    });

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: formattedAmount,
            },
            description: `Order ${orderID}`,
            custom_id: orderID,
          },
        ],
        application_context: {
          return_url: `${baseUrl}/paypal-response?orderId=${orderID}`,
          cancel_url: `${baseUrl}/paypal-response?orderId=${orderID}&status=CANCELLED`,
          brand_name: process.env.NEXT_PUBLIC_MERCHANT_NAME || 'Your Store',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
        },
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error('PayPal API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        orderResponse: order,
        requestBody: {
          amount: formattedAmount,
          currency,
          orderID,
          baseUrl,
        }
      });
      throw new Error(order.message || 'Failed to create PayPal order');
    }

    console.log('PayPal order created successfully:', order);

    // Store order details in Firebase
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    await db.collection(COLLECTION_NAME).doc(orderID).update({
      paymentTransactionID: order.id,
      paymentStatus: 'INITIATED',
      paymentProvider: 'PayPal',
      updatedAt: timestamp,
      lastPaymentUpdate: timestamp,
      createdAt: timestamp
    });

    return NextResponse.json({
      success: true,
      data: {
        orderID: order.id,
        links: order.links,
      },
    });
  } catch (error) {
    console.error('PayPal create order error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create PayPal order',
    }, { status: 500 });
  }
} 