import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWsHmmNoTZxDAW8snqu7I34lD7U07tbkQ",
  authDomain: "saferoute-53e88.firebaseapp.com",
  projectId: "saferoute-53e88",
  storageBucket: "saferoute-53e88.appspot.com",
  messagingSenderId: "984631308894",
  appId: "1:984631308894:web:9f8a09acfd690f66b5bacf",
  measurementId: "G-8XGG2DSQTT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

