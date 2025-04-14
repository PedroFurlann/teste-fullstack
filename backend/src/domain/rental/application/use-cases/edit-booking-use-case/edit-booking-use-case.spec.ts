import { EditBookingUseCase } from './edit-booking-use-case';
import { InMemoryBookingRepository } from '../../../../../../test/repositories/in-memory-booking-repository';
import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { makeBooking } from '../../../../../../test/factories/make-booking';
import { BookingDoesNotBelongToCustomerError } from '../errors/booking-does-not-belong-to-customer-error';
import { BookingDateConflictError } from '../errors/booking-date-conflict-error';
import { BookingTimeOutsideAllowedRangeError } from '../errors/booking-time-outside-allowed-range-error';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { BookingNotFoundError } from '../errors/booking-not-found-error';

let inMemoryBookingRepository: InMemoryBookingRepository;
let inMemoryPropertyRepository: InMemoryPropertyRepository;
let sut: EditBookingUseCase;

describe('Edit Booking', () => {
  beforeEach(() => {
    inMemoryBookingRepository = new InMemoryBookingRepository();
    inMemoryPropertyRepository = new InMemoryPropertyRepository();
    sut = new EditBookingUseCase(
      inMemoryBookingRepository,
      inMemoryPropertyRepository,
    );
  });

  it('should update the booking when valid data is provided', async () => {
    const property = makeProperty({
      pricePerHour: 100,
      minTime: 2,
      maxTime: 24,
    });
    await inMemoryPropertyRepository.create(property);

    const booking = makeBooking({
      propertyId: property.id,
      startDate: new Date('2025-05-30T10:00:00'),
      endDate: new Date('2025-05-30T12:00:00'),
    });
    await inMemoryBookingRepository.create(booking);

    const result = await sut.execute({
      bookingId: booking.id.toString(),
      customerId: booking.customerId.toString(),
      startDate: new Date('2025-05-30T11:00:00'),
      endDate: new Date('2025-05-30T14:00:00'),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { booking } = result.value;
      expect(booking.startDate).toEqual(new Date('2025-05-30T11:00:00'));
      expect(booking.endDate).toEqual(new Date('2025-05-30T14:00:00'));
      expect(booking.finalPrice).toBe(300);
    }
  });

  it('should return an error if the booking does not belong to the customer', async () => {
    const property = makeProperty({
      pricePerHour: 100,
      minTime: 2,
      maxTime: 24,
    });
    await inMemoryPropertyRepository.create(property);

    const booking = makeBooking({
      propertyId: property.id,
      startDate: new Date('2025-05-30T10:00:00'),
      endDate: new Date('2025-05-30T12:00:00'),
    });
    await inMemoryBookingRepository.create(booking);

    const result = await sut.execute({
      bookingId: booking.id.toString(),
      customerId: '1234',
      startDate: new Date('2025-05-30T13:00:00'),
      endDate: new Date('2025-05-30T15:00:00'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BookingDoesNotBelongToCustomerError);
  });

  it('should return an error if the booking dates overlap with another booking', async () => {
    const property = makeProperty({
      pricePerHour: 100,
      minTime: 2,
      maxTime: 24,
    });
    await inMemoryPropertyRepository.create(property);

    const booking1 = makeBooking({
      propertyId: property.id,
      startDate: new Date('2025-05-30T10:00:00'),
      endDate: new Date('2025-05-30T12:00:00'),
    });
    await inMemoryBookingRepository.create(booking1);

    const booking2 = makeBooking({
      propertyId: property.id,
      startDate: new Date('2025-05-30T11:00:00'),
      endDate: new Date('2025-05-30T13:00:00'),
    });
    await inMemoryBookingRepository.create(booking2);

    const result = await sut.execute({
      bookingId: booking1.id.toString(),
      customerId: booking1.customerId.toString(),
      startDate: new Date('2025-05-30T11:30:00'),
      endDate: new Date('2025-05-30T13:30:00'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BookingDateConflictError);
  });

  it('should return an error if the booking time is outside the allowed range', async () => {
    const property = makeProperty({
      pricePerHour: 100,
      minTime: 2,
      maxTime: 24,
    });
    await inMemoryPropertyRepository.create(property);

    const booking = makeBooking({
      propertyId: property.id,
      startDate: new Date('2025-05-30T10:00:00'),
      endDate: new Date('2025-05-30T12:00:00'),
    });
    await inMemoryBookingRepository.create(booking);

    const result = await sut.execute({
      bookingId: booking.id.toString(),
      customerId: booking.customerId.toString(),
      startDate: new Date('2025-05-30T10:00:00'),
      endDate: new Date('2025-05-30T11:00:00'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BookingTimeOutsideAllowedRangeError);
  });

  it('should return an error if the booking does not exist', async () => {
    const result = await sut.execute({
      bookingId: '1234',
      customerId: '123',
      startDate: new Date('2025-05-30T10:00:00'),
      endDate: new Date('2025-05-30T12:00:00'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BookingNotFoundError);
  });
});
