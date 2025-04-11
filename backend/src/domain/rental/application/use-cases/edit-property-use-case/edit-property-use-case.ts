import { Either, left, right } from '../../../../../core/either';
import { PropertyRepository } from '../../repositories/property-repository';
import { Injectable } from '@nestjs/common';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { PropertyDoesNotBelongToCustomerError } from '../errors/property-does-not-belong-to-customer-error'; // <- novo
import { Property } from '../../../../../domain/rental/enterprise/entities/property';

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
  { property: Property }
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
    const propertySelected = await this.propertyRepository.findById(propertyId);

    if (!propertySelected) {
      return left(new PropertyNotFoundError());
    }

    if (propertySelected.customerId.toString() !== customerId) {
      return left(new PropertyDoesNotBelongToCustomerError());
    }

    if (name) propertySelected.name = name;
    if (type) propertySelected.type = type;
    if (description) propertySelected.description = description;
    if (minTime) propertySelected.minTime = minTime;
    if (maxTime) propertySelected.maxTime = maxTime;
    if (pricePerHour) propertySelected.pricePerHour = pricePerHour;

    await this.propertyRepository.update(propertySelected);

    return right({
      property: propertySelected,
    });
  }
}
