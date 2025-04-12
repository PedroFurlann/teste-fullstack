import { Either, right, left } from '../../../../../core/either';
import { Property } from '../../../enterprise/entities/property';
import { PropertyRepository } from '../../repositories/property-repository';
import { UniqueEntityID } from '../../../../../core/entities/unique-entity-id';
import { InvalidTimeError } from '../errors/invalid-time-error';
import { Injectable } from '@nestjs/common';

interface CreatePropertyUseCaseRequest {
  customerId: string;
  name: string;
  type: string;
  description: string;
  minTime: number;
  maxTime: number;
  pricePerHour: number;
}

type CreatePropertyUseCaseResponse = Either<
  InvalidTimeError,
  { property: Property }
>;

@Injectable()
export class CreatePropertyUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute({
    customerId,
    name,
    type,
    description,
    minTime,
    maxTime,
    pricePerHour,
  }: CreatePropertyUseCaseRequest): Promise<CreatePropertyUseCaseResponse> {
    if (minTime >= maxTime) {
      return left(new InvalidTimeError());
    }

    const property = Property.create({
      customerId: new UniqueEntityID(customerId),
      name,
      type,
      description,
      minTime,
      maxTime,
      pricePerHour,
    });

    await this.propertyRepository.create(property);

    return right({ property });
  }
}
