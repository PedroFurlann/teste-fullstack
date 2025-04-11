import { Booking } from '../../../domain/rental/enterprise/entities/booking';

export class BookingPresenter {
  static toHTTP(booking: Booking) {
    return {
      id: booking.id.toString(),
      propertyId: booking.propertyId.toString(),
      startDate: booking.startDate,
      endDate: booking.endDate,
      finalPrice: booking.finalPrice,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }
}
