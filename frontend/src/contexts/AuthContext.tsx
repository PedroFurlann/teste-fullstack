/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-catch */
import { ReactNode, createContext, useEffect, useState } from "react";
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from "../storage/storageUser";
import {
  storageTokenSave,
  storageTokenRemove,
  storageTokenGet,
} from "../storage/storageToken";
import { UserDTO } from "../DTOs/UserDTO";
import { api } from "../services/api";

export interface AuthContextDataProps {
  user: UserDTO;
  signIn: (type: 'cpf' | 'email',  identifier: string, password: string) => Promise<void>;
  isLoadingUserStorageData: boolean;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(userData);
  }

  async function getUser() {
    try {
      const { data } = await api.get("/customers");

      return data;
    } catch (error) {
      throw error;
    }
  }

  async function signIn(type: 'cpf' | 'email',  identifier: string, password: string) {
    try {
      const { data } = await api.post("/auth/customer", { type, identifier, password });

      
      if (data.access_token) {
        setIsLoadingUserStorageData(true);
        
        storageTokenSave({ token: data.access_token });
        
        api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
      }

      const { token } = storageTokenGet();
      
      if (token) {
        const user = await getUser();

        await storageUserAndTokenSave(user, token);

        await userAndTokenUpdate(user, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true);

      storageUserSave(userData);
      storageTokenSave({ token });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);

      await storageUserRemove();
      await storageTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    setIsLoadingUserStorageData(true)

    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = storageUserGet();
      const { token } = storageTokenGet();

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        isLoadingUserStorageData,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}