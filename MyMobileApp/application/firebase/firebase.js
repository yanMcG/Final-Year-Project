// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGhB1QtdcJPX_srwDEmVRzwOsowc1hmHI",
  authDomain: "gen-lifts.firebaseapp.com",
  projectId: "gen-lifts",
  storageBucket: "gen-lifts.firebasestorage.app",
  messagingSenderId: "388605129577",
  appId: "1:388605129577:web:141e0441d8eaff6e04c3f8",
  measurementId: "G-L4ZWMV2J1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getReps = async() => {
    const docRef = doc(db, 'reps', 'currentRep');
    const docSnap = await getDoc(docRef);
    return docSnap.data().repetitions;
}

const uploadReps = async(newReps) => {
    const docRef = doc(db, 'reps', 'currentRep');
    let result = await updateDoc(docRef, {
        repetitions: parseInt(newReps)
    });
    return newReps;
}

export { getReps, uploadReps, db };