import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "@firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAaoBkb_acP8OqO982-vnPrrmIhgYbaEkE",
  authDomain: "pathway-checker.firebaseapp.com",
  projectId: "pathway-checker",
  storageBucket: "pathway-checker.firebasestorage.app",
  messagingSenderId: "835907863840",
  appId: "1:835907863840:web:219785c4cbcb7756ff0345",
  measurementId: "G-BMRN07E65R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);



