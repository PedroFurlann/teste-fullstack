import { Optional } from '../../../../core/types/optional';
import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export interface BookingProps {
  customerId: UniqueEntityID;
  propertyId: UniqueEntityID;
  startDate: Date;
  endDate: Date;
  finalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Booking extends Entity<BookingProps> {
  get customerId() {
    return this.props.customerId;
  }

  get propertyId() {
    return this.props.propertyId;
  }

  get startDate() {
    return this.props.startDate;
  }

  set startDate(newStartDate: Date) {
    this.props.startDate = newStartDate;
    this.touch();
  }

  get endDate() {
    return this.props.endDate;
  }

  set endDate(newEndDate: Date) {
    this.props.endDate = newEndDate;
    this.touch();
  }

  get finalPrice() {
    return this.props.finalPrice;
  }

  set finalPrice(newFinalPrice: number) {
    this.props.finalPrice = newFinalPrice;
    this.touch();
  }

  get status() {
    return this.props.status;
  }

  set status(newStatus: string) {
    this.props.status = newStatus;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<BookingProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const booking = new Booking(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return booking;
  }
}
