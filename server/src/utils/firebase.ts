import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const credential = admin.credential.cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
});

const firebaseAdminConfig: admin.AppOptions = {
  credential,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

// Initialize Firebase
admin.initializeApp(firebaseAdminConfig);
export const auth = admin.auth();
export const db = admin.firestore();
