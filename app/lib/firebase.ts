import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4BL8UtPadYrwAJMU4p_NuAsW09nvkQQk",
  authDomain: "lions-league-682b1.firebaseapp.com",
  projectId: "lions-league-682b1",
  storageBucket: "lions-league-682b1.firebasestorage.app",
  messagingSenderId: "304819445071",
  appId: "1:304819445071:web:fc6e1e9fe8fa167bd3793a",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);