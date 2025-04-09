import { Either, left, right } from '../../../../../core/either';
import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/customer-repository';
import { HashComparer } from '../../cryptography/hash-comparer';
import { Encrypter } from '../../cryptography/encrypter';
import { WrongCredentialsError } from './../errors/wrong-credentials-error';

interface AuthenticateCustomerUseCaseRequest {
  type: 'email' | 'cpf';
  identifier: string; // CPF ou email
  password: string;
}

type AuthenticateCustomerUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    type,
    identifier,
    password,
  }: AuthenticateCustomerUseCaseRequest): Promise<AuthenticateCustomerUseCaseResponse> {
    const customer = await this.customerRepository.findByEmailOrCpf({
      email: type === 'email' ? identifier : undefined,
      cpf: type === 'cpf' ? identifier : undefined,
    });

    if (!customer) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      customer.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: customer.id.toString(),
    });

    return right({ accessToken });
  }
}
