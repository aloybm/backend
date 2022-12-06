// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRIjBuMAkyugHwASw310PScvPLsXO79HU",
  authDomain: "fppemweb-64f63.firebaseapp.com",
  projectId: "fppemweb-64f63",
  storageBucket: "fppemweb-64f63.appspot.com",
  messagingSenderId: "1076113503308",
  appId: "1:1076113503308:web:6b8085da475ee1a81eb0e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore()
export { auth, db }