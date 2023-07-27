import { initializeApp } from 'firebase/app';
import env from '@root/environment';

const firebaseConfig = {
  apiKey: env.apiKey,
  authDomain: env.authDomain,
  projectId: env.projectId,
  storageBucket: env.storageBucket,
  messagingSenderId: env.messagingSenderId,
  appId: env.appId,
  measurementId: env.measurementId,
};

// Initialize Firebase
// eslint-disable-next-line import/prefer-default-export
export const app = initializeApp(firebaseConfig);
