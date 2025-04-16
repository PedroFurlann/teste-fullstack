import { useEffect, useState } from "react";
import Navbar from "../../../components/NavBar";
import { PropertyDTO } from "../../../DTOs/PropertyDTO";
import { motion } from "framer-motion";
import Button from "../../../components/Button";
import { api } from "../../../services/api";
import { AppError } from "../../../utils/AppError";
import { toast } from "react-toastify";
import { CreatePropertyFormData, CreatePropertyModal } from "../../../components/CreatePropertyModal";
import { Plus } from "phosphor-react";
import Loader from "../../../components/Loader";
import { PropertyCard } from "../../../components/PropertyCard";
import { EditPropertyFormData, EditPropertyModal } from "../../../components/EditPropertyModal";
import { BasicModal } from "../../../components/BasicModal";

export default function MyProperties() {
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<PropertyDTO[]>([]);
  const [isCreatePropertyModalOpen, setIsCreatePropertyModalOpen] =
    useState(false);
  const [isEditPropertyModalOpen, setIsEditPropertyModalOpen] =
    useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDTO | null>(
    null
  );
  const [isConfirmationDeleteModalOpen, setIsConfirmationDeleteModalOpen] = useState(false);

  const fetchProperties = async () => {
    setIsLoading(true);

    try {
      const properties = await api.get("/properties");
      setProperties(properties.data.properties);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar as propriedades. Tente novamente mais tarde.";

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

  const handleCreateProperty = async (data: CreatePropertyFormData) => {
    setIsLoading(true);

    try {
      await api.post('/properties', data);
      toast.success('Propriedade cadastrada com sucesso!', {
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
      fetchProperties();
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível cadastrar a propriedade. Tente novamente mais tarde.";

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

  const handleEditProperty = async (data: EditPropertyFormData) => {
    setIsLoading(true);
    try {
      await api.put(`/properties/${selectedProperty?.id}`, data);
      toast.success('Propriedade editada com sucesso!', {
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
      fetchProperties();
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível editar a propriedade. Tente novamente mais tarde.";

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
  }

  const handleOpenEditPropertyModal = (property: PropertyDTO) => {
    setIsEditPropertyModalOpen(true);
    setSelectedProperty(property);
  }

  const handleCloseEditPropertyModal = () => {
    setIsEditPropertyModalOpen(false);
    setSelectedProperty(null);
  };

  const handleOpenDeletePropertyModal = (property: PropertyDTO) => {
    setIsConfirmationDeleteModalOpen(true);
    setSelectedProperty(property);
  }

  const handleCloseDeletePropertyModal = () => {
    setIsConfirmationDeleteModalOpen(false);
    setSelectedProperty(null);
  };

  const handleDeleteProperty = async () => {
    setIsLoading(true);
    try {
      await api.delete(`/properties/${selectedProperty?.id}`);
      toast.success('Propriedade deletada com sucesso!', {
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
      fetchProperties();
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível deletar a propriedade. Tente novamente mais tarde.";

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
  }

  useEffect(() => {
    fetchProperties();
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

        <p className="text-2xl w-full text-white text-center md:text-left font-bold">Minhas propriedades</p>
        <div className="w-full md:justify-end justify-center flex">
          <Button
            label="Criar Propriedade"
            iconPosition="left"
            icon={<Plus size={18} className="text-white" weight="bold" />}
            onClick={() => setIsCreatePropertyModalOpen(true)}
          />
        </div>
      </motion.div>

      <CreatePropertyModal
        isOpen={isCreatePropertyModalOpen}
        onClose={() => setIsCreatePropertyModalOpen(false)}
        onCreate={handleCreateProperty}
      />

      {isEditPropertyModalOpen && selectedProperty && (
        <EditPropertyModal 
          isOpen={isEditPropertyModalOpen}
          onClose={handleCloseEditPropertyModal}
          property={selectedProperty}
          onUpdate={(data) => handleEditProperty(data)}
        />
      )}

      {isConfirmationDeleteModalOpen && selectedProperty && (
        <BasicModal
        title="Deletar Propriedade"
          description={`Você tem certeza que deseja deletar a propriedade ${selectedProperty.name}? Essa ação não pode ser desfeita.`}
          isOpen={isConfirmationDeleteModalOpen}
          onClose={handleCloseDeletePropertyModal}
          onAction={handleDeleteProperty}
        />
      )}

      {properties.length === 0 ? (
        <motion.div
          className="md:px-24 px-6 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-center text-white font-bold mt-10">
            Você ainda não possui propriedades cadastradas. Que tal cadastrar uma?
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
          {properties.map((property) => (
            <motion.div
              key={property.id}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <PropertyCard
                key={property.id}
                property={property}
                onAction={() => handleOpenEditPropertyModal(property)}
                onDelete={() => handleOpenDeletePropertyModal(property)}
                isBooking={false}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )


}