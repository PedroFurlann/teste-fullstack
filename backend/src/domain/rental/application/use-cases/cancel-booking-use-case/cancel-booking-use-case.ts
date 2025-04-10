import { Either, left, right } from '../../../../../core/either';
import { BookingRepository } from '../../repositories/booking-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { BookingDoesNotBelongToCustomerError } from '../errors/booking-does-not-belong-to-customer-error';

interface CancelBookingUseCaseRequest {
  bookingId: string;
  customerId: string;
}

type CancelBookingUseCaseResponse = Either<
  BookingNotFoundError | BookingDoesNotBelongToCustomerError,
  null
>;

export class CancelBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute({
    bookingId,
    customerId,
  }: CancelBookingUseCaseRequest): Promise<CancelBookingUseCaseResponse> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      return left(new BookingNotFoundError());
    }

    if (booking.customerId.toString() !== customerId) {
      return left(new BookingDoesNotBelongToCustomerError());
    }

    booking.status = 'canceled';

    await this.bookingRepository.update(booking);

    return right(null);
  }
}
