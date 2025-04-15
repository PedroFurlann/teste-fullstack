import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from '../components/Inputs/TextInput';
import NumberInput from '../components/Inputs/NumberInput';
import Button from '../components/Button';
import { X } from 'phosphor-react';

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreatePropertyFormData) => void;
}

export type CreatePropertyFormData = {
  name: string;
  description: string;
  type: 'car' | 'house';
  minTime: number;
  maxTime: number;
  pricePerHour: number;
};

const schema = yup.object().shape({
  name: yup
    .string()
    .required('O nome é obrigatório')
    .min(5, 'O nome deve ter pelo menos 5 caracteres'),
  description: yup
    .string()
    .required('A descrição é obrigatória')
    .min(5, 'A descrição deve ter pelo menos 5 caracteres'),
  type: yup
    .string()
    .oneOf(['car', 'house'])
    .required('O tipo é obrigatório'),
  minTime: yup
    .number()
    .min(1, 'O tempo mínimo deve ser pelo menos de 1 hora')
    .required('O tempo mínimo é obrigatório'),
  maxTime: yup
    .number()
    .min(2, 'O tempo máximo deve ser pelo menos 2 horas')
    .required('O tempo máximo é obrigatório')
    .test(
      'is-greater',
      'O tempo máximo deve ser maior que o tempo mínimo',
      function (value) {
        const { minTime } = this.parent;
        return value > minTime;
      }
    ),
  pricePerHour: yup.number().min(1, 'O preço por hora deve ser pelo menos de 1 (R$)').required('O preço por hora é obrigatório'),
});

export const CreatePropertyModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreatePropertyModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePropertyFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      type: 'car',
      minTime: 1,
      maxTime: 2,
      pricePerHour: 1,
    },
  });

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const onSubmit = (data: CreatePropertyFormData) => {
    onCreate(data);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit)();
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
        onKeyDown={handleKeyDown}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-7 text-gray-400 hover:text-white transition-all ease-in-out hover:opacity-70"
        >
          <X size={20} weight="bold" className="text-red-500" />
        </button>

        <h2 className="mb-4 text-lg font-bold text-white">Cadastrar Propriedade</h2>

        <div className="flex flex-col gap-2">
          <div>
            <label className="text-white text-sm font-semibold" htmlFor="name">Nome</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="name"
                  placeholder="Nome"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.name && (
              <span className="text-red-500 text-sm font-bold mt-[-12px] block">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="text-white text-sm font-semibold" htmlFor="description">Descrição</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="description"
                  placeholder="Descrição"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.description && (
              <span className="text-red-500 text-sm font-bold mt-[-12px] block">{errors.description.message}</span>
            )}
          </div>

          <div>
            <label className="text-white text-sm font-semibold" htmlFor="type">Tipo</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="type"
                  className="w-full rounded-xl border border-gray-600 bg-gray-700 p-2 pr-8 text-sm text-white"
                >
                  <option value="car">Carro</option>
                  <option value="house">Casa</option>
                </select>
              )}
            />
            {errors.type && (
              <span className="text-red-500 text-sm font-bold mt-[-12px] block">{errors.type.message}</span>
            )}
          </div>

          <div className='mt-4'>
            <label className="text-white text-sm font-semibold" htmlFor="minTime">Tempo Mínimo (h)</label>
            <Controller
              name="minTime"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  id="minTime"
                  placeholder="Tempo mínimo (h)"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.minTime && (
              <span className="text-red-500 text-sm font-bold mt-[-12px] block">{errors.minTime.message}</span>
            )}
          </div>

          <div>
            <label className="text-white text-sm font-semibold" htmlFor="maxTime">Tempo Máximo (h)</label>
            <Controller
              name="maxTime"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  id="maxTime"
                  placeholder="Tempo máximo (h)"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.maxTime && (
              <span className="text-red-500 text-sm font-bold mt-[-12px] block">{errors.maxTime.message}</span>
            )}
          </div>

          <div>
            <label className="text-white text-sm font-semibold" htmlFor="pricePerHour">Valor por Hora (R$)</label>
            <Controller
              name="pricePerHour"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  id="pricePerHour"
                  placeholder="Valor por hora"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.pricePerHour && (
              <span className="text-red-500 text-sm font-bold mt-[-12px] block">{errors.pricePerHour.message}</span>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="button" label="Cadastrar" onClick={handleSubmit(onSubmit)} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
