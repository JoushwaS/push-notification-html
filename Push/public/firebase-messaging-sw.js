// Initialize Firebase app in the service worker with your configuration
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging to handle background messages
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

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
