import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { FetchAvailablePropertiesUseCase } from './fetch-available-properties-use-case';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { makeBooking } from '../../../../../../test/factories/make-booking';
import { InvalidDateError } from '../errors/invalid-date-error';

let inMemoryPropertyRepository: InMemoryPropertyRepository;
let sut: FetchAvailablePropertiesUseCase;

describe('Fetch Available Properties', () => {
  beforeEach(() => {
    inMemoryPropertyRepository = new InMemoryPropertyRepository();
    sut = new FetchAvailablePropertiesUseCase(inMemoryPropertyRepository);
  });

  it('should return only available properties in the given date range', async () => {
    const property1 = makeProperty();
    const property2 = makeProperty();
    const property3 = makeProperty();

    await inMemoryPropertyRepository.create(property1);
    await inMemoryPropertyRepository.create(property2);
    await inMemoryPropertyRepository.create(property3);

    const conflictingBooking = makeBooking({
      propertyId: property2.id,
      startDate: new Date('2025-04-15T10:00:00'),
      endDate: new Date('2025-04-15T12:00:00'),
      status: 'confirmed',
    });

    inMemoryPropertyRepository.bookings.push(conflictingBooking);

    const result = await sut.execute({
      startDate: new Date('2025-04-15T09:00:00'),
      endDate: new Date('2025-04-15T13:00:00'),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { properties } = result.value;

      expect(properties).toHaveLength(2);
      expect(properties).toEqual(
        expect.arrayContaining([property1, property3]),
      );
      expect(properties).not.toEqual(expect.arrayContaining([property2]));
    }
  });

  it('should return all properties if there are no bookings', async () => {
    const property1 = makeProperty();
    const property2 = makeProperty();

    await inMemoryPropertyRepository.create(property1);
    await inMemoryPropertyRepository.create(property2);

    const result = await sut.execute({
      startDate: new Date('2025-05-01T08:00:00'),
      endDate: new Date('2025-05-01T10:00:00'),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { properties } = result.value;
      expect(properties).toHaveLength(2);
    }
  });

  it('should return error if startDate is greater than or equal to endDate', async () => {
    const result = await sut.execute({
      startDate: new Date('2025-05-01T10:00:00'),
      endDate: new Date('2025-05-01T08:00:00'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidDateError);
  });
});
