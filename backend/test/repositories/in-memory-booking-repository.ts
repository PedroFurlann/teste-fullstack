/* eslint-disable @typescript-eslint/require-await */
import { Property } from '../../src/domain/rental/enterprise/entities/property';
import { BookingRepository } from '../../src/domain/rental/application/repositories/booking-repository';
import { Booking } from '../../src/domain/rental/enterprise/entities/booking';

export class InMemoryBookingRepository implements BookingRepository {
  public items: Booking[] = [];
  public properties: Property[] = [];

  async create(booking: Booking): Promise<void> {
    this.items.push(booking);
  }

  async findById(bookingId: string): Promise<Booking | null> {
    return this.items.find((b) => b.id.toString() === bookingId) ?? null;
  }

  async findByCustomerId(customerId: string): Promise<Booking[]> {
    return this.items.filter((b) => b.customerId.toString() === customerId);
  }

  async findByPropertyId(propertyId: string): Promise<Booking[]> {
    return this.items.filter((b) => b.propertyId.toString() === propertyId);
  }

  async update(booking: Booking): Promise<void> {
    const index = this.items.findIndex((b) => b.id === booking.id);
    if (index >= 0) {
      this.items[index] = booking;
    }
  }

  async delete(bookingId: string): Promise<void> {
    this.items = this.items.filter((b) => b.id.toString() !== bookingId);
  }

  async cancel(bookingId: string): Promise<void> {
    const booking = await this.findById(bookingId);
    if (booking) {
      booking.status = 'canceled';
      await this.update(booking);
    }
  }

  async findWithPropertyNameByCustomerId(customerId: string): Promise<
    {
      booking: Booking;
      propertyName: string;
    }[]
  > {
    return this.items
      .filter((b) => b.customerId.toString() === customerId)
      .map((booking) => {
        const property = this.properties.find(
          (p) => p.id.toString() === booking.propertyId.toString(),
        );

        return {
          booking,
          propertyName: property?.name,
        };
      });
  }
}
