import { USER_STORAGE } from "./storageDTO";
import { UserDTO } from "../DTOs/UserDTO";

export function storageUserSave(user: UserDTO) {
  localStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export function storageUserGet() {
  const storage = localStorage.getItem(USER_STORAGE);

  const user: UserDTO = storage ? JSON.parse(storage) : {};

  return user;
}

export function storageUserRemove() {
  localStorage.removeItem(USER_STORAGE);
}