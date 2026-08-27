import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getMessaging,
  isSupported,
  Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC4BL8UtPadYrwAJMU4p_NuAsWO9nvkQQk",
  authDomain: "lions-league-682b1.firebaseapp.com",
  projectId: "lions-league-682b1",
  storageBucket: "lions-league-682b1.firebasestorage.app",
  messagingSenderId: "304819445071",
  appId: "1:304819445071:web:fc6e1e9fe8fa167bd3793a",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export let messaging: Messaging | null = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
        console.log("FIREBASE MESSAGING: disponível");
      } else {
        console.log(
          "FIREBASE MESSAGING: não suportado neste browser"
        );
      }
    })
    .catch((error) => {
      console.error(
        "ERRO AO INICIALIZAR FIREBASE MESSAGING:",
        error
      );
    });
}