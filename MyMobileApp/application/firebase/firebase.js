// application/firebase.js
import { initializeApp } from 'firebase/app';

// application/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };


// TODO: set up proper security rules before production
// update security rules within 30 days for long term client read write access
// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if
//           request.time < timestamp.date(2026, 3, 1);
//     }
//   }
// }