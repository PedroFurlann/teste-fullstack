import { Either, left, right } from '../../../../core/either';
import { Customer } from '../../enterprise/entities/customer';
import { HashGenerator } from '../cryptography/hash-generator';
import { Injectable } from '@nestjs/common';
import { CustomerAlreadyExistsError } from './errors/customer-already-exists-error';
import { CustomerRepository } from '../repositories/customer-repository';

interface RegisterCustomerUseCaseRequest {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
}

type RegisterCustomerUseCaseResponse = Either<
  CustomerAlreadyExistsError,
  {
    customer: Customer;
  }
>;

@Injectable()
export class RegisterCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    phone,
    email,
    password,
  }: RegisterCustomerUseCaseRequest): Promise<RegisterCustomerUseCaseResponse> {
    const customerAlreadyExists =
      await this.customerRepository.findByEmailOrCpf({
        email,
        cpf,
      });

    if (customerAlreadyExists) {
      return left(new CustomerAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const customer = Customer.create({
      name,
      email,
      cpf,
      phone,
      password: hashedPassword,
    });

    await this.customerRepository.create(customer);

    return right({
      customer,
    });
  }
}
