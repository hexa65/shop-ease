import { isAxiosError } from "axios";

// True when the server answered "404 Not Found".
// Used to tell "this does not exist" apart from "the network failed".
export function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}
