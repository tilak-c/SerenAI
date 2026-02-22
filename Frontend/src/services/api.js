import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URI,
  withCredentials: true // IMPORTANT for sessions
});

export default API;

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const logoutUser = () =>
  API.post("/auth/logout");

export const checkAuth = () =>
  API.get("/auth/check");

export const getChats = () =>
  API.get("/chat");

export const getChatById = (id) =>
  API.get(`/chat/${id}`);

export const sendMessage = (data) =>
  API.post("/chat", data);

export const deleteChat = (id) =>
  API.delete(`/chat/${id}`);