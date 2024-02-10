import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6KrSeDKsc0vVEoBW6gFD2gWRAKf1i0LA",
  authDomain: "account-hub-27291.firebaseapp.com",
  databaseURL: "https://account-hub-27291-default-rtdb.firebaseio.com",
  projectId: "account-hub-27291",
  storageBucket: "account-hub-27291.appspot.com",
  messagingSenderId: "474207823155",
  appId: "1:474207823155:web:39380a49ac4a12eb6e8a46",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage, app };
