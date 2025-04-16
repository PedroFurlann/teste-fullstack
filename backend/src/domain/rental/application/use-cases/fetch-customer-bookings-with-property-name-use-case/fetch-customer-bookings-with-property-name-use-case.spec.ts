import { InMemoryBookingRepository } from '../../../../../../test/repositories/in-memory-booking-repository';
import { makeBooking } from '../../../../../../test/factories/make-booking';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id';
import { FetchCustomerBookingsWithPropertyNameUseCase } from './fetch-customer-bookings-with-property-name-use-case';

let inMemoryBookingRepository: InMemoryBookingRepository;
let sut: FetchCustomerBookingsWithPropertyNameUseCase;

describe('Fetch customer bookings with property name', () => {
  beforeEach(() => {
    inMemoryBookingRepository = new InMemoryBookingRepository();
    sut = new FetchCustomerBookingsWithPropertyNameUseCase(
      inMemoryBookingRepository,
    );
  });

  it('should return customer bookings with properties names', async () => {
    const customerId = new UniqueEntityID('customer-1');

    const property = makeProperty({
      name: 'Mustang',
      customerId: customerId,
      pricePerHour: 100,
    });
    const booking = makeBooking({
      propertyId: property.id,
      customerId: customerId,
    });

    inMemoryBookingRepository.items.push(booking);
    inMemoryBookingRepository.properties.push(property);

    const result = await sut.execute({
      customerId: customerId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeDefined();
    expect(result.value?.bookings).toHaveLength(1);
    expect(result.value?.bookings[0].propertyId).toEqual(
      property.id.toString(),
    );
    expect(result.value?.bookings[0].propertyName).toEqual('Mustang');
    expect(result.value?.bookings[0].propertyPricePerHour).toEqual(100);
  });
});
