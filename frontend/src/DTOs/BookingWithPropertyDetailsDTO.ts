export interface BookingWithPropertyDetailsDTO {
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
