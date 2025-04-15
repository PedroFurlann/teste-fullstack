import { motion } from 'framer-motion';
import { X } from 'phosphor-react';
import Button from '../components/Button';

interface BasicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  title: string;
  description: string;
}

export const BasicModal = ({
  isOpen,
  onClose,
  onAction,
  title,
  description,
}: BasicModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-md mx-4 rounded-2xl bg-gray-800 p-6 shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-7 text-gray-400 hover:text-white transition-all ease-in-out hover:opacity-70"
        >
          <X size={20} weight="bold" className="text-red-500" />
        </button>

        <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
        <p className="text-gray-300">{description}</p>

        <div className="mt-8 flex justify-end gap-4">
          <Button type="button" label="Não" bgColor='bg-red-500' onClick={onClose} />
          <Button type="button" label="Sim" onClick={() => {
            onAction();
            onClose();
          }} />
        </div>
      </motion.div>
    </motion.div>
  );
};
