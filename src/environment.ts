const env = {
  mode: process.env.NEXT_PUBLIC_NODE_ENV as string,
  appTitle: process.env.NEXT_PUBLIC_APP_TITLE as string,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env
    .NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
  darkModeToggle: process.env.NEXT_PUBLIC_DARK_MODE_TOGGLE as string,
  httpBackendHost: process.env.NEXT_PUBLIC_BACKEND_HTTP as string,
  graphqlBackendHost: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL as string,
};

export default env;
