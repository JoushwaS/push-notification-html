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

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
const vapidKey =
  "BIbCuXSemIsQGW8qGGNr_3pN0zgZ-LFlc6hQ_3oUTfWEJmaYePhqO5X8sI-489pA_GpInc-F6XhSxnU9MpsopjI";

// Register the service worker for background notifications
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service worker successfully registered:", registration);
    })
    .catch((err) => {
      console.error("Service Worker registration failed:", err);
    });
}

// Request permission to display notifications
function requestNotificationPermission() {
  return Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      return messaging.getToken();
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
}
messaging.onMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received foreground message ",
    payload
  );
  if (Notification.permission === "granted") {
    // const notification = new Notification(payload.notification.title, {
    //   body: payload.notification.body,
    //   icon: "/your-icon-url.png",
    // });
    // notification.onclick((event) => {
    //   console.log("Notification clicked!");
    // });

    const title = payload.notification.title; // Your title
    const body = payload.notification.body; // Your body text

    toastr.info(`${title}<br>${body}`, "Notification", {
      positionClass: "toast-top-right", // Positioning of the toast
      timeOut: "3000", // Duration in milliseconds
      closeButton: true, // Show close button
      progressBar: true, // Show progress bar
      enableHtml: true, // Allow HTML content in the toast
    });
  }
  // self.registration.showNotification(notificationTitle, notificationOptions);
});

requestNotificationPermission();
// const auth = firebase.auth();
const db = firebase.firestore();

// Get DOM elements
const authModal = document.getElementById("authModal");
const authButton = document.getElementById("authButton");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const errorMessage = document.getElementById("errorMessage");
const mainContent = document.getElementById("mainContent");
const userEmailSpan = document.getElementById("userEmail");
const logoutButton = document.getElementById("logoutButton");
const notificationToggle = document.getElementById("notificationToggle");
const notificationHistory = document.getElementById("notificationHistory");

// Function to subscribe to a topic
function subscribeToTopic(token, topic) {
  const apiUrl =
    "https://us-central1-trade-hero-5b25d.cloudfunctions.net/subscribeToTopic"; // Replace with your API endpoint

  // Make a POST request to subscribe to the topic
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`, // Include token in headers if required
    },
    body: JSON.stringify({ data: { token: token, topic: topic } }),
  })
    .then((response) => {
      console.log("response ", response);
      if (response.successCount) {
        alert("Subscribed to Topic");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Successfully subscribed to topic:", data);
    })
    .catch((error) => {
      console.log("Error subscribing to topic:", error);
    });
}

// Function to unsubscribe from a topic
function unsubscribeFromTopic(token, topic) {
  // Use Firebase Admin SDK on your backend to handle topic unsubscriptions

  const apiUrl =
    "https://us-central1-trade-hero-5b25d.cloudfunctions.net/unsubscribeFromTopic"; // Replace with your API endpoint

  // Make a POST request to subscribe to the topic
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${token}`, // Include token in headers if required
    },
    body: JSON.stringify({ data: { token: token, topic: topic } }),
  })
    .then((response) => {
      console.log("response ", response);
      if (response.successCount) {
        alert("Subscribed to Topic");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Successfully subscribed to topic:", data);
    })
    .catch((error) => {
      console.log("Error subscribing to topic:", error);
    });
}

// Toggle event listener to trigger subscription/unsubscription
notificationToggle.addEventListener("change", async function (event) {
  const user = firebase.auth().currentUser;

  if (!user) {
    console.error("User is not logged in.");
    event.target.checked = false;
    return;
  }

  // Get the device token
  const token = await messaging.getToken();
  console.log("token>>>>", token);
  if (event.target.checked) {
    console.log("Subscribing to topic...", token);
    subscribeToTopic(token, "test");
  } else {
    console.log("Unsubscribing from topic...");
    unsubscribeFromTopic(token, "test");
  }
});

// Show authentication modal
function showAuthModal() {
  console.log("Showing authentication modal.");
  authModal.style.display = "flex";
}

// Close authentication modal
function closeAuthModal() {
  console.log("Closing authentication modal.");
  authModal.style.display = "none";
}

// Display error messages
function showError(message) {
  console.log("Displaying error message:", message);
  errorMessage.style.display = "block";
  errorMessage.textContent = message;
}

// Clear error messages
function clearError() {
  console.log("Clearing error message.");
  errorMessage.style.display = "none";
  errorMessage.textContent = "";
}

// Handle user login
authButton.addEventListener("click", () => {
  const email = authEmail.value.trim();
  const password = authPassword.value.trim();

  console.log("Login button clicked with email:", email);

  if (email === "" || password === "") {
    showError("Please enter both email and password.");
    return;
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User signed in successfully:", userCredential.user.email);
      closeAuthModal();
      clearError();
      mainContent.style.display = "block";
      userEmailSpan.textContent = userCredential.user.email;
      renderNotificationHistory(); // Load notification history on login
    })
    .catch((error) => {
      console.error("Login failed:", error);
      showError("Login failed: " + error.message);
    });
});

// Handle user logout
logoutButton.addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User signed out successfully.");
      mainContent.style.display = "none";
      showAuthModal();
    })
    .catch((error) => {
      console.error("Sign out failed:", error);
    });
});

// Listen for authentication state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("User is authenticated:", user.email);
    closeAuthModal();
    mainContent.style.display = "block";
    userEmailSpan.textContent = user.email;
    renderNotificationHistory(); // Load notification history on login
  } else {
    console.log("No user is authenticated.");
    showAuthModal();
    mainContent.style.display = "none";
  }
});

// OneSignal Initialization
window.OneSignal = window.OneSignal || [];
// OneSignal.push(function () {
//   console.log("Initializing OneSignal.");
//   OneSignal.init({
//     appId: "a5ebc02c-1e78-4679-b768-c3255fc4f5f4", // Replace with your actual OneSignal App ID
//     autoRegister: false, // Prevent auto-prompt on page load
//     notifyButton: {
//       enable: false, // Disable the default OneSignal notify button
//     },
//     promptOptions: {
//       slidedown: {
//         enabled: true,
//         autoPrompt: false, // Control when to prompt manually
//       },
//     },
//   });

//   // Function to update Firestore subscription status
//   function updateFirestoreSubscriptionStatus(userId, isSubscribed) {
//     console.log(
//       `Updating Firestore for user ${userId} with isSubscribed: ${isSubscribed}`
//     );
//     db.collection("users")
//       .doc(userId)
//       .set(
//         {
//           isSubscribed: isSubscribed,
//         },
//         { merge: true }
//       )
//       .then(() => {
//         console.log(
//           `Subscription status updated in Firestore: ${isSubscribed}`
//         );
//       })
//       .catch((error) => {
//         console.error("Error updating Firestore subscription status:", error);
//       });
//   }

//   // Check if the user is subscribed and update the toggle state
//   function updateToggleState() {
//     // OneSignal.isPushNotificationsEnabled(function (isEnabled) {
//     //   console.log("Push Notifications Enabled:", isEnabled);
//     //   notificationToggle.checked = isEnabled; // Set toggle based on subscription status
//     // });
//   }

//   // Initialize the page by updating the toggle state
//   updateToggleState();

//   // Toggle event listener to trigger subscription/unsubscription
//   notificationToggle.addEventListener("change", function (event) {
//     const user = firebase.auth().currentUser; // Get the current logged-in user

//     if (!user) {
//       console.error("User is not logged in.");
//       event.target.checked = false;
//       return;
//     }

//     if (event.target.checked) {
//       console.log("User opted in for notifications.");
//       // Trigger OneSignal subscription prompt
//       OneSignal.showSlidedownPrompt()
//         .then(function () {
//           console.log("User subscribed to push notifications.");
//           updateToggleState(); // Update the toggle after subscription
//           updateFirestoreSubscriptionStatus(user.uid, true); // Update Firestore status to subscribed
//         })
//         .catch(function (error) {
//           console.log("Error during subscription:", error);
//           event.target.checked = false; // Reset toggle if an error occurred
//         });
//     } else {
//       console.log("User opted out of notifications.");
//       // Unsubscribe from OneSignal notifications
//       OneSignal.setSubscription(false)
//         .then(function () {
//           console.log("User unsubscribed from push notifications.");
//           updateToggleState(); // Update the toggle after unsubscription
//           updateFirestoreSubscriptionStatus(user.uid, false); // Update Firestore status to unsubscribed
//         })
//         .catch(function (error) {
//           console.log("Error during unsubscription:", error);
//           event.target.checked = true; // Reset toggle if an error occurred
//         });
//     }
//   });

//   // Listen for subscription changes to update the toggle
//   // OneSignal.on("subscriptionChange", function (isSubscribed) {
//   //   console.log(
//   //     "Subscription state changed. Is subscribed:",
//   //     isSubscribed
//   //   );
//   //   notificationToggle.checked = isSubscribed; // Keep the toggle synced with the subscription status

//   //   const user = firebase.auth().currentUser;
//   //   if (user) {
//   //     updateFirestoreSubscriptionStatus(user.uid, isSubscribed); // Sync subscription status with Firestore
//   //   }
//   // });
// });

// Function to render notification history (fetch from Firestore)
function renderNotificationHistory() {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.error("User is not logged in.");
    return;
  }

  console.log(`Fetching notification history for user ${user.uid}.`);

  // Fetch notification history from Firestore
  db.collection("users")
    .doc(user.uid)
    .collection("notifications")
    .orderBy("timestamp", "desc")
    .limit(10)
    .get()
    .then((querySnapshot) => {
      notificationHistory.innerHTML = ""; // Clear previous history
      if (querySnapshot.empty) {
        console.log("No notifications found for this user.");
        notificationHistory.innerHTML = "<p>No notifications found.</p>";
        return;
      }
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Notification:", data);
        const card = document.createElement("div");
        card.className = "history-card";

        const title = document.createElement("div");
        title.className = "history-title";
        title.textContent = data.title;

        const message = document.createElement("div");
        message.className = "history-message";
        message.textContent = data.message;

        const time = document.createElement("div");
        time.className = "history-timestamp";
        time.textContent = data.timestamp.toDate().toLocaleString();

        card.appendChild(title);
        card.appendChild(message);
        card.appendChild(time);
        notificationHistory.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error fetching notification history:", error);
      notificationHistory.innerHTML = "<p>Error loading notifications.</p>";
    });
}

// Example: Add sample notifications to Firestore (for demonstration purposes only)
// Remove or comment out this section in production
/*
            function addSampleNotifications() {
              const user = firebase.auth().currentUser;
              if (user) {
                const notificationsRef = db.collection('users').doc(user.uid).collection('notifications');
                notificationsRef.add({
                  title: "Trade Alert: AAPL",
                  message: "Apple Inc. has reached a new high!",
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                notificationsRef.add({
                  title: "Trade Alert: TSLA",
                  message: "Tesla Motors is experiencing high volatility.",
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                notificationsRef.add({
                  title: "Trade Alert: AMZN",
                  message: "Amazon announces new product launch.",
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
              }
            }

            // Uncomment to add sample notifications
            // firebase.auth().onAuthStateChanged((user) => {
            //   if (user) {
            //     addSampleNotifications();
            //   }
            // });
            */
