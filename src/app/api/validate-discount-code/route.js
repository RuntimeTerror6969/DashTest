import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

let serviceAccount;
try {
  // Process private key correctly - replace literal \n with actual newlines
  const privateKey = process.env.FIREBASE_PRIVATE_KEY ? 
    process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;
  
  // Construct serviceAccount object from environment variables
  serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40quanttradertools.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  };
  
  // Validate required environment variables
  const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL'];
  const missingEnvVars = requiredEnvVars.filter(field => !process.env[field]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
} catch (error) {
  console.error('Error loading Firebase credentials:', error);
  serviceAccount = null;
}

// Check if Firebase Admin is already initialized
if (!admin.apps.length && serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

// Only create db if Firebase was initialized successfully
let db;
try {
  db = admin.firestore();
} catch (error) {
  console.error('Error initializing Firestore:', error);
}

export async function POST(request) {
  // Check if Firebase was properly initialized
  if (!admin.apps.length || !serviceAccount) {
    return NextResponse.json({
      valid: false,
      message: 'Server configuration error: Firebase not properly initialized',
    }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { discountCode } = body;

    if (!discountCode) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Discount code is required' 
      }, { status: 400 });
    }

    // Query all documents in the discountCodes collection
    const snapshot = await db.collection('discountCodes').get();
    
    // Iterate through each document (product) to find the discount code
    for (const doc of snapshot.docs) {
      const productDiscounts = doc.data();
      
      // Check in INR currency
      if (productDiscounts.INR && discountCode in productDiscounts.INR) {
        return NextResponse.json({
          valid: true,
          value: productDiscounts.INR[discountCode],
          product: doc.id,
          currency: 'INR'
        }, { status: 200 });
      }
      
      // Check in USD currency
      if (productDiscounts.USD && discountCode in productDiscounts.USD) {
        return NextResponse.json({
          valid: true,
          value: productDiscounts.USD[discountCode],
          product: doc.id,
          currency: 'USD'
        }, { status: 200 });
      }
    }

    // If we've checked all documents and haven't found the code
    return NextResponse.json({
      valid: false,
      message: 'Invalid discount code'
    }, { status: 404 });

  } catch (error) {
    console.error('Error checking discount code:', error);
    return NextResponse.json({
      valid: false,
      message: 'Error processing discount code',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 