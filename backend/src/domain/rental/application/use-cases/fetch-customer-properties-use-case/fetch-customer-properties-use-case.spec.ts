import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { FetchCustomerPropertiesUseCase } from './fetch-customer-properties-use-case';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id';

let inMemoryPropertyRepository: InMemoryPropertyRepository;
let sut: FetchCustomerPropertiesUseCase;

describe('Fetch Customer Properties', () => {
  beforeEach(() => {
    inMemoryPropertyRepository = new InMemoryPropertyRepository();
    sut = new FetchCustomerPropertiesUseCase(inMemoryPropertyRepository);
  });

  it('should fetch all properties for a given customer', async () => {
    const customerId = new UniqueEntityID();

    const property1 = makeProperty({ customerId });
    const property2 = makeProperty({ customerId });
    const propertyOfAnotherCustomer = makeProperty();

    await inMemoryPropertyRepository.create(property1);
    await inMemoryPropertyRepository.create(property2);
    await inMemoryPropertyRepository.create(propertyOfAnotherCustomer);

    const result = await sut.execute({ customerId: customerId.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { properties } = result.value;
      expect(properties).toHaveLength(2);
      expect(properties).toEqual(
        expect.arrayContaining([property1, property2]),
      );
    }
  });

  it('should return an empty array if customer has no properties', async () => {
    const result = await sut.execute({ customerId: '123' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.properties).toHaveLength(0);
    }
  });
});
