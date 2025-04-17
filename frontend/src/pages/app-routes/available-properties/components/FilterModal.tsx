import { useState } from 'react';
import TextInput from '../../../../components/Inputs/TextInput';
import Button from '../../../../components/Button';
import { X } from 'phosphor-react';
import { motion } from 'framer-motion';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    name?: string;
    description?: string;
    type?: string;
    orderBy?: string;
    orderDirection?: string;
  }) => void;
}

export const FilterModal = ({ isOpen, onClose, onApply }: FilterModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [orderDirection, setOrderDirection] = useState('asc');

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClear = () => {
    setName('');
    setDescription('');
    setOrderBy('');
    setOrderDirection('asc');
    onClose();
    onApply({ name: '', description: '', type: 'car', orderBy: '', orderDirection: 'asc' });
  };

  const hanleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onApply({ name, description, type: 'car', orderBy, orderDirection });
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

        <h2 className="mb-4 text-lg font-bold text-white">Filtrar e Ordenar</h2>

        <div className="flex flex-col gap-4" onKeyDown={hanleKeyDown}>
          <TextInput
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="rounded-xl border border-gray-600 bg-gray-700 p-2 pr-8 text-sm text-white"
          >
            <option value="">Ordenar por...</option>
            <option value="pricePerHour">Valor/hora</option>
            <option value="name">Nome</option>
            <option value="description">Descrição</option>
          </select>
          <select
            value={orderDirection}
            onChange={(e) => setOrderDirection(e.target.value)}
            className="rounded-xl border border-gray-600 bg-gray-700 p-2 pr-8 text-sm text-white"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            label="Limpar filtros"
            onClick={handleClear}
            bgColor="bg-red-500"
          />
          <Button
            label="Aplicar"
            onClick={() => {
              onApply({ name, description, type: 'car', orderBy, orderDirection });
              onClose();
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
