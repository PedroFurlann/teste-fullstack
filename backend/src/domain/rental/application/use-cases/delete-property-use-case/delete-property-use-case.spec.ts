import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { InMemoryBookingRepository } from '../../../../../../test/repositories/in-memory-booking-repository';
import { DeletePropertyUseCase } from './delete-property-use-case';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { makeBooking } from '../../../../../../test/factories/make-booking';
import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { PropertyDoesNotBelongToCustomerError } from '../errors/property-does-not-belong-to-customer-error';
import { PropertyHasActiveBookingsError } from '../errors/property-has-active-bookings-error';

let inMemoryPropertyRepository: InMemoryPropertyRepository;
let inMemoryBookingRepository: InMemoryBookingRepository;
let sut: DeletePropertyUseCase;

describe('Delete Property', () => {
  beforeEach(() => {
    inMemoryPropertyRepository = new InMemoryPropertyRepository();
    inMemoryBookingRepository = new InMemoryBookingRepository();
    sut = new DeletePropertyUseCase(
      inMemoryPropertyRepository,
      inMemoryBookingRepository,
    );
  });

  it('should be able to delete a property if no active bookings exist', async () => {
    const property = makeProperty();

    await inMemoryPropertyRepository.create(property);

    const result = await sut.execute({
      propertyId: property.id.toString(),
      customerId: property.customerId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPropertyRepository.items).toHaveLength(0);
  });

  it('should return error if property has active bookings', async () => {
    const property = makeProperty();
    await inMemoryPropertyRepository.create(property);

    const now = new Date();
    const past = new Date(now.getTime() - 60 * 60 * 1000); // 1 hora atrás
    const future = new Date(now.getTime() + 60 * 60 * 1000); // 1 hora à frente
    const activeBooking = makeBooking({
      propertyId: property.id,
      customerId: property.customerId,
      startDate: past,
      endDate: future,
      status: 'confirmed',
    });
    await inMemoryBookingRepository.create(activeBooking);

    const result = await sut.execute({
      propertyId: property.id.toString(),
      customerId: property.customerId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PropertyHasActiveBookingsError);
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
