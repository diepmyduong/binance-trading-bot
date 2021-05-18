import { Request, Response } from "express";
import { configs } from "../../configs";
export default [
  {
    method: "get",
    path: "/fcm",
    midd: [],
    action: async (req: Request, res: Response) => {
      res.render("fcm", { config: configs.firebaseView });
    },
  },
  {
    method: "get",
    path: "/firebase-messaging-sw.js",
    midd: [],
    action: async (req: Request, res: Response) => {
      return res.status(200).type(".js").send(`
      importScripts('https://www.gstatic.com/firebasejs/6.5.0/firebase-app.js');
      importScripts('https://www.gstatic.com/firebasejs/6.5.0/firebase-messaging.js');

      var firebaseConfig = JSON.parse(${JSON.stringify(configs.firebaseView)});
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      const messaging = firebase.messaging();
      
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
