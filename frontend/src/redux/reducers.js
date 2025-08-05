// **User Reducer** - Handles user authentication (login/logout)
const initialUserState = {
  token: null,  // The token will be stored once the user logs in
  isAuthenticated: false, // Track if the user is authenticated or not
};

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return {
        ...state,
        token: action.payload.token, // Store token from payload
        isAuthenticated: true, // Set authenticated state
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        token: null, // Clear token
        isAuthenticated: false, // Set not authenticated
      };
    default:
      return state;
  }
};

// **Report Reducer** - Handles report loading, success, and failure states
const initialReportState = {
  reports: [],
  loading: false,
  error: null, // Set null for error initially
};

const reportReducer = (state = initialReportState, action) => {
  switch (action.type) {
    case 'REPORT_LOADING':
      return {
        ...state,
        loading: true, // Set loading to true when requesting reports
      };
    case 'REPORT_SUCCESS':
      return {
        ...state,
        loading: false, // Set loading to false when reports are fetched
        reports: action.payload, // Store reports data
      };
    case 'REPORT_FAIL':
      return {
        ...state,
        loading: false, // Set loading to false if fetching reports failed
        error: action.payload, // Store error message
      };
    default:
      return state;
  }
};

// Export the reducers
export { userReducer, reportReducer };
