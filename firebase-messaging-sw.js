// Import the Firebase scripts needed for FCM
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js"
);

// Initialize Firebase app in the service worker with your configuration
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

// Retrieve Firebase Messaging to handle background messages
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/your-icon-url.png", // Optional: Add your custom icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
// Handle notification click event
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Close the notification

  // Define the URL to redirect to when the notification is clicked
  const redirectUrl = "https://google.com"; // Change this to your desired URL

  // Open the URL in the current tab or a new one
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      const client = clientsArr.find(
        (client) => client.url === redirectUrl && "focus" in client
      );
      if (client) {
        // If the page is already open, focus on it
        return client.focus();
      } else {
        // Otherwise, open a new tab
        return clients.openWindow(redirectUrl);
      }
    })
  );
});
