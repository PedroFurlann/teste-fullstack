export interface PropertyDTO {
  id: string;
  name: string;
  description: string;
  type: string;
  minTime: number;
  maxTime: number;
  pricePerHour: number;
  createdAt: Date | null;
  updatedAt?: Date | null;
}
