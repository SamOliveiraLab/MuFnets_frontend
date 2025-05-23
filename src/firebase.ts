// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyDy1QlIH5v0M8qd8ch3DBbpFHjtEcZ83ZE",
  authDomain: "mufnets.firebaseapp.com",
  projectId: "mufnets",
  storageBucket: "mufnets.firebasestorage.app",
  messagingSenderId: "130745748558",
  appId: "1:130745748558:web:8c7caf5a37754d0d66c71f",
  measurementId: "G-KNFV6ZZBF2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
