import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3Xc83ieVDHfPBqGagQCaODvE4eX7FT-o",
  authDomain: "aplikasi-pegawai-e6c26.firebaseapp.com",
  projectId: "aplikasi-pegawai-e6c26",
  storageBucket: "aplikasi-pegawai-e6c26.firebasestorage.app",
  messagingSenderId: "171975332712",
  appId: "1:171975332712:web:41fef7021abc6c7b31fcdd",
  measurementId: "G-ZQB3D4ZPDL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

