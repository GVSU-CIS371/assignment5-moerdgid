import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkhptAONeo-YeP99m7YwC5PqS51CtbNWg",
  authDomain: "brew-portal-5338c.firebaseapp.com",
  projectId: "brew-portal-5338c",
  storageBucket: "brew-portal-5338c.firebasestorage.app",
  messagingSenderId: "90455294252",
  appId: "1:90455294252:web:eb3cedd0a7e7df2577ec89",
  measurementId: "G-GX863X3JHW",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default db;