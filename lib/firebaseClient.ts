
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDofBQX5zsScMOpe0lX_mFkg6EWo8We4JA",
  authDomain: "ecommerce-9161a.firebaseapp.com",
  projectId: "ecommerce-9161a",
  storageBucket: "ecommerce-9161a.firebasestorage.app",
  messagingSenderId: "1034296304853",
  appId: "1:1034296304853:web:8803ee7201d740ae092e5c",
  measurementId: "G-X47MBXE9QZ"
};

function initFirebase() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
}

initFirebase();

export const auth = getAuth();

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
