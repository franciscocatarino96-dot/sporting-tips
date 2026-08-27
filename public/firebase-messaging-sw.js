importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyC4BL8UtPadYrwAJMU4p_NuAsW09nvkQQk",
  authDomain: "lions-league-682b1.firebaseapp.com",
  projectId: "lions-league-682b1",
  storageBucket: "lions-league-682b1.firebasestorage.app",
  messagingSenderId: "304819445071",
  appId: "1:304819445071:web:fc6e1e9fe8fa167bd3793a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(
  function (payload) {
    console.log(
      "[firebase-messaging-sw.js] Mensagem recebida:",
      payload
    );

    const notificationTitle =
      payload.notification?.title ||
      "Lions League 🦁";

    const notificationOptions = {
      body:
        payload.notification?.body ||
        "Tens uma nova notificação.",
      icon: "/logos/sporting.png",
    };

    self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  }
);