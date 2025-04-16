import { BookingWithPropertyNameDTO } from "../DTOs/BookingWithPropertyNameDTO";
import { Calendar, Money, CheckCircle, XCircle } from "phosphor-react";
import dayjs from "dayjs";

interface BookingCardProps {
  booking: BookingWithPropertyNameDTO;
  onViewDetails: (booking: BookingWithPropertyNameDTO) => void;
  onCancel?: (booking: BookingWithPropertyNameDTO) => void;
  onEdit?: (booking: BookingWithPropertyNameDTO) => void;
  onDelete?: (booking: BookingWithPropertyNameDTO) => void;
}

export const BookingCard = ({
  booking,
  onViewDetails,
  onCancel,
  onEdit,
  onDelete,
}: BookingCardProps) => {
  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 shadow-md transition hover:shadow-lg flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-white">{booking.propertyName}</h3>

        <div className="flex items-center gap-2">
          {isConfirmed ? (
            <CheckCircle size={20} className="text-green-400" weight="bold" />
          ) : (
            <XCircle size={20} className="text-red-400" weight="bold" />
          )}
          <span className={`font-semibold text-sm ${isConfirmed ? "text-green-400" : "text-red-400"}`}>
            {isConfirmed ? "Confirmada" : "Cancelada"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-300">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white">Início:</span>
          <span>{dayjs(booking.startDate).format("DD/MM/YYYY HH:mm")}</span>
          <Calendar size={16} className="text-white" weight="bold" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white">Fim:</span>
          <span>{dayjs(booking.endDate).format("DD/MM/YYYY HH:mm")}</span>
          <Calendar size={16} className="text-white" weight="bold" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white">Total:</span>
          <span className="text-violet-400 font-semibold">
            R$ {booking.finalPrice.toFixed(2)}
          </span>
          <Money size={16} className="text-white" weight="bold" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center md:justify-end pt-2">
        <button
          onClick={() => onViewDetails(booking)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Ver detalhes
        </button>

        {isConfirmed && (
          <button
            onClick={() => onCancel?.(booking)}
            className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-600"
          >
            Cancelar
          </button>
        )}

        <button
          onClick={() => onEdit?.(booking)}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete?.(booking)}
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};
