import axios from 'axios';

const baseURL =
  process.env.REACT_APP_API_URL !== undefined
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:5001'; // local

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
