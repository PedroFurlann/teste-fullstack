/* eslint-disable @typescript-eslint/require-await */

import { CustomerRepository } from '../../src/domain/rental/application/repositories/customer-repository';
import { Customer } from '../../src/domain/rental/enterprise/entities/customer';

export class InMemoryCustomerRepository implements CustomerRepository {
  public items: Customer[] = [];

  async create(customer: Customer): Promise<void> {
    this.items.push(customer);
  }

  async findByEmailOrCpf(params: {
    email?: string;
    cpf?: string;
  }): Promise<Customer | null> {
    const { email, cpf } = params;

    return (
      this.items.find((customer) => {
        return (
          (email && customer.email === email) || (cpf && customer.cpf === cpf)
        );
      }) ?? null
    );
  }

  async findById(customerId: string): Promise<Customer | null> {
    return this.items.find((c) => c.id.toString() === customerId) ?? null;
  }

  async update(customer: Customer): Promise<void> {
    const index = this.items.findIndex((c) => c.id === customer.id);
    if (index >= 0) {
      this.items[index] = customer;
    }
  }

  async delete(customerId: string): Promise<void> {
    this.items = this.items.filter((c) => c.id.toString() !== customerId);
  }
}
