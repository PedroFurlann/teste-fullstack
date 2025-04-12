import { Either, left, right } from '../../../../../core/either';
import { BookingRepository } from '../../repositories/booking-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { BookingDoesNotBelongToCustomerError } from '../errors/booking-does-not-belong-to-customer-error';
import { Injectable } from '@nestjs/common';
import { BookingAlreadyCanceledError } from '../errors/booking-already-canceled-error';

interface CancelBookingUseCaseRequest {
  bookingId: string;
  customerId: string;
}

type CancelBookingUseCaseResponse = Either<
  | BookingNotFoundError
  | BookingDoesNotBelongToCustomerError
  | BookingAlreadyCanceledError,
  null
>;

@Injectable()
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

    if (booking.status === 'canceled') {
      return left(new BookingAlreadyCanceledError());
    }

    booking.status = 'canceled';

    await this.bookingRepository.update(booking);

    return right(null);
  }
}
