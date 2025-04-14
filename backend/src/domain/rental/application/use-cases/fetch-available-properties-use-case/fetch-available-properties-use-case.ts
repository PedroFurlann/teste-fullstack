import { Either, left, right } from '../../../../../core/either';
import { Property } from '../../../enterprise/entities/property';
import { PropertyRepository } from '../../repositories/property-repository';
import { Injectable } from '@nestjs/common';
import { InvalidDateError } from '../errors/invalid-date-error';

interface FetchAvailablePropertiesUseCaseRequest {
  startDate: Date;
  endDate: Date;
  name?: string;
  description?: string;
  type?: string;
  orderBy?: 'pricePerHour' | 'name' | 'description' | 'type';
  orderDirection?: 'asc' | 'desc';
}

type FetchAvailablePropertiesUseCaseResponse = Either<
  InvalidDateError,
  {
    properties: Property[];
  }
>;

@Injectable()
export class FetchAvailablePropertiesUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute({
    startDate,
    endDate,
    name,
    description,
    type,
    orderBy,
    orderDirection,
  }: FetchAvailablePropertiesUseCaseRequest): Promise<FetchAvailablePropertiesUseCaseResponse> {
    if (startDate >= endDate) {
      return left(new InvalidDateError());
    }

    const nameInLowerCase = name?.toLowerCase();
    const descriptionInLowerCase = description?.toLowerCase();
    const typeInLowerCase = type?.toLowerCase();

    const properties = await this.propertyRepository.findAllAvailable({
      startDate,
      endDate,
      name: nameInLowerCase,
      description: descriptionInLowerCase,
      type: typeInLowerCase,
      orderBy,
      orderDirection,
    });

    return right({ properties });
  }
}
