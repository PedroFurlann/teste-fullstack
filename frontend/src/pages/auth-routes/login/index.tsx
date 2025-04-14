import { motion } from "framer-motion";
import AuthNavBar from "../../../components/AuthNavBar";
import Lottie from "lottie-react";
import agreeAnimation from "../../../lib/lottie/agree.json";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../../hooks/useAuth";
import { AppError } from "../../../utils/AppError";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import useWindowSize from "../../../hooks/useWindowsSize";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import TextInput from "../../../components/Inputs/TextInput";
import { formatCPF } from "../../../utils/formatCPF";
import PasswordInput from "../../../components/Inputs/PasswordInput";
import LoginTypeRadioInput from "../../../components/Inputs/LoginTypeRadioButton";
import { useState } from "react";


export default function Login() {
  const { isMobile } = useWindowSize();
  const { signIn, isLoadingUserStorageData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    type: yup
      .string()
      .oneOf(['cpf', 'email'])
      .required('Selecione o tipo de login'),

    identifier: yup
      .string()
      .required('O CPF ou E-mail é obrigatório')
      .when('type', {
        is: 'cpf',
        then: (schema) =>
          schema
            .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
            .required('O CPF é obrigatório'),
        otherwise: (schema) =>
          schema
            .matches(
              /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              "Email inválido"
            )
            .required('O E-mail é obrigatório'),
      }),

    password: yup
      .string()
      .required('A senha é obrigatória')
      .min(6, 'A senha deve conter no mínimo 6 caracteres'),
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      type: "email",
      identifier: "",
      password: "",
    },
  });

  async function handleSignIn({ type, identifier, password }: FormData) {
    setIsSubmitting(true);

    const formattedIdentifier = type === "cpf" ? identifier.replace(/\D/g, "") : identifier;

    try {

      await signIn(type, formattedIdentifier, password);

      toast.success("Login realizado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível realizar o login. Tente novamente mais tarde.";

      toast.error(title, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return isLoadingUserStorageData ? (
    <div className="min-h-screen flex flex-col bg-zinc-950 overflow-y-auto items-center justify-center">
      <Loader />
    </div>
  ) : (
    <div className="min-h-screen flex flex-col bg-zinc-950 overflow-y-auto">
      <AuthNavBar />
      <div className="px-6 py-20 flex flex-col items-center justify-center flex-grow md:flex-row gap-12 md:gap-24">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Lottie
            animationData={agreeAnimation}
            loop={true}
            style={{
              width: isMobile ? 200 : 350,
              height: isMobile ? 200 : 350,
              marginTop: isMobile ? 0 : -70,
            }}
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 items-center justify-center md:w-80 w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.p
            className="text-2xl text-gray-200 font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Login
          </motion.p>

          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <LoginTypeRadioInput
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.type && (
              <p className="text-red-500 text-sm font-bold self-start mt-[-16px]">
                {errors.type.message}
              </p>
            )}
          </motion.div>

          <motion.div
            className="flex flex-col gap-2 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Controller
              control={control}
              name="identifier"
              render={({ field }) => (
                <TextInput
                  placeholder={
                    watch("type") === "cpf" ? "Digite seu CPF" : "Digite seu Email"
                  }
                  value={field.value}
                  onChange={(e) => {
                    const value =
                      watch("type") === "cpf"
                        ? formatCPF(e.target.value)
                        : e.target.value;
                    field.onChange(value);
                  }}
                />
              )}
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm font-bold self-start mt-[-16px]">
                {errors.identifier.message}
              </p>
            )}
          </motion.div>

          <motion.div
            className="flex flex-col gap-2 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <PasswordInput value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm font-bold self-start mt-[-16px]">
                {errors.password.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              label={isSubmitting ? "Logando..." : "Entrar"}
              onClick={handleSubmit(handleSignIn)}
              disabled={isSubmitting}
              style={{ marginTop: 10 }}
            />
          </motion.div>

          <motion.div
            className="flex flex-col gap-2 w-full justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="font-bold text-center text-md text-gray-200">
              Ainda não possui uma conta?
              <p
                onClick={() => navigate("/register")}
                className="text-violet-600 text-center text-md hover:cursor-pointer font-bold hover:opacity-70 transition-all ease-in-out duration-300"
              >
                Cadastre-se aqui
              </p>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
