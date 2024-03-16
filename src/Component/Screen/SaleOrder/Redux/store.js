// store.js
import { createStore } from "redux";
import idReducer from "./reducers";

const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log("Error loading state from session storage:", err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("reduxState", serializedState);
  } catch (err) {
    console.log("Error saving state to session storage:", err);
  }
};

const persistedState = loadState();

const store = createStore(idReducer, persistedState);

store.subscribe(() => {
  saveState({
    idCount: store.getState().idCount,
  });
});

export default store;
