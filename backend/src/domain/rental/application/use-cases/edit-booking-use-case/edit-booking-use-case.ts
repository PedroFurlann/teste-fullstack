import { Either, left, right } from '../../../../../core/either';
import { Booking } from '../../../enterprise/entities/booking';
import { BookingRepository } from '../../repositories/booking-repository';
import { PropertyRepository } from '../../repositories/property-repository';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { BookingDateConflictError } from '../errors/booking-date-conflict-error';
import { BookingTimeOutsideAllowedRangeError } from '../errors/booking-time-outside-allowed-range-error';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { BookingDoesNotBelongToCustomerError } from '../errors/booking-does-not-belong-to-customer-error';

interface EditBookingUseCaseRequest {
  bookingId: string;
  customerId: string;
  startDate: Date;
  endDate: Date;
}

type EditBookingUseCaseResponse = Either<
  | PropertyNotFoundError
  | BookingNotFoundError
  | BookingDateConflictError
  | BookingTimeOutsideAllowedRangeError
  | BookingDoesNotBelongToCustomerError,
  {
    booking: Booking;
  }
>;

export class EditBookingUseCase {
  constructor(
    private bookingRepository: BookingRepository,
    private propertyRepository: PropertyRepository,
  ) {}

  async execute({
    bookingId,
    customerId,
    startDate,
    endDate,
  }: EditBookingUseCaseRequest): Promise<EditBookingUseCaseResponse> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      return left(new BookingNotFoundError());
    }

    if (booking.customerId.toString() !== customerId) {
      return left(new BookingDoesNotBelongToCustomerError());
    }

    const property = await this.propertyRepository.findById(
      booking.propertyId.toString(),
    );

    if (!property) {
      return left(new PropertyNotFoundError());
    }

    const hasConflict = (
      await this.bookingRepository.findByPropertyId(property.id.toString())
    ).some((b) => {
      return (
        b.id.toString() !== booking.id.toString() &&
        b.status === 'confirmed' &&
        startDate <= b.endDate &&
        endDate >= b.startDate
      );
    });

    if (hasConflict) {
      return left(new BookingDateConflictError());
    }

    const durationInHours =
      (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60;

    if (
      durationInHours < property.minTime ||
      durationInHours > property.maxTime
    ) {
      return left(new BookingTimeOutsideAllowedRangeError());
    }

    const finalPrice = durationInHours * property.pricePerHour;

    booking.startDate = startDate;
    booking.endDate = endDate;
    booking.finalPrice = finalPrice;
    booking.status = 'confirmed';

    await this.bookingRepository.update(booking);

    return right({ booking });
  }
}
