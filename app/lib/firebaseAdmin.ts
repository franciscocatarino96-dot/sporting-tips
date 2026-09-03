import { cert, getApps, initializeApp } from "firebase-admin/app";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

const firebaseAdminApp =
  getApps().length === 0
    ? initializeApp(firebaseAdminConfig)
    : getApps()[0];

export default firebaseAdminApp;