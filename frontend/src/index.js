// /src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './redux/store'; // Import the Redux store
import App from './App'; // Import the main App component

// Get the root DOM element to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the Provider to make Redux store available to the app
root.render(
  <Provider store={store}> {/* Wrap the app with Provider to connect Redux */}
    <App />
  </Provider>
);
