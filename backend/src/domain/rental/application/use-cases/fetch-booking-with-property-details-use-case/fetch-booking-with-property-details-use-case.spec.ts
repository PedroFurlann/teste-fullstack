import { InMemoryBookingRepository } from '../../../../../../test/repositories/in-memory-booking-repository';
import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { makeBooking } from '../../../../../../test/factories/make-booking';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id';
import { FetchBookingWithPropertyDetailsUseCase } from './fetch-booking-with-property-details-use-case';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { BookingNotFoundError } from '../errors/booking-not-found-error';

let inMemoryBookingRepository: InMemoryBookingRepository;
let inMemoryPropertyRepository: InMemoryPropertyRepository;
let sut: FetchBookingWithPropertyDetailsUseCase;

describe('Fetch Booking With Property Details', () => {
  beforeEach(() => {
    inMemoryBookingRepository = new InMemoryBookingRepository();
    inMemoryPropertyRepository = new InMemoryPropertyRepository();
    sut = new FetchBookingWithPropertyDetailsUseCase(
      inMemoryBookingRepository,
      inMemoryPropertyRepository,
    );
  });

  it('should fetch booking details with associated property information', async () => {
    const customerId = new UniqueEntityID('customer-1');

    const property = makeProperty({
      name: 'Mustang',
      description: 'Black Mustang',
      type: 'car',
      pricePerHour: 100,
    });
    await inMemoryPropertyRepository.create(property);

    const booking = makeBooking({
      customerId,
      propertyId: property.id,
      startDate: new Date('2025-05-01T12:00:00Z'),
      endDate: new Date('2025-05-03T12:00:00Z'),
      finalPrice: 200,
    });

    await inMemoryBookingRepository.create(booking);

    const result = await sut.execute({
      bookingId: booking.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      bookingId: booking.id.toString(),
      propertyId: booking.propertyId.toString(),
      startDate: booking.startDate,
      endDate: booking.endDate,
      finalPrice: booking.finalPrice,
      status: booking.status,
      propertyDetails: {
        name: 'Mustang',
        description: 'Black Mustang',
        type: 'car',
        pricePerHour: 100,
        minTime: property.minTime,
        maxTime: property.maxTime,
      },
    });
  });

  it('should return PropertyNotFoundError if property associated with booking does not exist', async () => {
    const customerId = new UniqueEntityID('customer-1');
    const booking = makeBooking({ customerId });

    await inMemoryBookingRepository.create(booking);

    const result = await sut.execute({
      bookingId: booking.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PropertyNotFoundError);
  });

  it('should return BookingNotFoundError if booking does not exist', async () => {
    const result = await sut.execute({
      bookingId: new UniqueEntityID().toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BookingNotFoundError);
  });
});
