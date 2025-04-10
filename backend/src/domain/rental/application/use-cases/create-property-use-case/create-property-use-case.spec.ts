import { CreatePropertyUseCase } from './create-property-use-case';
import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { makeProperty } from '../../../../../../test/factories/make-property';

let inMemoryPropertyRepository: InMemoryPropertyRepository;
let sut: CreatePropertyUseCase;

describe('Create Property', () => {
  beforeEach(() => {
    inMemoryPropertyRepository = new InMemoryPropertyRepository();
    sut = new CreatePropertyUseCase(inMemoryPropertyRepository);
  });

  it('should be able to create a new property', async () => {
    const fakeProperty = makeProperty();

    const result = await sut.execute({
      customerId: fakeProperty.customerId.toString(),
      name: fakeProperty.name,
      type: fakeProperty.type,
      description: fakeProperty.description,
      minTime: fakeProperty.minTime,
      maxTime: fakeProperty.maxTime,
      pricePerHour: fakeProperty.pricePerHour,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { property } = result.value;

      expect(property.name).toBe(fakeProperty.name);
      expect(property.type).toBe(fakeProperty.type);
      expect(property.description).toBe(fakeProperty.description);
      expect(property.minTime).toBe(fakeProperty.minTime);
      expect(property.maxTime).toBe(fakeProperty.maxTime);
      expect(property.pricePerHour).toBe(fakeProperty.pricePerHour);
      expect(property.customerId.toString()).toBe(
        fakeProperty.customerId.toString(),
      );
    }
  });
});
