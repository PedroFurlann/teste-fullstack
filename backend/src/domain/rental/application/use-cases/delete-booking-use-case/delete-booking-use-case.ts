import { Either, left, right } from '../../../../../core/either';
import { BookingRepository } from '../../repositories/booking-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { BookingDoesNotBelongToCustomerError } from '../errors/booking-does-not-belong-to-customer-error';
import { Injectable } from '@nestjs/common';

interface DeleteBookingUseCaseRequest {
  bookingId: string;
  customerId: string;
}

type DeleteBookingUseCaseResponse = Either<
  BookingNotFoundError | BookingDoesNotBelongToCustomerError,
  null
>;

@Injectable()
export class DeleteBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute({
    bookingId,
    customerId,
  }: DeleteBookingUseCaseRequest): Promise<DeleteBookingUseCaseResponse> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      return left(new BookingNotFoundError());
    }

    if (booking.customerId.toString() !== customerId) {
      return left(new BookingDoesNotBelongToCustomerError());
    }

    await this.bookingRepository.delete(bookingId);
    return right(null);
  }
}
