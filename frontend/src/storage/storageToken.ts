import { AUTH_TOKEN_STORAGE } from "./storageDTO";

interface StorageAuthTokenProps {
  token: string;
}

export function storageTokenSave({ token }: StorageAuthTokenProps) {
   localStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify({ token }));
}

export function storageTokenGet() {
  const response =  localStorage.getItem(AUTH_TOKEN_STORAGE);

  const { token }: StorageAuthTokenProps = response ? JSON.parse(response) : {};

  return { token };
}

export function storageTokenRemove() {
   localStorage.removeItem(AUTH_TOKEN_STORAGE);
}