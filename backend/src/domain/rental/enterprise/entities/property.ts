import { Optional } from '../../../../core/types/optional';
import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export interface PropertyProps {
  customerId: UniqueEntityID;
  name: string;
  type: string;
  description: string;
  minTime: number;
  maxTime: number;
  pricePerHour: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Property extends Entity<PropertyProps> {
  get customerId() {
    return this.props.customerId;
  }

  get name() {
    return this.props.name;
  }

  set name(newName: string) {
    this.props.name = newName;
    this.touch();
  }

  get type() {
    return this.props.type;
  }

  set type(newType: string) {
    this.props.type = newType;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(newDescription: string) {
    this.props.description = newDescription;
    this.touch();
  }

  get minTime() {
    return this.props.minTime;
  }

  set minTime(newMinTime: number) {
    this.props.minTime = newMinTime;
    this.touch();
  }

  get maxTime() {
    return this.props.maxTime;
  }

  set maxTime(newMaxTime: number) {
    this.props.maxTime = newMaxTime;
    this.touch();
  }

  get pricePerHour() {
    return this.props.pricePerHour;
  }

  set pricePerHour(newPricePerHour: number) {
    this.props.pricePerHour = newPricePerHour;
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
    props: Optional<PropertyProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const property = new Property(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return property;
  }
}
