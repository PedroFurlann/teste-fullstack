import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { DeletePropertyUseCase } from './delete-property-use-case';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { PropertyDoesNotBelongToCustomerError } from '../errors/property-does-not-belong-to-customer-error';

let inMemoryPropertyRepository: InMemoryPropertyRepository;
let sut: DeletePropertyUseCase;

describe('Delete Property', () => {
  beforeEach(() => {
    inMemoryPropertyRepository = new InMemoryPropertyRepository();
    sut = new DeletePropertyUseCase(inMemoryPropertyRepository);
  });

  it('should be able to delete a property', async () => {
    const property = makeProperty();

    await inMemoryPropertyRepository.create(property);

    const result = await sut.execute({
      propertyId: property.id.toString(),
      customerId: property.customerId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPropertyRepository.items).toHaveLength(0);
  });

  it('should return error if property does not exist', async () => {
    const result = await sut.execute({
      propertyId: new UniqueEntityID().toString(),
      customerId: new UniqueEntityID().toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PropertyNotFoundError);
  });

  it('should not allow deletion if property does not belong to customer', async () => {
    const property = makeProperty({
      customerId: new UniqueEntityID('customer-1'),
    });

    await inMemoryPropertyRepository.create(property);

    const result = await sut.execute({
      propertyId: property.id.toString(),
      customerId: 'customer-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PropertyDoesNotBelongToCustomerError);
  });
});
