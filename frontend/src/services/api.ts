import axios, { AxiosInstance } from "axios";
import { storageTokenGet } from "../storage/storageToken";
import { AppError } from "../utils/AppError";

type SignOut = () => void;
type Navigate = (to: string) => void;


type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut, navigate?: Navigate) => () => void;
};

const api = axios.create({
  baseURL: "http://localhost:3000",
}) as APIInstanceProps;

api.registerInterceptTokenManager = (signOut, navigate) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      const storedTokenData = storageTokenGet();
      
      if (storedTokenData?.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedTokenData.token}`;
      }

      if (
        requestError.response?.status === 401 &&
        requestError.response.data.message !== "Crendenciais inválidas."
      ) {
        if (navigate) {
          navigate("/login");
        } else {
          window.location.href = "/login";
        }

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