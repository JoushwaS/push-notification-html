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

messaging.onBackgroundMessage(async function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };


  // Get all notifications that are currently shown
  const existingNotifications = await self.registration.getNotifications();

  // Check if a notification with the same title and body is already shown
  const isDuplicate = existingNotifications.some(
    (notification) =>
      notification.title === notificationTitle &&
      notification.body === notificationOptions.body
  );

  // Only show notification if it's not a duplicate
  if (!isDuplicate) {
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
// Handle notification click event
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Close the notification

  // Define the URL to redirect to when the notification is clicked
  const redirectUrl = "https://trade-hero-notification.web.app"; // Change this to your desired URL

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
// messaging.onMessage(function (payload) {
//   console.log(
//     "[firebase-messaging-sw.js] Received foreground message ",
//     payload
//   );
//   if (Notification.permission === "granted") {
//     const notification = new Notification(payload.notification.title, {
//       body: payload.notification.body,
//       icon: "/your-icon-url.png",
//     });
//     notification.onclick((event) => {
//       console.log("Notification clicked!");
//     });
//   }
//   // self.registration.showNotifica tion(notificationTitle, notificationOptions);
// });
