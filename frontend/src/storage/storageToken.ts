import { AUTH_TOKEN_STORAGE } from "./storageDTO";

export function storageTokenSave({ token }: { token: string }) {
  localStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify({ token }));
}

export function storageTokenGet(): { token: string } | null {
  const stored = localStorage.getItem(AUTH_TOKEN_STORAGE);
  return stored ? JSON.parse(stored) : null;
}

export function storageTokenRemove() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE);
}