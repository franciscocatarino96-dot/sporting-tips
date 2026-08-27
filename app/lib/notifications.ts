import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY =
  "BPhvneMREH6CrbLs4ajvYNnGDLWbYqGVrfEZgmk81JGRJ2kBHgM_NdLgWtjL-ktiCiQsqozZoObjF-MqjivoiRg";

export async function requestNotificationPermission() {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const permission =
      await Notification.requestPermission();

    console.log(
      "PERMISSÃO NOTIFICAÇÕES:",
      permission
    );

    if (permission !== "granted") {
      console.log(
        "Utilizador não autorizou notificações."
      );

      return null;
    }

    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

    console.log(
      "SERVICE WORKER REGISTADO:",
      registration
    );

    // Dar um pequeno tempo para o Firebase Messaging
    // ficar disponível
    let messagingInstance = messaging;

    for (let i = 0; i < 20 && !messagingInstance; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, 100)
      );

      messagingInstance =
        messaging;
    }

    if (!messagingInstance) {
      console.error(
        "Firebase Messaging não ficou disponível."
      );

      return null;
    }

    const token = await getToken(
      messagingInstance,
      {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration:
          registration,
      }
    );

    if (!token) {
      console.log(
        "Não foi possível obter o token."
      );

      return null;
    }

    console.log(
      "TOKEN DE NOTIFICAÇÃO:",
      token
    );

    return token;

  } catch (error) {
    console.error(
      "ERRO NAS NOTIFICAÇÕES:",
      error
    );

    return null;
  }
}