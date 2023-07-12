import axios from "axios";

export const instance = axios.create({
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   },
   baseURL: "http://localhost:5000/api",
});
