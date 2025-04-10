import { Customer } from '../../../enterprise/entities/customer';
import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/customer-repository';
import { Either, left, right } from '../../../../../core/either';
import { HashGenerator } from '../../cryptography/hash-generator';
import { CustomerNotFoundError } from '../errors/customer-not-found-error';

interface EditCustomerUseCaseRequest {
  customerId: string;
  name?: string;
  phone?: string;
  password?: string | null;
}

type EditCustomerUseCaseResponse = Either<
  CustomerNotFoundError,
  { customer: Customer }
>;

@Injectable()
export class EditCustomerUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    customerId,
    name,
    phone,
    password,
  }: EditCustomerUseCaseRequest): Promise<EditCustomerUseCaseResponse> {
    const customerSelected = await this.customerRepository.findById(customerId);

    if (!customerSelected) {
      return left(new CustomerNotFoundError());
    }

    if (name) customerSelected.name = name;

    if (phone) customerSelected.phone = phone;

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password);
      customerSelected.password = hashedPassword;
    }

    await this.customerRepository.update(customerSelected);

    return right({
      customer: customerSelected,
    });
  }
}
