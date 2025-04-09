import { Either, left, right } from '../../../../core/either';
import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer-repository';
import { Customer } from '../../enterprise/entities/customer';
import { CustomerNotFoundError } from './errors/customer-not-found-error';

interface FetchCustomerByIdUseCaseRequest {
  customerId: string;
}

type FetchCustomerByIdUseCaseResponse = Either<
  CustomerNotFoundError,
  { customer: Customer }
>;

@Injectable()
export class FetchCustomerByIdUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute({
    customerId,
  }: FetchCustomerByIdUseCaseRequest): Promise<FetchCustomerByIdUseCaseResponse> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      return left(new CustomerNotFoundError());
    }

    return right({ customer });
  }
}
