// /redux/store.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // Import redux-thunk for handling async actions
import rootReducer from './index'; // Import the combined rootReducer from index.js

// Create the Redux store with the rootReducer and apply redux-thunk middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Apply redux-thunk middleware for async actions
);

export default store; // Export the store for use in the app
