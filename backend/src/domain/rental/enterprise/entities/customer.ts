import { Optional } from '../../../../core/types/optional';
import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export interface CustomerProps {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Customer extends Entity<CustomerProps> {
  get name() {
    return this.props.name;
  }

  set name(newName: string) {
    this.props.name = newName;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  set password(newPassword: string) {
    this.props.password = newPassword;
    this.touch();
  }

  get phone() {
    return this.props.phone;
  }

  set phone(newPhone: string) {
    this.props.phone = newPhone;
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
    props: Optional<CustomerProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const customer = new Customer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return customer;
  }
}
