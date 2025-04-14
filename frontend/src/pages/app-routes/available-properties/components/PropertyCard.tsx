import { PropertyDTO } from "../../../../DTOs/PropertyDTO";
import { Buildings, Car, Money, Clock } from "phosphor-react";

interface PropertyCardProps {
  property: PropertyDTO;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const typeLabel = property.type === "car" ? "Carro" : "Casa";

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 shadow-md transition hover:shadow-lg flex justify-between gap-6">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-2">{property.name}</h3>
        <p className="text-sm text-gray-300 mb-2">{property.description}</p>

        <div className="flex flex-col gap-1 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            {property.type === "car" ? (
              <Car size={16} className="text-white" weight="bold" />
            ) : (
              <Buildings size={16} className="text-white" weight="bold" />
            )}
            <span className="font-semibold text-white">{typeLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Preço por hora</span>
            <Money size={16} className="text-white" weight="bold" />
            <span className="font-semibold text-violet-400">R$ {property.pricePerHour}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <div className="text-sm text-gray-300 flex flex-col gap-1 items-end">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-white" weight="bold" />
            <span>
              <span className="font-semibold text-white">Mín:</span>{" "}
              {property.minTime}h
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-white" weight="bold" />
            <span>
              <span className="font-semibold text-white">Máx:</span>{" "}
              {property.maxTime}h
            </span>
          </div>
        </div>

        <button className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
          Reservar
        </button>
      </div>
    </div>
  );
};
