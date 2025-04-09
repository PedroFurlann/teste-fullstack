import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer-repository';
import { Either, left, right } from '../../../../core/either';
import { CustomerNotFoundError } from './errors/customer-not-found-error';

interface DeleteCustomerUseCaseRequest {
  customerId: string;
}

type DeleteCustomerUseCaseResponse = Either<CustomerNotFoundError, null>;

@Injectable()
export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute({
    customerId,
  }: DeleteCustomerUseCaseRequest): Promise<DeleteCustomerUseCaseResponse> {
    const customerExists = await this.customerRepository.findById(customerId);

    if (!customerExists) {
      return left(new CustomerNotFoundError());
    }

    await this.customerRepository.delete(customerId);

    return right(null);
  }
}
