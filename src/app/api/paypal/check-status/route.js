import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

const COLLECTION_NAME = 'Transactions';
const NOTIFICATION_COOLDOWN = 5000; // 5 seconds

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

// Simple in-memory cache for status updates
const statusCache = new Map();

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }

    // Check cache first with timestamp
    const cachedData = statusCache.get(orderId);
    const now = Date.now();
    
    if (cachedData && (now - cachedData.timestamp < NOTIFICATION_COOLDOWN)) {
      console.log(`Returning cached status for order ${orderId}:`, cachedData.orderData || { status: cachedData.status });
      return NextResponse.json({
        success: true,
        data: cachedData.orderData || { status: cachedData.status }
      });
    }

    // Get order details from Firestore
    const docRef = db.collection(COLLECTION_NAME).doc(orderId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log(`Order not found: ${orderId}`);
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    const orderData = doc.data();
    console.log(`Retrieved order data for ${orderId}:`, orderData);
    
    // Normalize status to COMPLETED if it indicates completion
    let currentStatus = orderData.paymentStatus || 'PENDING';
    if (currentStatus === 'completed' || currentStatus === 'CAPTURED') {
      currentStatus = 'COMPLETED';
    }
    
    console.log(`Normalized status for ${orderId}:`, currentStatus);
    
    // Include full order details in the response
    const responseData = {
      status: currentStatus,
      orderId: orderId,
      currency: orderData.orderDetails?.currency || 'USD', // Directly access currency
      amount: orderData.orderDetails?.amount || '0.00',   // Directly access amount
      item: orderData.orderDetails?.item || '',           // Directly access item
      paymentProvider: orderData.paymentProvider || 'PayPal',
      customerName: orderData.customerDetails ? 
        `${orderData.customerDetails.firstName || ''} ${orderData.customerDetails.lastName || ''}`.trim() : 
        '',
      customerEmail: orderData.customerDetails?.emailID || '',
      timestamp: orderData.updatedAt ? orderData.updatedAt.toDate().toISOString() : new Date().toISOString()
    };

    // Update cache with timestamp and full order data
    statusCache.set(orderId, {
      status: currentStatus,
      orderData: responseData,
      timestamp: now
    });

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to check payment status'
    }, { status: 500 });
  }
} 