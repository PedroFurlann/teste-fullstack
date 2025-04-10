import { Either, left, right } from '../../../../../core/either';
import { PropertyRepository } from '../../repositories/property-repository';
import { Injectable } from '@nestjs/common';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { PropertyDoesNotBelongToCustomerError } from '../errors/property-does-not-belong-to-customer-error'; // <- novo

interface EditPropertyUseCaseRequest {
  propertyId: string;
  customerId: string;
  name?: string;
  type?: string;
  description?: string;
  minTime?: number;
  maxTime?: number;
  pricePerHour?: number;
}

type EditPropertyUseCaseResponse = Either<
  PropertyNotFoundError | PropertyDoesNotBelongToCustomerError,
  null
>;

@Injectable()
export class EditPropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute({
    propertyId,
    customerId,
    name,
    type,
    description,
    minTime,
    maxTime,
    pricePerHour,
  }: EditPropertyUseCaseRequest): Promise<EditPropertyUseCaseResponse> {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      return left(new PropertyNotFoundError());
    }

    if (property.customerId.toString() !== customerId) {
      return left(new PropertyDoesNotBelongToCustomerError());
    }

    if (name) property.name = name;
    if (type) property.type = type;
    if (description) property.description = description;
    if (minTime) property.minTime = minTime;
    if (maxTime) property.maxTime = maxTime;
    if (pricePerHour) property.pricePerHour = pricePerHour;

    await this.propertyRepository.update(property);

    return right(null);
  }
}
