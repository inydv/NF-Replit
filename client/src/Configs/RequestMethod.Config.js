/* eslint-disable no-undef */
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Request = axios.create({
  baseURL: BASE_URL + "/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json", 'Accept': 'application/json' },
});

export { Request };
