export interface BookingWithPropertyNameDTO {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyPricePerHour: number;
  startDate: Date;
  endDate: Date;
  finalPrice: number;
  status: string;
}