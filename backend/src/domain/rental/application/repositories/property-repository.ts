import { Property } from '../../enterprise/entities/property';

export interface FindAllAvailablePropertiesOptions {
  startDate: Date;
  endDate: Date;
  name?: string;
  description?: string;
  type?: string;
  orderBy?: 'pricePerHour' | 'name' | 'description' | 'type';
  orderDirection?: 'asc' | 'desc';
}

export abstract class PropertyRepository {
  abstract create(property: Property): Promise<void>;

  abstract findAllAvailable(
    options: FindAllAvailablePropertiesOptions,
  ): Promise<Property[]>;

  abstract findById(propertyId: string): Promise<Property | null>;

  abstract findByCustomerId(customerId: string): Promise<Property[]>;

  abstract update(property: Property): Promise<void>;

  abstract delete(propertyId: string): Promise<void>;
}
