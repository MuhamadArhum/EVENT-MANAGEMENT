const initialState = {
  token: null,  // The token will be stored once the user logs in
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return { ...state, token: action.payload };
    case 'LOGOUT_USER':
      return { ...state, token: null };
    default:
      return state;
  }
};

export default userReducer;
