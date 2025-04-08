import { Property } from '../../enterprise/entities/property';

export abstract class PropertyRepository {
  abstract create(property: Property): Promise<void>;
  abstract findAllAvailable(rentalDate: Date): Promise<Property[]>;
  abstract findById(propertyId: string): Promise<Property | null>;
  abstract findByCustomerId(customerId: string): Promise<Property[]>;
  abstract update(property: Property): Promise<void>;
  abstract delete(propertyId: string): Promise<void>;
}
