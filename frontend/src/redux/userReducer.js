// /redux/userReducer.js
const initialState = {
  token: null, // The token will be stored once the user logs in
  isAuthenticated: false, // To track if the user is authenticated
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return {
        ...state,
        token: action.payload.token, // Store the token from the action payload
        isAuthenticated: true, // User is authenticated
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        token: null, // Clear the token on logout
        isAuthenticated: false, // User is logged out
      };
    default:
      return state;
  }
};

export default userReducer;
