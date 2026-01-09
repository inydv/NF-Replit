import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig;

if (import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT") {
  firebaseConfig = {
    apiKey: "AIzaSyDvCp5eYYUnwaouKhhRejqkqa80Gkkz5PM",
    authDomain: "nursingfront-test-env.firebaseapp.com",
    projectId: "nursingfront-test-env",
    storageBucket: "nursingfront-test-env.firebasestorage.app",
    messagingSenderId: "383102894705",
    appId: "1:383102894705:web:fa35a69844934f175011d0",
  };
} else {
  firebaseConfig = {
    apiKey: "AIzaSyB8B2jMkVcsAq9PPe809GY02jcOGG0X770",
    authDomain: "nursingfront-firebase.firebaseapp.com",
    projectId: "nursingfront-firebase",
    storageBucket: "nursingfront-firebase.firebasestorage.app",
    messagingSenderId: "647576836165",
    appId: "1:647576836165:web:fee7674b2844fea35fab2c",
    measurementId: "G-4NQ9L9HCKH",
  };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
