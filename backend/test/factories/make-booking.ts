import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';
import {
  Booking,
  BookingProps,
} from '../../src/domain/rental/enterprise/entities/booking';

export function makeBooking(
  override: Partial<BookingProps> = {},
  id?: UniqueEntityID,
): Booking {
  const start = faker.date.soon();
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2h

  return Booking.create(
    {
      customerId: new UniqueEntityID(),
      propertyId: new UniqueEntityID(),
      startDate: start,
      endDate: end,
      finalPrice: faker.number.int({ min: 100, max: 1000 }),
      status: 'confirmed',
      ...override,
    },
    id,
  );
}
