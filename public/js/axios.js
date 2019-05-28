import axios from 'axios';

export const axiosJson = axios.create({
  baseURL: window.location.href,
  headers: {
    Accepts: 'appliaction/json'
  }
});
