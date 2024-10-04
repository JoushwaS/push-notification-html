// Import Firebase scripts for the service worker
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js"
);

// Initialize Firebase app inside the service worker
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2o0L88jjjvVpg7y-4jRJ9BiLJsQ1kEPI",
  authDomain: "trade-hero-5b25d.firebaseapp.com",
  databaseURL: "https://trade-hero-5b25d-default-rtdb.firebaseio.com",
  projectId: "trade-hero-5b25d",
  storageBucket: "trade-hero-5b25d.appspot.com",
  messagingSenderId: "478020624328",
  appId: "1:478020624328:web:16c0ab730012f0753b6afd",
  measurementId: "G-5QKMBBGWTK",
};
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/your-icon.png", // Optional: replace with your icon path
  };

  // Display the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
