import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';
import {
  Property,
  PropertyProps,
} from '../../src/domain/rental/enterprise/entities/property';
import { faker } from '@faker-js/faker';

export function makeProperty(
  override: Partial<PropertyProps> = {},
  id?: UniqueEntityID,
): Property {
  return Property.create(
    {
      customerId: new UniqueEntityID(),
      name: faker.location.streetAddress(),
      type: 'Car',
      description: faker.lorem.paragraph(),
      minTime: 1,
      maxTime: 10,
      pricePerHour: faker.number.int({ min: 50, max: 300 }),
      ...override,
    },
    id,
  );
}
