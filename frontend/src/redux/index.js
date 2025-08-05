// /redux/index.js
import { combineReducers } from 'redux';
import userReducer from './userReducer'; // Import userReducer
import reportReducer from './reportReducer'; // Import reportReducer

// Combine the reducers into one rootReducer
const rootReducer = combineReducers({
  user: userReducer, // Manage the user state (authentication, etc.)
  reports: reportReducer, // Manage the report state (loading, error, reports)
});

export default rootReducer; // Export rootReducer as default
