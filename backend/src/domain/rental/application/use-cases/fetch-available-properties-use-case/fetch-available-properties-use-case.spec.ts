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

it('should filter and sort properties by name in descending order', async () => {
  const propA = makeProperty({ name: 'Zeta' });
  const propB = makeProperty({ name: 'Alpha' });
  const propC = makeProperty({ name: 'Mid' });

  await inMemoryPropertyRepository.create(propA);
  await inMemoryPropertyRepository.create(propB);
  await inMemoryPropertyRepository.create(propC);

  const result = await sut.execute({
    startDate: new Date('2025-05-30T10:00:00'),
    endDate: new Date('2025-05-30T11:00:00'),
    orderBy: 'name',
    orderDirection: 'desc',
  });

  expect(result.isRight()).toBe(true);
  if (result.isRight()) {
    const names = result.value.properties.map((p) => p.name);
    expect(names).toEqual(['Zeta', 'Mid', 'Alpha']);
  }
});

it('should filter properties by name', async () => {
  const propA = makeProperty({ name: 'Beach House', type: 'car' });
  const propB = makeProperty({ name: 'Mountain Cabin', type: 'car' });
  const propC = makeProperty({ name: 'Beach Apartment', type: 'car' });

  await inMemoryPropertyRepository.create(propA);
  await inMemoryPropertyRepository.create(propB);
  await inMemoryPropertyRepository.create(propC);

  const result = await sut.execute({
    startDate: new Date('2025-05-30T10:00:00'),
    endDate: new Date('2025-05-30T11:00:00'),
    name: 'Beach',
  });

  expect(result.isRight()).toBe(true);
  if (result.isRight()) {
    const names = result.value.properties.map((p) => p.name);
    expect(names).toEqual(['Beach House', 'Beach Apartment']);
  }
});
it('should filter properties by description', async () => {
  const propA = makeProperty({
    description: 'Perfect for couples',
    type: 'car',
  });
  const propB = makeProperty({
    description: 'Family-friendly location',
    type: 'car',
  });
  const propC = makeProperty({
    description: 'Ideal for couples getaway',
    type: 'car',
  });

  await inMemoryPropertyRepository.create(propA);
  await inMemoryPropertyRepository.create(propB);
  await inMemoryPropertyRepository.create(propC);

  const result = await sut.execute({
    startDate: new Date('2025-05-30T10:00:00'),
    endDate: new Date('2025-05-30T11:00:00'),
    description: 'couples',
  });

  expect(result.isRight()).toBe(true);
  if (result.isRight()) {
    const descriptions = result.value.properties.map((p) => p.description);
    expect(descriptions).toEqual([
      'Perfect for couples',
      'Ideal for couples getaway',
    ]);
  }
});

it('should filter properties by name and description', async () => {
  const propA = makeProperty({
    name: 'Cozy Car',
    description: 'For long drives',
    type: 'car',
  });
  const propB = makeProperty({
    name: 'Cozy Car',
    description: 'City use only',
    type: 'car',
  });
  const propC = makeProperty({
    name: 'Fast Car',
    description: 'For long drives',
    type: 'car',
  });

  await inMemoryPropertyRepository.create(propA);
  await inMemoryPropertyRepository.create(propB);
  await inMemoryPropertyRepository.create(propC);

  const result = await sut.execute({
    startDate: new Date('2025-05-30T10:00:00'),
    endDate: new Date('2025-05-30T11:00:00'),
    name: 'Cozy Car',
    description: 'long drives',
  });

  expect(result.isRight()).toBe(true);
  if (result.isRight()) {
    const filtered = result.value.properties;
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Cozy Car');
    expect(filtered[0].description).toBe('For long drives');
  }
});
