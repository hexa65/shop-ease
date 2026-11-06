import axios from "axios";
import type { AxiosInstance } from "axios";

// TypeScript says this is a string, but at runtime it can be missing
// (for example if .env was not created). So we check it.
const baseURL: string = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error(
    "VITE_API_URL is missing. Copy .env.example to .env and restart the dev server.",
  );
}

// One shared axios instance for the whole app.
// baseURL: the server root, so services only write paths like "/products".
// timeout: give up after 10 seconds instead of waiting forever.
export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Lets a page ask "was this a 404?" without importing axios itself.
// Only the data layer is allowed to know about axios.
export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
