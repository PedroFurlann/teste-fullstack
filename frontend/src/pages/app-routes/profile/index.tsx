import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import { AppError } from "../../../utils/AppError";
import { toast } from "react-toastify";
import { api } from "../../../services/api";
import { useEffect, useState } from "react";
import { UserDTO } from "../../../DTOs/UserDTO";
import { storageUserGet } from "../../../storage/storageUser";
import Loader from "../../../components/Loader";
import Navbar from "../../../components/NavBar";
import TextInput from "../../../components/Inputs/TextInput";
import PhoneInput from "../../../components/Inputs/PhoneInput";
import CpfInput from "../../../components/Inputs/CpfInput";
import { motion } from "framer-motion";
import { formatPhone } from "../../../utils/formatPhone";
import { formatCPF } from "../../../utils/formatCPF";
import { Avatar } from "../../../components/Avatar";
import Button from "../../../components/Button";
import { FloppyDisk, SignOut, Trash } from "phosphor-react";
import { BasicModal } from "../../../components/BasicModal";

export default function Profile() {
  const [isloading, setIsLoading] = useState(true);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);


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
  });

  type FormData = yup.InferType<typeof validationSchema>;

  const { updateUserProfile, signOut } = useAuth();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      email: "",
    },
  });



  const handleUpdateProfile = async (data: FormData) => {
    setIsLoading(true);

    const formattedCpf = data.cpf.replace(/\D/g, "");
    const formattedPhone = data.phone.replace(/\D/g, "");

    const userData = {
      ...data,
      cpf: formattedCpf,
      phone: formattedPhone,
    }

    try {
      await api.put('/customers', userData);
      toast.success('Usuário atualizado com sucesso!', {
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
      fetchProfile();
      const userFromStorage = storageUserGet();

      const updatedUser: UserDTO = {
        customer: {
          ...userFromStorage.customer,
          name: data.name,
          phone: data.phone,
        }
      };

      await updateUserProfile(updatedUser);
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível atualizar seu perfil. Tente novamente mais tarde.";

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
    }
  };

  const fetchProfile = async () => {
    setIsLoading(true);

    try {
      const { data } = await api.get("/customers");

      setValue("name", data.customer.name);
      setValue("cpf", formatCPF(data.customer.cpf));
      setValue("phone", formatPhone(data.customer.phone));
      setValue("email", data.customer.email);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar seu perfil. Tente novamente mais tarde.";

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
      setIsLoading(false);
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível deslogar. Tente novamente mais tarde.";

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
      setIsLoading(false);
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await api.delete("/customers");
      toast.success('Usuário deletado com sucesso!', {
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
      await signOut();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível deletar sua conta. Tente novamente mais tarde.";

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
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsUpdateProfileModalOpen(true);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return isloading ? (
    <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto items-center justify-center">
      <Loader />
    </div>
  ) : (
    <div
      className="min-h-screen w-full flex flex-col bg-gray-900 overflow-y-auto"
    >

      <BasicModal 
        title="Encerrar sessão"
        description="Você tem certeza que deseja encerrar sua sessão?"
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onAction={handleSignOut}
      />

      <BasicModal 
        title="Salvar alterações"
        description="Você tem certeza que deseja salvar as alterações do perfil?"
        isOpen={isUpdateProfileModalOpen}
        onClose={() => setIsUpdateProfileModalOpen(false)}
        onAction={handleSubmit(handleUpdateProfile)}
      />

      <BasicModal 
        title="Deletar conta"
        description="Você tem certeza que deseja deletar sua conta? Suas propriedades e reservas serão automaticamente deletadas e essa ação não poderá ser desfeita."
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onAction={handleDeleteAccount}
      />

      <Navbar />
      <div className="px-6 py-20 flex flex-col items-center justify-center flex-grow md:flex-row gap-12 md:gap-24">

        <motion.div
          className="flex flex-col gap-2 items-center justify-center md:w-80 w-full"
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
            Meu perfil
          </motion.p>

          <motion.div
            className="flex items-center justify-center mt-4 flex-col gap-2 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Avatar size="lg" />
          </motion.div>

          <motion.div
            className="flex flex-col gap-2 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="text-white text-sm font-semibold" htmlFor="name">Nome</label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput
                  id="name"
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
            <label className="text-white text-sm font-semibold" htmlFor="cpf">CPF</label>
            <Controller
              control={control}
              name="cpf"
              render={({ field }) => (
                <CpfInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled
                  id="cpf"
                />
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
            <label className="text-white text-sm font-semibold" htmlFor="phone">Telefone</label>

            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  id="phone"
                />
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
            <label className="text-white text-sm font-semibold" htmlFor="email">E-mail</label>

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextInput
                  placeholder="E-mail"
                  value={field.value}
                  onChange={field.onChange}
                  id="email"
                  disabled
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm font-bold mt-[-16px]">
                {errors.email.message}
              </p>
            )}
          </motion.div>

          <div className="flex mb-2 flex-row items-center justify-center gap-2 w-full">
            <Button
              label="Salvar"
              onClick={() => setIsUpdateProfileModalOpen(true)}
              iconPosition="right"
              icon={<FloppyDisk size={18} weight="bold" />}
            />

            <Button
              label="Sair"
              onClick={() => setIsSignOutModalOpen(true)}
              bgColor="bg-red-500"
              iconPosition="right"
              icon={<SignOut size={18} weight="bold" />}
            />
          </div>


            <Button 
              label="Deletar conta"
              onClick={() => setIsDeleteAccountModalOpen(true)}
              bgColor="bg-red-500"
              iconPosition="right"
              icon={<Trash size={18} weight="bold" />}
            />
        </motion.div>
      </div>

    </div>
  )
}