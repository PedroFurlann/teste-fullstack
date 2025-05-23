export class CustomerBookingsWithPropertyNamePresenter {
  static toHTTP(response: {
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
  }) {
    return {
      bookings: response.bookings.map((booking) => ({
        id: booking.bookingId,
        propertyId: booking.propertyId,
        propertyName: booking.propertyName,
        propertyPricePerHour: booking.propertyPricePerHour,
        startDate: booking.startDate,
        endDate: booking.endDate,
        finalPrice: booking.finalPrice,
        status: booking.status,
      })),
    };
  }
}
