import { createStore, applyMiddleware } from "redux";
import idReducer from "./reducers";
import firebaseMiddleware, {
  initializeFirebaseState,
} from "./firebaseMiddleware";

const store = createStore(idReducer, applyMiddleware(firebaseMiddleware));

initializeFirebaseState(store); // Initialize Firebase state

export default store;
