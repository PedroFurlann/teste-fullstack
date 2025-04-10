import { Booking } from '../../enterprise/entities/booking';

export abstract class BookingRepository {
  abstract create(booking: Booking): Promise<void>;
  abstract findById(bookingId: string): Promise<Booking | null>;
  abstract findByCustomerId(customerId: string): Promise<Booking[]>;
  abstract findByPropertyId(propertyId: string): Promise<Booking[]>;
  abstract update(booking: Booking): Promise<void>;
  abstract delete(bookingId: string): Promise<void>;
}
