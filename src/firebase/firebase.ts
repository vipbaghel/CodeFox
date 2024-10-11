// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAo3VvFSQ12Qm6K6tncJfrIG6bOLMQTgwM",
  authDomain: "leetcode-64aad.firebaseapp.com",
  projectId: "leetcode-64aad",
  storageBucket: "leetcode-64aad.appspot.com",
  messagingSenderId: "370259484130",
  appId: "1:370259484130:web:1cbfd17133bebca518adbb"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) :getApp();

const auth = getAuth(app);
const firestore = getFirestore(app);

export {auth ,firestore,app};