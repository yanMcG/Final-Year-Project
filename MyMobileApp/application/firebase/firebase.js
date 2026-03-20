//Import the functions I need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";

//web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGhB1QtdcJPX_srwDEmVRzwOsowc1hmHI",
  authDomain: "gen-lifts.firebaseapp.com",
  projectId: "gen-lifts",
  storageBucket: "gen-lifts.firebasestorage.app",
  messagingSenderId: "388605129577",
  appId: "1:388605129577:web:141e0441d8eaff6e04c3f8",
  measurementId: "G-L4ZWMV2J1K"
};


//Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


//functions to interact with Firestore
const getReps = async() => {
    const docRef = doc(db, 'reps', 'currentRep');
    const docSnap = await getDoc(docRef);
    return docSnap.data().repetitions;
}


// This function will update the reps in Firestore. It takes a string input, converts it to an integer, and updates the 'currentRep' document in the 'reps' collection.
const uploadReps = async(newReps) => {
    const docRef = doc(db, 'reps', 'currentRep');
    let result = await updateDoc(docRef, {
        repetitions: parseInt(newReps)
    });
    return newReps;
}


// Export the functions and db reference so they can be used in other parts of the app
export { getReps, uploadReps, db };