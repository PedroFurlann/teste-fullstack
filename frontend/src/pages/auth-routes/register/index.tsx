import AuthNavBar from "../../../components/AuthNavBar";
import Lottie from "lottie-react";
import fillFormAnimation from "../../../lib/lottie/fillForm.json";
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
import PasswordInput from "../../../components/Inputs/PasswordInput";
import CPFInput from "../../../components/Inputs/CpfInput";
import PhoneInput from "../../../components/Inputs/PhoneInput";
import { motion } from "framer-motion";
import { api } from "../../../services/api";
import { useState } from "react";

const validationSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório").min(5, "O Nome deve ter pelo menos 5 caracteres"),
  cpf: yup
    .string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
    .required("O CPF é obrigatório"),
  phone: yup
    .string()
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido")
    .required("O telefone é obrigatório"),
  email: yup
    .string()
    .matches(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Email inválido"
    )
    .required("O E-mail é obrigatório"),
  password: yup
    .string()
    .required("A senha é obrigatória")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("A confirmação de senha é obrigatória"),
});

type FormData = yup.InferType<typeof validationSchema>;

export default function Register() {
  const { isMobile } = useWindowSize();
  const { signIn, isLoadingUserStorageData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(handleSignUp)();
    }
  };

  async function handleSignUp({ name, email, password, cpf, phone }: FormData) {
    setIsSubmitting(true);


    const formattedCpf = cpf.replace(/\D/g, "");
    const formattedPhone = phone.replace(/\D/g, "");

    const userData = {
      name,
      cpf: formattedCpf,
      phone: formattedPhone,
      email,
      password,
    };

    try {
      await api.post("/customers", userData);
      await signIn("email", email, password);

      navigate("/available-properties");

      toast.success("Usuário criado com sucesso!", {
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
        : "Não foi possível criar a conta. Tente novamente mais tarde.";

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
    <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto items-center justify-center">
      <Loader />
    </div>
  ) : (
    <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto">
      <AuthNavBar />
      <div className="px-6 py-20 flex flex-col items-center justify-center flex-grow md:flex-row gap-12 md:gap-24">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Lottie
            animationData={fillFormAnimation}
            loop
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
          onKeyDown={handleKeyDown}
        >
          <motion.p
            className="text-2xl text-gray-200 font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Cadastre-se
          </motion.p>

          <motion.div
            className="flex flex-col gap-2 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput
                  placeholder="Nome completo"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm font-bold mt-[-16px]">
                {errors.name.message}
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
              name="cpf"
              render={({ field }) => (
                <CPFInput value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.cpf && (
              <p className="text-red-500 text-sm font-bold mt-[-16px]">
                {errors.cpf.message}
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
              name="phone"
              render={({ field }) => (
                <PhoneInput value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm font-bold mt-[-16px]">
                {errors.phone.message}
              </p>
            )}
          </motion.div>

          <motion.div
            className="flex flex-col gap-2 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextInput
                  placeholder="E-mail"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm font-bold mt-[-16px]">
                {errors.email.message}
              </p>
            )}
          </motion.div>

          <motion.div
            className="flex flex-col gap-2 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <PasswordInput
                  placeholder="Senha"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm font-bold mt-[-16px]">
                {errors.password.message}
              </p>
            )}
          </motion.div>

          <motion.div
            className="flex flex-col gap-2 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Controller
              control={control}
              name="confirm_password"
              render={({ field }) => (
                <PasswordInput
                  placeholder="Confirmar senha"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-sm font-bold mt-[-16px]">
                {errors.confirm_password.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              label={isSubmitting ? "Cadastrando..." : "Cadastrar"}
              onClick={handleSubmit(handleSignUp)}
              style={{ marginTop: 10 }}
              disabled={isSubmitting}
            />
          </motion.div>

          <motion.div
            className="flex flex-col gap-2 w-full justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="font-bold text-center text-md text-gray-200">
              Já possui uma conta?
              <p
                onClick={() => navigate("/login")}
                className="text-violet-600 text-center text-md hover:cursor-pointer font-bold hover:opacity-70 transition-all ease-in-out duration-300"
              >
                Faça login aqui
              </p>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
