import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';
import {
  Customer,
  CustomerProps,
} from '../../src/domain/rental/enterprise/entities/customer';
import { faker } from '@faker-js/faker';

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityID,
): Customer {
  return Customer.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.string.numeric(11),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      ...override,
    },
    id,
  );
}
