import { initializeApp } from 'firebase/app';
import { 
getAuth, 
createUserWithEmailAndPassword, 
updateProfile, 
onAuthStateChanged, 
signInWithEmailAndPassword, 
signOut,
updateEmail,
updatePassword,
} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyAzeM3Evh7VGNBHF1_CNwZRD1qLrIZXsig",
    authDomain: "online-store-4c88b.firebaseapp.com",
    projectId: "online-store-4c88b",
    storageBucket: "online-store-4c88b.appspot.com",
    messagingSenderId: "689269312031",
    appId: "1:689269312031:web:e16a4f5343e69d677fa32a",
    measurementId: "G-NMJCHNM31Y",
    databaseURL: "https://online-store-4c88b-default-rtdb.europe-west1.firebasedatabase.app",
  };
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth();
export {
    auth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    updateEmail,
    updatePassword,
    getAuth
    }
