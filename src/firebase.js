import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDcO0XZTbcX7503cVPJeb0CdjifUFTVBOE",
  authDomain: "fir-test-b7c87.firebaseapp.com",
  projectId: "fir-test-b7c87",
  storageBucket: "fir-test-b7c87.appspot.com",
  messagingSenderId: "462334573621",
  appId: "1:462334573621:web:fe33f9362e7b57813cc57c",
  measurementId: "G-L5BETCRPDJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db