import { motion } from 'framer-motion';
import { X } from 'phosphor-react';
import dayjs from 'dayjs';
import Button from '../components/Button';
import { formatToBRL } from '../utils/formatToBRL';
import { BookingWithPropertyDetailsDTO } from '../DTOs/BookingWithPropertyDetailsDTO';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingWithPropertyDetailsDTO;
}


export const BookingDetailsModal = ({
  isOpen,
  onClose,
  booking,
}: BookingDetailsModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { propertyDetails } = booking;

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

        <h2 className="mb-4 text-lg font-bold text-white">Detalhes da Reserva</h2>

        <div className="flex flex-col gap-4 text-white text-sm">
          <div>
            <p className="font-semibold">Propriedade:</p>
            <p>{propertyDetails.name}</p>
          </div>

          <div>
            <p className="font-semibold">Descrição:</p>
            <p>{propertyDetails.description}</p>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Tipo:</p>
              <p>{propertyDetails.type === 'car' ? 'Carro' : 'Casa'}</p>
            </div>
            <div>
              <p className="font-semibold">Valor por Hora:</p>
              <p>{formatToBRL(propertyDetails.pricePerHour)}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Tempo Mínimo:</p>
              <p>{propertyDetails.minTime}h</p>
            </div>
            <div>
              <p className="font-semibold">Tempo Máximo:</p>
              <p>{propertyDetails.maxTime}h</p>
            </div>
          </div>

          <hr className="border-gray-600 my-2" />

          <div>
            <p className="font-semibold">Data de Início:</p>
            <p>{dayjs(booking.startDate).format('DD/MM/YYYY HH:mm')}</p>
          </div>

          <div>
            <p className="font-semibold">Data de Término:</p>
            <p>{dayjs(booking.endDate).format('DD/MM/YYYY HH:mm')}</p>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Preço Final:</p>
              <p>{formatToBRL(booking.finalPrice)}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              <p className={booking.status === 'canceled' ? 'text-red-400' : 'text-green-400'}>
                {booking.status === 'canceled' ? 'Cancelada' : 'Confirmada'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="button" label="Fechar" onClick={onClose} />
        </div>
      </motion.div>
    </motion.div>
  );
};
