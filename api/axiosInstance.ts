import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:30011",
  withCredentials: true,
});

// for auth part ja
// instance.interceptors.request.use((config: any) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default instance;
