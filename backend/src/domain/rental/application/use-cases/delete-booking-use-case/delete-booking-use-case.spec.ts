import { DeleteBookingUseCase } from './delete-booking-use-case';
import { InMemoryBookingRepository } from '../../../../../../test/repositories/in-memory-booking-repository';
import { makeBooking } from '../../../../../../test/factories/make-booking';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { BookingDoesNotBelongToCustomerError } from '../errors/booking-does-not-belong-to-customer-error';

let inMemoryBookingRepository: InMemoryBookingRepository;
let sut: DeleteBookingUseCase;

describe('Delete Booking', () => {
  beforeEach(() => {
    inMemoryBookingRepository = new InMemoryBookingRepository();
    sut = new DeleteBookingUseCase(inMemoryBookingRepository);
  });

  it('should be able to delete a booking', async () => {
    const booking = makeBooking({
      startDate: new Date('2025-04-10T10:00:00'),
      endDate: new Date('2025-04-10T12:00:00'),
    });
    await inMemoryBookingRepository.create(booking);

    const result = await sut.execute({
      bookingId: booking.id.toString(),
      customerId: booking.customerId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryBookingRepository.items).toHaveLength(0);
  });

  it('should return an error if the booking does not belong to the customer', async () => {
    const booking = makeBooking({
      startDate: new Date('2025-04-10T10:00:00'),
      endDate: new Date('2025-04-10T12:00:00'),
    });
    await inMemoryBookingRepository.create(booking);

    const result = await sut.execute({
      bookingId: booking.id.toString(),
      customerId: '1234',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BookingDoesNotBelongToCustomerError);
  });

  it('should return an error if the booking does not exist', async () => {
    const result = await sut.execute({
      bookingId: '123',
      customerId: '1234',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BookingNotFoundError);
  });
});
