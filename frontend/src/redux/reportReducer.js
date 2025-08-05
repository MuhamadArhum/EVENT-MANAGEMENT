// /redux/reportReducer.js
const initialState = {
  reports: [], // Array to store fetched reports
  loading: false, // Track loading state
  error: null, // Store any error that occurs while fetching reports
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REPORT_LOADING':
      return {
        ...state,
        loading: true, // Set loading to true when fetching reports
      };
    case 'REPORT_SUCCESS':
      return {
        ...state,
        loading: false, // Set loading to false once reports are fetched
        reports: action.payload, // Store the fetched reports
      };
    case 'REPORT_FAIL':
      return {
        ...state,
        loading: false, // Set loading to false if an error occurs
        error: action.payload, // Store the error message
      };
    default:
      return state;
  }
};

export default reportReducer;
