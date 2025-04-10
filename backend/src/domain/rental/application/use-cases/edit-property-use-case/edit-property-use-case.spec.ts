import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { EditPropertyUseCase } from './edit-property-use-case';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { PropertyDoesNotBelongToCustomerError } from '../errors/property-does-not-belong-to-customer-error';
import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id';

let inMemoryPropertyRepository: InMemoryPropertyRepository;
let sut: EditPropertyUseCase;

describe('Edit Property Use Case', () => {
  beforeEach(() => {
    inMemoryPropertyRepository = new InMemoryPropertyRepository();
    sut = new EditPropertyUseCase(inMemoryPropertyRepository);
  });

  it('should be able to edit a property', async () => {
    const property = makeProperty();

    await inMemoryPropertyRepository.create(property);

    const result = await sut.execute({
      propertyId: property.id.toString(),
      customerId: property.customerId.toString(),
      name: 'Updated Name',
      description: 'Updated Description',
      minTime: 3,
      maxTime: 10,
      pricePerHour: 99,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPropertyRepository.items[0].name).toBe('Updated Name');
    expect(inMemoryPropertyRepository.items[0].description).toBe(
      'Updated Description',
    );
    expect(inMemoryPropertyRepository.items[0].minTime).toBe(3);
    expect(inMemoryPropertyRepository.items[0].maxTime).toBe(10);
    expect(inMemoryPropertyRepository.items[0].pricePerHour).toBe(99);
  });

  it('should return error if property does not exist', async () => {
    const result = await sut.execute({
      propertyId: 'non-existent-id',
      customerId: new UniqueEntityID().toString(),
      name: 'Whatever',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PropertyNotFoundError);
  });

  it('should return error if property does not belong to customer', async () => {
    const property = makeProperty();

    await inMemoryPropertyRepository.create(property);

    const otherCustomerId = new UniqueEntityID().toString();

    const result = await sut.execute({
      propertyId: property.id.toString(),
      customerId: otherCustomerId,
      name: 'Invalid Update',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PropertyDoesNotBelongToCustomerError);
  });
});
