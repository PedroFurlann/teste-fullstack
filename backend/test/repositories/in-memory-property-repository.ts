/* eslint-disable @typescript-eslint/require-await */
import {
  FindAllAvailablePropertiesOptions,
  PropertyRepository,
} from '../../src/domain/rental/application/repositories/property-repository';
import { Booking } from '../../src/domain/rental/enterprise/entities/booking';
import { Property } from '../../src/domain/rental/enterprise/entities/property';

export class InMemoryPropertyRepository implements PropertyRepository {
  public items: Property[] = [];
  public bookings: Booking[] = [];

  async create(property: Property): Promise<void> {
    this.items.push(property);
  }

  async findAllAvailable({
    startDate,
    endDate,
    name,
    description,
    type,
    orderBy,
    orderDirection = 'asc',
  }: FindAllAvailablePropertiesOptions): Promise<Property[]> {
    let available = this.items.filter((property) => {
      const hasConflictingBooking = this.bookings.some((booking) => {
        return (
          booking.propertyId === property.id &&
          booking.status === 'confirmed' &&
          startDate <= booking.endDate &&
          endDate >= booking.startDate
        );
      });

      return !hasConflictingBooking;
    });

    if (name) {
      available = available.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    if (description) {
      available = available.filter((p) =>
        p.description.toLowerCase().includes(description.toLowerCase()),
      );
    }

    if (type) {
      available = available.filter((p) =>
        p.type.toLowerCase().includes(type.toLowerCase()),
      );
    }

    if (orderBy) {
      available = available.sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return orderDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return orderDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return available;
  }

  async findById(propertyId: string): Promise<Property | null> {
    return this.items.find((p) => p.id.toString() === propertyId) ?? null;
  }

  async findByCustomerId(customerId: string): Promise<Property[]> {
    return this.items.filter((p) => p.customerId.toString() === customerId);
  }

  async update(property: Property): Promise<void> {
    const index = this.items.findIndex((p) => p.id === property.id);
    if (index >= 0) {
      this.items[index] = property;
    }
  }

  async delete(propertyId: string): Promise<void> {
    this.items = this.items.filter((p) => p.id.toString() !== propertyId);
  }
}
