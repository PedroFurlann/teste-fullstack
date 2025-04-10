import { InMemoryBookingRepository } from '../../../../../../test/repositories/in-memory-booking-repository';
import { InMemoryPropertyRepository } from '../../../../../../test/repositories/in-memory-property-repository';
import { CreateBookingUseCase } from './create-booking-use-case';
import { makeProperty } from '../../../../../../test/factories/make-property';
import { makeBooking } from '../../../../../../test/factories/make-booking';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { BookingDateConflictError } from '../errors/booking-date-conflict-error';
import { BookingTimeOutsideAllowedRangeError } from '../errors/booking-time-outside-allowed-range-error';
import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id';

let inMemoryBookingRepository: InMemoryBookingRepository;
let inMemoryPropertyRepository: InMemoryPropertyRepository;
let sut: CreateBookingUseCase;

describe('Create Booking', () => {
  beforeEach(() => {
    inMemoryBookingRepository = new InMemoryBookingRepository();
    inMemoryPropertyRepository = new InMemoryPropertyRepository();
    sut = new CreateBookingUseCase(
      inMemoryBookingRepository,
      inMemoryPropertyRepository,
    );
  });

  it('should be able to create a booking', async () => {
    const property = makeProperty({
      minTime: 1,
      maxTime: 5,
      pricePerHour: 100,
    });

    await inMemoryPropertyRepository.create(property);

    const startDate = new Date('2025-05-01T10:00:00Z');
    const endDate = new Date('2025-05-01T12:00:00Z');

    const result = await sut.execute({
      customerId: 'customer-01',
      propertyId: property.id.toString(),
      startDate,
      endDate,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { booking } = result.value;

      expect(booking.finalPrice).toBe(200);
      expect(booking.status).toBe('confirmed');
      expect(booking.customerId.toString()).toBe('customer-01');
      expect(booking.propertyId.toString()).toBe(property.id.toString());
    }
  });

  it('should not allow booking for non-existent property', async () => {
    const result = await sut.execute({
      customerId: 'customer-01',
      propertyId: '123',
      startDate: new Date(),
      endDate: new Date(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PropertyNotFoundError);
  });

  it('should not allow booking if date range overlaps with another booking', async () => {
    const property = makeProperty({
      minTime: 1,
      maxTime: 10,
      pricePerHour: 50,
    });

    await inMemoryPropertyRepository.create(property);

    const existingBooking = makeBooking({
      customerId: new UniqueEntityID('customer-01'),
      propertyId: property.id,
      startDate: new Date('2025-05-01T14:00:00Z'),
      endDate: new Date('2025-05-01T16:00:00Z'),
    });

    await inMemoryBookingRepository.create(existingBooking);

    const result = await sut.execute({
      customerId: 'customer-02',
      propertyId: property.id.toString(),
      startDate: new Date('2025-05-01T15:00:00Z'),
      endDate: new Date('2025-05-01T17:00:00Z'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BookingDateConflictError);
  });

  it('should not allow booking if time range is outside property constraints', async () => {
    const property = makeProperty({
      minTime: 2,
      maxTime: 4,
      pricePerHour: 100,
    });

    await inMemoryPropertyRepository.create(property);

    const result = await sut.execute({
      customerId: 'customer-03',
      propertyId: property.id.toString(),
      startDate: new Date('2025-05-01T10:00:00Z'),
      endDate: new Date('2025-05-01T11:00:00Z'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BookingTimeOutsideAllowedRangeError);
  });
});
