import { ref, get, set } from "firebase/database";
import { db } from "../../../Config/firebase"; // Import your Firebase Realtime Database configuration

const loadStateFromFirebase = async () => {
  try {
    debugger;
    const dataRef = ref(db, "reduxState");
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return snapshot.val(); // Default state if no data exists in Firebase
    }
  } catch (error) {
    console.error("Error loading state from Firebase:", error);
    return undefined;
  }
};

const saveStateToFirebase = async (state) => {
  try {
    debugger;
    const dataRef = ref(db, "reduxState");
    await set(dataRef, state);
  } catch (error) {
    console.error("Error saving state to Firebase:", error);
  }
};

const firebaseMiddleware = (store) => (next) => async (action) => {
  const result = next(action);

  if (action.type !== "IGNORE_FIREBASE") {
    const state = store.getState();
    await saveStateToFirebase(state);
  }

  return result;
};

export const initializeFirebaseState = async (store) => {
  try {
    debugger;
    const persistedState = await loadStateFromFirebase();
    if (persistedState !== undefined) {
      store.dispatch({ type: "INITIALIZE_STATE", payload: persistedState });
    }
  } catch (error) {
    console.error("Error initializing state from Firebase:", error);
  }
};

export default firebaseMiddleware;
