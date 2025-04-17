import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTimeInput from '../components/Inputs/DateTimeInput';
import Button from '../components/Button';
import { X } from 'phosphor-react';
import dayjs from 'dayjs';
import { PropertyDTO } from '../DTOs/PropertyDTO';
import { formatToBRL } from '../utils/formatToBRL';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateBookingFormData) => void;
  property: PropertyDTO;
}

export type CreateBookingFormData = {
  startDate: string;
  endDate: string;
};

const schema = yup.object().shape({
  startDate: yup.string().required('A data de início é obrigatória'),
  endDate: yup
    .string()
    .required('A data de término é obrigatória')
    .test(
      'is-after-start',
      'A data de término deve ser posterior à data de início',
      function (value) {
        const { startDate } = this.parent;
        return dayjs(value).isAfter(dayjs(startDate));
      }
    ),
});

export const CreateBookingModal = ({
  isOpen,
  onClose,
  onCreate,
  property,
}: CreateBookingModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateBookingFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: dayjs().add(1, "hour").format('YYYY-MM-DDTHH:mm'),
      endDate: dayjs().add(4, 'hour').format('YYYY-MM-DDTHH:mm'),
    },
  });

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const calculateTotalHours = (startDate: string, endDate: string) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return Math.max(end.diff(start, 'hour'), 0);
  }

  const calculateTotalPrice = (startDate: string, endDate: string) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const hours = end.diff(start, 'hour');
    return formatToBRL(hours * property.pricePerHour);
  }

  const onSubmit = (data: CreateBookingFormData) => {
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

        <h2 className="mb-4 text-lg font-bold text-white">Reservar {property.name}</h2>

        <div className="flex flex-col gap-2 w-full">
          <div>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DateTimeInput
                  {...field}
                  id="startDate"
                  value={field.value}
                  label='De'
                  onChange={field.onChange}
                />
              )}
            />
            {errors.startDate && (
              <span className="text-red-500 text-sm font-bold mt-1 block">{errors.startDate.message}</span>
            )}
          </div>

          <div>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DateTimeInput
                  {...field}
                  id="endDate"
                  value={field.value}
                  onChange={field.onChange}
                  label='Até'
                />
              )}
            />
            {errors.endDate && (
              <span className="text-red-500 text-sm font-bold mt-1 block">{errors.endDate.message}</span>
            )}
          </div>

          <div className="mt-2 text-white text-sm">
            <p 
              className='block text-sm font-bold text-white'>
                Duração: {calculateTotalHours(watch("startDate"), watch("endDate"))} hora(s)
            </p>
            <p 
              className='block text-sm font-bold text-white'>
                Total: {calculateTotalPrice(watch("startDate"), watch("endDate"))}
              </p>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="button" label="Reservar" onClick={handleSubmit(onSubmit)} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
