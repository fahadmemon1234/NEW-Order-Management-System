// reducers.js
import { INCREMENT_ID } from "./actions";

const initialState = {
  idCount: "001", // Initialize the ID count with '001'
};

const idReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_ID:
      // Increment the ID count by 1
      const newIdCount = (parseInt(state.idCount) + 1)
        .toString()
        .padStart(state.idCount.length, "0"); // Pad with zeros to maintain the length of the original ID
      return {
        ...state,
        idCount: newIdCount,
      };
    default:
      return state;
  }
};

export default idReducer;
