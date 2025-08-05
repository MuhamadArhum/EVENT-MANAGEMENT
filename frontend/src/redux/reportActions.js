import axios from 'axios';

// Action Types
export const REPORT_LOADING = 'REPORT_LOADING';
export const REPORT_SUCCESS = 'REPORT_SUCCESS';
export const REPORT_FAIL = 'REPORT_FAIL';

// Action to generate a report
export const generateReport = (filters) => async (dispatch) => {
  try {
    // Start loading
    dispatch({ type: REPORT_LOADING });

    // Send POST request to the backend to generate a report
    const response = await axios.post('/api/reports/generate', filters);

    // Dispatch success action with the fetched report data
    dispatch({
      type: REPORT_SUCCESS,
      payload: response.data.report, // Adjust based on your API response structure
    });
  } catch (error) {
    // Dispatch error action in case of failure
    dispatch({
      type: REPORT_FAIL,
      payload: error.response ? error.response.data.message : error.message, // Error message
    });
  }
};

// Action to fetch reports
export const getReports = (filters) => async (dispatch) => {
  try {
    // Start loading
    dispatch({ type: REPORT_LOADING });

    // Send GET request to fetch reports
    const response = await axios.get('/api/reports', { params: filters });

    // Dispatch success action with the fetched reports
    dispatch({
      type: REPORT_SUCCESS,
      payload: response.data.reports, // Adjust based on your API response structure
    });
  } catch (error) {
    // Dispatch error action in case of failure
    dispatch({
      type: REPORT_FAIL,
      payload: error.response ? error.response.data.message : error.message, // Error message
    });
  }
};
