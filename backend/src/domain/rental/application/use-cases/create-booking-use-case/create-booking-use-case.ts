import { Either, left, right } from '../../../../../core/either';
import { Booking } from '../../../enterprise/entities/booking';
import { PropertyRepository } from '../../repositories/property-repository';
import { BookingRepository } from '../../repositories/booking-repository';
import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { BookingTimeOutsideAllowedRangeError } from '../errors/booking-time-outside-allowed-range-error';
import { BookingDateConflictError } from '../errors/booking-date-conflict-error';

interface CreateBookingUseCaseRequest {
  customerId: string;
  propertyId: string;
  startDate: Date;
  endDate: Date;
}

type CreateBookingUseCaseResponse = Either<
  | PropertyNotFoundError
  | BookingDateConflictError
  | BookingTimeOutsideAllowedRangeError,
  {
    booking: Booking;
  }
>;

export class CreateBookingUseCase {
  constructor(
    private bookingRepository: BookingRepository,
    private propertyRepository: PropertyRepository,
  ) {}

  async execute({
    customerId,
    propertyId,
    startDate,
    endDate,
  }: CreateBookingUseCaseRequest): Promise<CreateBookingUseCaseResponse> {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      return left(new PropertyNotFoundError());
    }

    const existingBookings =
      await this.bookingRepository.findByPropertyId(propertyId);

    const hasConflict = existingBookings.some((booking) => {
      return (
        booking.status === 'confirmed' &&
        startDate <= booking.endDate &&
        endDate >= booking.startDate
      );
    });

    if (hasConflict) {
      return left(new BookingDateConflictError());
    }

    const durationInHours =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    if (
      durationInHours < property.minTime ||
      durationInHours > property.maxTime
    ) {
      return left(new BookingTimeOutsideAllowedRangeError());
    }

    const finalPrice = durationInHours * property.pricePerHour;

    const booking = Booking.create({
      customerId: new UniqueEntityID(customerId),
      propertyId: new UniqueEntityID(propertyId),
      startDate,
      endDate,
      finalPrice,
      status: 'confirmed',
    });

    await this.bookingRepository.create(booking);

    return right({ booking });
  }
}
