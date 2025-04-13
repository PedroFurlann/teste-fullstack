import axios, { AxiosInstance } from "axios";
import { storageTokenGet } from "../storage/storageToken";
import { AppError } from "../utils/AppError";

type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: "http://localhost:3000",
}) as APIInstanceProps;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      const token = storageTokenGet();

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (
        requestError.response?.status === 401 &&
        requestError.response.data.message !== "Crendenciais inválidas."
      ) {
        signOut();
      }

      if (requestError.response && requestError.response.data) {
        if(requestError.response.data.message !== "Unauthorized") {
          return Promise.reject(new AppError(requestError.response.data.message));
        }
        return Promise.reject(new AppError("Por favor, faça login novamente."));
      } else {
        return Promise.reject(requestError);
      }
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };