import axios from "axios";

const Base_url = "http://localhost:8000/api";
// const Base_url = "https://labconnect.pythonanywhere.com/api";
export default axios.create({
  baseURL: Base_url,
});

export const axiosPrivate = axios.create({
  baseURL: Base_url,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

