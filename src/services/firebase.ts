import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpGrtuMEdradCoYTAPDkt7v2uE5APsEtw",
  authDomain: "colaboredatabase.firebaseapp.com",
  projectId: "colaboredatabase",
  storageBucket: "colaboredatabase.appspot.com",
  messagingSenderId: "260179286181",
  appId: "1:260179286181:web:c3aca14763ce7531e5d54c",
  measurementId: "G-SSD96RFZSN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth };
