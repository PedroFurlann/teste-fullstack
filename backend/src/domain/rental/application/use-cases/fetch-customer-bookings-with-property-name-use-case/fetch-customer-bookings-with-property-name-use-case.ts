import { Injectable } from '@nestjs/common';
import { Either, right } from '../../../../../core/either';
import { BookingRepository } from '../../repositories/booking-repository';

interface FetchCustomerBookingsWithPropertyNameUseCaseRequest {
  customerId: string;
}

type FetchCustomerBookingsWithPropertyNameUseCaseResponse = Either<
  null,
  {
    bookings: {
      bookingId: string;
      propertyId: string;
      propertyName: string;
      propertyPricePerHour: number;
      startDate: Date;
      endDate: Date;
      finalPrice: number;
      status: string;
    }[];
  }
>;

@Injectable()
export class FetchCustomerBookingsWithPropertyNameUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute({
    customerId,
  }: FetchCustomerBookingsWithPropertyNameUseCaseRequest): Promise<FetchCustomerBookingsWithPropertyNameUseCaseResponse> {
    const bookingsWithProperty =
      await this.bookingRepository.findWithPropertyNameByCustomerId(customerId);

    const bookings = bookingsWithProperty.map(
      ({ booking, propertyName, propertyPricePerHour }) => ({
        bookingId: booking.id.toString(),
        propertyId: booking.propertyId.toString(),
        propertyName,
        propertyPricePerHour,
        startDate: booking.startDate,
        endDate: booking.endDate,
        finalPrice: booking.finalPrice,
        status: booking.status,
      }),
    );

    return right({ bookings });
  }
}
