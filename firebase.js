// ✅ Import Firebase core and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHmYNs51eTg7bBI8RzRxNpXHvU2g4J2jk",
    authDomain: "materials-74ad6.firebaseapp.com",
    projectId: "materials-74ad6",
    storageBucket: "materials-74ad6.firebasestorage.app",
    messagingSenderId: "813727251543",
    appId: "1:813727251543:web:5bda4af02f60c319753712",
    measurementId: "G-S36VWY817N"
  };

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore
const db = getFirestore(app);

// ✅ Attach to `window` for global access
window.firebaseApp = app;
window.db = db;

// ✅ Debugging
console.log("✅ Firebase App Initialized:", window.firebaseApp);
console.log("✅ Firestore Database Initialized:", window.db);
