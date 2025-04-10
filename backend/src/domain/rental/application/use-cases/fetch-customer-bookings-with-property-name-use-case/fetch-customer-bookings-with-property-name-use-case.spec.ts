import { InMemoryBookingRepository } from '../../../../../../test/repositories/in-memory-booking-repository';
import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { makeBooking } from '../../../../../../test/factories/make-booking';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { FetchCustomerBookingsWithPropertyNameUseCase } from './fetch-customer-bookings-with-property-name-use-case';

describe('Fetch customer bookings with property name', () => {
  it('should return customer bookings with property names', async () => {
    const bookingRepository = new InMemoryBookingRepository();
    const propertyRepository = new InMemoryPropertyRepository();
    const fetchCustomerBookingsWithPropertyName =
      new FetchCustomerBookingsWithPropertyNameUseCase(bookingRepository);

    const property = makeProperty({ name: 'Mustang' });
    const booking = makeBooking({
      propertyId: property.id,
      customerId: property.customerId,
    });

    propertyRepository.items.push(property);
    bookingRepository.items.push(booking);
    bookingRepository.properties.push(property);

    const result = await fetchCustomerBookingsWithPropertyName.execute({
      customerId: booking.customerId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeDefined();
    expect(result.value?.bookings).toHaveLength(1);
    expect(result.value?.bookings[0].propertyId).toEqual(
      property.id.toString(),
    );
    expect(result.value?.bookings[0].propertyName).toEqual('Mustang');
  });
});
