import { Either, left, right } from '../../../../../core/either';
import { PropertyRepository } from '../../repositories/property-repository';
import { BookingRepository } from '../../repositories/booking-repository';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { PropertyDoesNotBelongToCustomerError } from '../errors/property-does-not-belong-to-customer-error';
import { PropertyHasActiveBookingsError } from '../errors/property-has-active-bookings-error';
import { Injectable } from '@nestjs/common';

interface DeletePropertyUseCaseRequest {
  propertyId: string;
  customerId: string;
}

type DeletePropertyUseCaseResponse = Either<
  | PropertyNotFoundError
  | PropertyDoesNotBelongToCustomerError
  | PropertyHasActiveBookingsError,
  null
>;

@Injectable()
export class DeletePropertyUseCase {
  constructor(
    private propertyRepository: PropertyRepository,
    private bookingRepository: BookingRepository,
  ) {}

  async execute({
    propertyId,
    customerId,
  }: DeletePropertyUseCaseRequest): Promise<DeletePropertyUseCaseResponse> {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      return left(new PropertyNotFoundError());
    }

    if (property.customerId.toString() !== customerId) {
      return left(new PropertyDoesNotBelongToCustomerError());
    }

    const bookings = await this.bookingRepository.findByPropertyId(propertyId);
    const now = new Date();
    const hasActiveBooking = bookings.some(
      (booking) =>
        booking.status === 'confirmed' &&
        now >= booking.startDate &&
        now <= booking.endDate,
    );

    if (hasActiveBooking) {
      return left(new PropertyHasActiveBookingsError());
    }

    await this.propertyRepository.delete(propertyId);
    return right(null);
  }
}
