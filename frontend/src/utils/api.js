import axios from 'axios';

// Create an Axios instance with base URL for the backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Change this to your backend URL
});

export default api;
