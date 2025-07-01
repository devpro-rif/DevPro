// import axios from "axios";

// export const api = axios.create({
//   baseURL: "http://localhost:4000/api", 
// });
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

/* 👉 automatically attach the JWT (if it exists) */
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token"); // or however you store it
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
