import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import DateTimeInput from '../../../components/Inputs/DateTimeInput';
import Loader from '../../../components/Loader';
import { PropertyCard } from './components/PropertyCard';
import { FilterModal } from './components/FilterModal';
import { PropertyDTO } from '../../../DTOs/PropertyDTO';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { AppError } from '../../../utils/AppError';
import Navbar from '../../../components/NavBar';
import { motion } from 'framer-motion';
import Button from '../../../components/Button';
import { CreatePropertyFormData, CreatePropertyModal } from '../../../components/CreatePropertyModal';

export default function AvailableProperties() {
  const [properties, setProperties] = useState<PropertyDTO[]>([{ id: "1", type: "car", name: 'name test', description: 'test', minTime: 1, maxTime: 2, pricePerHour: 10, createdAt: new Date(), updatedAt: new Date() }]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [endDate, setEndDate] = useState(dayjs().add(1, 'week').format('YYYY-MM-DDTHH:mm'));
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isCreatePropertyModalOpen, setIsCreatePropertyModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    description: '',
    type: '',
    orderBy: 'name',
    orderDirection: 'asc',
  });

  const fetchProperties = async () => {
    try {
      setIsLoading(true);

      const queryParams = Object.entries({
        startDate: dayjs(startDate).add(3, 'hours').format('YYYY-MM-DDTHH:mm'),
        endDate: dayjs(endDate).add(3, 'hours').format('YYYY-MM-DDTHH:mm'),
        ...filters,
      }).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>);

      const response = await api.get('/properties/available', {
        params: queryParams,
      });

      setProperties(response.data.properties);
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
  };

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

  useEffect(() => {
    if (startDate && endDate) {
      fetchProperties();
    }
  }, [startDate, endDate, filters]);

  return (
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
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <DateTimeInput
            label="De"
            value={startDate}
            onChange={setStartDate}
          />
          <DateTimeInput
            label="Até"
            value={endDate}
            onChange={setEndDate}
          />
        </div>

        <Button
          label="Filtros"
          onClick={() => setIsFiltersModalOpen(true)}
        />
      </motion.div>

      <FilterModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        onApply={(appliedFilters) => setFilters(prev => ({ ...prev, ...appliedFilters }))}
      />

      <CreatePropertyModal
        isOpen={isCreatePropertyModalOpen}
        onClose={() => setIsCreatePropertyModalOpen(false)}
        onCreate={handleCreateProperty}
      />

      {isLoading ? (
        <div className="flex flex-grow items-center justify-center w-full h-full">
          <Loader />
        </div>
      ) : properties.length === 0 ? (
        <motion.div
          className="md:px-24 px-6 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-center text-white font-bold mt-10">
            Parece que não tem nenhuma propriedade disponível para os filtros informados,
            que tal cadastrar uma?
          </p>

          <Button
            label="Cadastrar Propriedade"
            onClick={() => setIsCreatePropertyModalOpen(true)}
          />
        </motion.div>
      ) : (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:px-24 px-6"
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
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
