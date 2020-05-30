import { combineReducers } from 'redux';
// import participantReducer from "./participants";
// import timingReducer from "./clock";

const reducers = combineReducers({
  participants: () => ({}), // participantReducer
  clock: () => ({}), // timingReducer
});

// make the combined reducers available for import
export default reducers;
