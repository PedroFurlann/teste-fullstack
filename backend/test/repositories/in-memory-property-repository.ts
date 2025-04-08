/* eslint-disable @typescript-eslint/require-await */
import { PropertyRepository } from '../../src/domain/rental/application/repositories/property-repository';
import { Booking } from '../../src/domain/rental/enterprise/entities/booking';
import { Property } from '../../src/domain/rental/enterprise/entities/property';

export class InMemoryPropertyRepository implements PropertyRepository {
  public items: Property[] = [];
  public bookings: Booking[] = [];

  async create(property: Property): Promise<void> {
    this.items.push(property);
  }

  async findAllAvailable(startDate: Date, endDate: Date): Promise<Property[]> {
    return this.items.filter((property) => {
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
