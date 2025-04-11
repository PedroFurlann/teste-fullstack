import { Customer } from '../../../domain/rental/enterprise/entities/customer';

export class CustomerPresenter {
  static toHTTP(customer: Customer) {
    return {
      id: customer.id.toString(),
      name: customer.name,
      email: customer.email,
      cpf: customer.cpf,
      phone: customer.phone,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
