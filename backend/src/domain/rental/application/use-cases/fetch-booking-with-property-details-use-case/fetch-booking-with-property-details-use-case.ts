import { Either, left, right } from '../../../../../core/either';
import { BookingRepository } from '../../repositories/booking-repository';
import { PropertyRepository } from '../../repositories/property-repository';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { BookingNotFoundError } from '../errors/booking-not-found-error';

interface FetchBookingWithPropertyDetailsUseCaseRequest {
  bookingId: string;
}

type FetchBookingWithPropertyDetailsUseCaseResponse = Either<
  PropertyNotFoundError | BookingNotFoundError,
  {
    bookingId: string;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    finalPrice: number;
    status: string;
    propertyDetails: {
      name: string;
      description: string;
      type: string;
      pricePerHour: number;
      minTime: number;
      maxTime: number;
    };
  }
>;

export class FetchBookingWithPropertyDetailsUseCase {
  constructor(
    private bookingRepository: BookingRepository,
    private propertyRepository: PropertyRepository,
  ) {}

  async execute({
    bookingId,
  }: FetchBookingWithPropertyDetailsUseCaseRequest): Promise<FetchBookingWithPropertyDetailsUseCaseResponse> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      return left(new BookingNotFoundError());
    }

    const property = await this.propertyRepository.findById(
      booking.propertyId.toString(),
    );

    if (!property) {
      return left(new PropertyNotFoundError());
    }

    return right({
      bookingId: booking.id.toString(),
      propertyId: booking.propertyId.toString(),
      startDate: booking.startDate,
      endDate: booking.endDate,
      finalPrice: booking.finalPrice,
      status: booking.status,
      propertyDetails: {
        name: property.name,
        description: property.description,
        type: property.type,
        pricePerHour: property.pricePerHour,
        minTime: property.minTime,
        maxTime: property.maxTime,
      },
    });
  }
}
