import { useEffect, useState } from "react";
import { BookingWithPropertyNameDTO } from "../../../DTOs/BookingWithPropertyNameDTO";
import { api } from "../../../services/api";
import { toast } from "react-toastify";
import { AppError } from "../../../utils/AppError";
import dayjs from "dayjs";
import Loader from "../../../components/Loader";
import { motion } from "framer-motion";
import Navbar from "../../../components/NavBar";
import Button from "../../../components/Button";
import { ArrowRight } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { EditBookingFormData, EditBookingModal } from "../../../components/EditBookingModal";
import { BasicModal } from "../../../components/BasicModal";
import { BookingCard } from "../../../components/BookingCard";

export default function MyBookings() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingWithPropertyNameDTO[]>([]);
  const [isConfirmationDeleteModalOpen, setIsConfirmationDeleteModalOpen] =
    useState(false);
  const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);
  const [isCancelBookingModalOpen, setIsCancelBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithPropertyNameDTO | null>(null);

  const navigate = useNavigate();


  const handleOpenDeleteBookingModal = (booking: BookingWithPropertyNameDTO) => {
    setIsConfirmationDeleteModalOpen(true);
    setSelectedBooking(booking);
  }

  const handleCloseDeleteBookingModal = () => {
    setIsConfirmationDeleteModalOpen(false);
    setSelectedBooking(null);
  }

  const handleDeleteBooking = async () => { 
    setIsLoading(true);

    try {
      await api.delete(`/bookings/${selectedBooking?.id}`);
      toast.success("Reserva excluída com sucesso!", {
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
      fetchBookings();
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível excluir a reserva. Tente novamente mais tarde.";

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

  const handleOpenEditBookingModal = (booking: BookingWithPropertyNameDTO) => {
    setIsEditBookingModalOpen(true);
    setSelectedBooking(booking);
  }

  const handleCloseEditBookingModal = () => {
    setIsEditBookingModalOpen(false);
    setSelectedBooking(null);
  }

  const handleEditBooking = async (data: EditBookingFormData) => {
    setIsLoading(true);

    try {
      await api.put(`/bookings/${selectedBooking?.id}`, {
        startDate: dayjs(data.startDate).format("YYYY-MM-DDTHH:mm"),
        endDate: dayjs(data.endDate).format("YYYY-MM-DDTHH:mm"),
      });
      toast.success("Reserva editada com sucesso!", {
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
      fetchBookings();
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível editar a reserva. Tente novamente mais tarde.";

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

  const handleOpenCancelBookingModal = (booking: BookingWithPropertyNameDTO) => {
    setIsCancelBookingModalOpen(true);
    setSelectedBooking(booking);
  }

  const handleCloseCancelBookingModal = () => {
    setIsCancelBookingModalOpen(false);
    setSelectedBooking(null);
  }

  const handleCancelBooking = async () => {
    setIsLoading(true);

    try {
      await api.patch(`/bookings/${selectedBooking?.id}/cancel`);
      toast.success("Reserva cancelada com sucesso!", {
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
      fetchBookings();
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível cancelar a reserva. Tente novamente mais tarde.";

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

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/customer");
      setBookings(data.bookings);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar as reservas. Tente novamente mais tarde.";

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
  };



  useEffect(() => {
    fetchBookings();
  }, []);

  return isLoading ? (
    <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto items-center justify-center">
      <Loader />
    </div>
  ) : (
    <div
      className="min-h-screen w-full flex flex-col bg-gray-900 overflow-y-auto"
    >
      <Navbar />
      <motion.div
        className="mt-16 mb-4 flex md:flex-row flex-col gap-4 md:px-24 px-6 items-center w-full justify-between"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >

        <p className="text-2xl w-full text-white text-center md:text-left font-bold">Minhas Reservas</p>
        <div className="w-full md:justify-end justify-center flex">
          <Button
            label="Reservar Propriedade"
            iconPosition="right"
            icon={<ArrowRight size={18} className="text-white" weight="bold" />}
            onClick={() => navigate("/available-properties")}
          />
        </div>
      </motion.div>

      {isEditBookingModalOpen && selectedBooking && (
        <EditBookingModal 
          isOpen={isEditBookingModalOpen}
          onClose={handleCloseEditBookingModal}
          booking={selectedBooking}
          onUpdate={(data) => handleEditBooking(data)}
        />
      )}

      {isCancelBookingModalOpen && selectedBooking && (
        <BasicModal
          title="Cancelar Reserva"
          description={`Você tem certeza que deseja cancelar a reserva de ${selectedBooking.propertyName}? Essa ação não pode ser desfeita.`}
          isOpen={isCancelBookingModalOpen}
          onClose={handleCloseCancelBookingModal}
          onAction={handleCancelBooking}
        />
      )}

      {isConfirmationDeleteModalOpen && selectedBooking && (
        <BasicModal
          title="Deletar Reserva"
          description={`Você tem certeza que deseja deletar a reserva de ${selectedBooking.propertyName}? Essa ação não pode ser desfeita.`}
          isOpen={isConfirmationDeleteModalOpen}
          onClose={handleCloseDeleteBookingModal}
          onAction={handleDeleteBooking}
        />
      )}

      {bookings.length === 0 ? (
        <motion.div
          className="md:px-24 px-6 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-center text-white font-bold mt-10">
            Parece que não tem nenhuma propriedade reservada ainda.
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="grid lg:grid-cols-3 gap-4 md:px-24 px-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={() => handleOpenCancelBookingModal(booking)}
                onEdit={() => handleOpenEditBookingModal(booking)}
                onDelete={() => handleOpenDeleteBookingModal(booking)}
                onViewDetails={() => {}}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}