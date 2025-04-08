import { Customer } from '../../enterprise/entities/customer';

type AtLeastOne<T, Keys extends keyof T = keyof T> = Keys extends keyof T
  ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
  : never;

export abstract class CustomerRepository {
  abstract create(customer: Customer): Promise<void>;
  abstract findByEmailOrCpf(
    params: AtLeastOne<{ email: string; cpf: string }>,
  ): Promise<Customer | null>;
  abstract findById(customerId: string): Promise<Customer | null>;
  abstract update(customer: Customer): Promise<void>;
  abstract delete(customerId: string): Promise<void>;
}
