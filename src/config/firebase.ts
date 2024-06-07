
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyD2MmPCYwP1ZDv3uaY--ULUMzW4q34BJMs",
  authDomain: "expense-tracker-app-by-ram.firebaseapp.com",
  projectId: "expense-tracker-app-by-ram",
  storageBucket: "expense-tracker-app-by-ram.appspot.com",
  messagingSenderId: "1060799526299",
  appId: "1:1060799526299:web:55a2e92781da5b22711d3e"
};

const app = initializeApp(firebaseConfig);

export const auth  = getAuth(app)

export const provider = new  GoogleAuthProvider()

export const db  = getFirestore(app)