import axios from 'axios';

export const loginUser = (token) => {
  return {
    type: 'LOGIN_USER',
    payload: token,
  };
};

export const logoutUser = () => {
  return {
    type: 'LOGOUT_USER',
  };
};


export const generateReport = (filters) => async (dispatch) => {
  try {
    dispatch({ type: 'REPORT_LOADING' });

    const { data } = await axios.post('/api/reports/generate', filters);
    dispatch({ type: 'REPORT_SUCCESS', payload: data.report });
  } catch (err) {
    dispatch({ type: 'REPORT_FAIL', payload: err.response.data.message });
  }
};

export const getReports = (filters) => async (dispatch) => {
  try {
    dispatch({ type: 'REPORT_LOADING' });

    const { data } = await axios.get('/api/reports', { params: filters });
    dispatch({ type: 'REPORT_SUCCESS', payload: data.reports });
  } catch (err) {
    dispatch({ type: 'REPORT_FAIL', payload: err.response.data.message });
  }
};
