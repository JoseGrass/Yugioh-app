import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAwsRCO_3t1B7nU6v6pHaby9IMQIZ-1mE",
  authDomain: "digimon-app-562fb.firebaseapp.com",
  projectId: "digimon-app-562fb",
  storageBucket: "digimon-app-562fb.firebasestorage.app",
  messagingSenderId: "248661258552",
  appId: "1:248661258552:web:724b14c56afb0be64091cd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

