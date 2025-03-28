import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBcTO4UonfKWya2pSdiGy6xBYdyN5pwF4c",

    authDomain: "quanttradertools.firebaseapp.com",
  
    databaseURL: "https://quanttradertools-default-rtdb.asia-southeast1.firebasedatabase.app",
  
    projectId: "quanttradertools",
  
    storageBucket: "quanttradertools.firebasestorage.app",
  
    messagingSenderId: "866573064995",
  
    appId: "1:866573064995:web:db12e67217992401f88a96",
  
    measurementId: "G-YB9V5RRP84"
  
};

// Initialize Firebase
let firebase;
if (!getApps().length) {
  firebase = initializeApp(firebaseConfig);
} else {
  firebase = getApps()[0];
}

const auth = getAuth(firebase);
const database = getDatabase(firebase);
const firestore = getFirestore(firebase);

if (process.env.NODE_ENV === 'development') {
  console.log('Firebase initialized with config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey?.substring(0, 5) + '...',
  });
}

export { firebase, auth, database, firestore };