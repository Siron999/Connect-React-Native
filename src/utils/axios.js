import axios from 'axios';
import { store } from "../redux/store";
import { logout } from "../redux/action";

const url='https://social-nest.herokuapp.com/';
const url2='http://localhost:5000/';

const axiosInstance = axios.create({
  baseURL: url2,
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (!error.response) console.log('No error response', error);
    else if (error.response.status === 401 || error.response.status === 403) {
      console.log( error.response.status);
      await store.dispatch(logout())
    }
    throw error;
  },
);

export default axiosInstance;
