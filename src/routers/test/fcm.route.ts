import { Request, Response } from "express";
import config from "config";
export default [
  {
    method: "get",
    path: "/fcm",
    midd: [],
    action: async (req: Request, res: Response) => {
      res.render("fcm", { config: config.get("firebase.webConfig") });
    },
  },
  {
    method: "get",
    path: "/firebase-messaging-sw.js",
    midd: [],
    action: async (req: Request, res: Response) => {
      return res.status(200).type(".js").send(`
      importScripts('https://www.gstatic.com/firebasejs/8.7.0/firebase-app.js');
      importScripts('https://www.gstatic.com/firebasejs/8.7.0/firebase-messaging.js');

      var firebaseConfig = JSON.parse(${JSON.stringify(config.get("firebase.webConfig"))});
      console.log('firebaseConfig', firebaseConfig);
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      const messaging = firebase.messaging();

      messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
          body: 'Background Message body.',
          icon: '/firebase-logo.png'
        };
      
        self.registration.showNotification(notificationTitle,
          notificationOptions);
      });
      
      messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
          body: 'Background Message body.',
          icon: '/public/assets/firebase/firebase-logo.png'
        };
        return self.registration.showNotification(notificationTitle,
          notificationOptions);
      });
      // [END background_handler]
      `);
    },
  },
];
