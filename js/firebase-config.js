// js/firebase-config.js

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyDG-B0RENmdHuZ5wkwnA7_CK3If8dRHGEY",
  authDomain: "wv-planungstool.firebaseapp.com",
  projectId: "wv-planungstool",
  storageBucket: "wv-planungstool.firebasestorage.app",
  messagingSenderId: "879920840021",
  appId: "1:879920840021:web:893409be06f6ad7ae903dc",
  measurementId: "G-F5T4LN47W8",
  databaseURL: "https://wv-planungstool-default-rtdb.europe-west1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
