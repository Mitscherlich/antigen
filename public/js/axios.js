import axios from 'axios';

export const axiosJson = axios.create({
  baseURL: process.env.API_URL || window.location.href,
  headers: {
    Accepts: 'appliaction/json'
  }
});
