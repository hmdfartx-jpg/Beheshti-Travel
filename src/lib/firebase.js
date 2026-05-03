import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAHflT21UKxuKziWkgyzf-ZbWbRoIgd8m4",
  authDomain: "beheshti-travel.firebaseapp.com",
  projectId: "beheshti-travel",
  storageBucket: "beheshti-travel.firebasestorage.app",
  messagingSenderId: "208294348424",
  appId: "1:208294348424:web:004ac5c16ef9650aa9413d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// این خط اضافه شد تا ارور فایل‌های Visa، Cargo و ... برطرف شود
export const appId = firebaseConfig.appId;