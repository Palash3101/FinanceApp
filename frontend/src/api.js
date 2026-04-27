import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getExpenses = (filter = "All", sort = "date_desc") => {
  const params = {};
  if (filter !== "All") {
    params.category = filter;
  }
  if (sort) {
    params.sort = sort;
  }
  return api.get("/api/expenses/", { params });
};

export const addExpense = (expense) => {
  return api.post("/api/expenses/", expense);
};

export const deleteExpense = (id) => {
  return api.delete(`/api/expenses/${id}/`);
};

export const getExpenseSummary = () => {
  return api.get("/api/expenses/summary/");
};

export default api;

