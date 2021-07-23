// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
firebase.initializeApp(JSON.parse(publicRuntimeConfig.firebaseView));
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
if (window === 'undefined') return
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notificiation.title;
  const notificationOptions = {
    body: payload.notificiation.body,
    icon: payload.notificiation.icon
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
