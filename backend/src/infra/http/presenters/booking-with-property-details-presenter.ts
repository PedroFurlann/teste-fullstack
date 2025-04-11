export class BookingWithPropertyDetailsPresenter {
  static toHTTP(response: {
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
  }) {
    return {
      id: response.bookingId,
      propertyId: response.propertyId.toString(),
      startDate: response.startDate,
      endDate: response.endDate,
      finalPrice: response.finalPrice,
      status: response.status,
      propertyDetails: {
        name: response.propertyDetails.name,
        description: response.propertyDetails.description,
        type: response.propertyDetails.type,
        pricePerHour: response.propertyDetails.pricePerHour,
        minTime: response.propertyDetails.minTime,
        maxTime: response.propertyDetails.maxTime,
      },
    };
  }
}
