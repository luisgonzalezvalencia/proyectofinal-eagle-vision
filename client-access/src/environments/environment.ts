export const environment = {
  production: import.meta.env.NG_APP_IS_PRODUCTION,
  firebase: {
    projectId: import.meta.env.NG_APP_FIREBASE_PROJECT_ID,
    appId: import.meta.env.NG_APP_FIREBASE_APP_ID,
    storageBucket: import.meta.env.NG_APP_FIREBASE_STORAGE_BUCKET,
    apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.NG_APP_FIREBASE_AUTH_DOMAIN,
    messagingSenderId: import.meta.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: import.meta.env.NG_APP_FIREBASE_MEASUREMENT_ID,
  },
};
