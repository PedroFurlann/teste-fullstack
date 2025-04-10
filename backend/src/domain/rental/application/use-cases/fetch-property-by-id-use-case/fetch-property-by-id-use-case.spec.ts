import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { FetchPropertyByIdUseCase } from './fetch-property-by-id-use-case';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { PropertyNotFoundError } from '../errors/property-not-found-error';

let inMemoryPropertyRepository: InMemoryPropertyRepository;
let sut: FetchPropertyByIdUseCase;

describe('Fetch Property By Id', () => {
  beforeEach(() => {
    inMemoryPropertyRepository = new InMemoryPropertyRepository();
    sut = new FetchPropertyByIdUseCase(inMemoryPropertyRepository);
  });

  it('should be able to fetch a property by Id', async () => {
    const property = makeProperty();
    await inMemoryPropertyRepository.create(property);

    const result = await sut.execute({ propertyId: property.id.toString() });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.property).toEqual(property);
    }
  });

  it('should return an error if property does not exist', async () => {
    const result = await sut.execute({ propertyId: '1234' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PropertyNotFoundError);
  });
});
