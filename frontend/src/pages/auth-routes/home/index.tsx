

import AuthNavbar from "../../../components/AuthNavBar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../../components/Button";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto">
      <AuthNavbar />

      <motion.div
        className="px-6 py-20 flex-grow w-full text-center flex flex-col items-center justify-center min-h-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Bem-vindo ao sistema de <span className="text-purple-500">locações</span>
        </h1>
        <p className="text-zinc-300 text-lg md:text-xl mb-8">
          Gerencie propriedades e reservas de forma simples, rápida e segura.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button label="Fazer Login" onClick={() => navigate("/login")} />
          <Button
            label="Criar Conta"
            onClick={() => navigate("/register")}
            className="bg-purple-700 hover:bg-purple-600"
          />
        </div>
      </motion.div>
    </div>
  );
}
