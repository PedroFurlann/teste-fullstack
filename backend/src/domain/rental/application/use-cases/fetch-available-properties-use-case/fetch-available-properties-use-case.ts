import { Either, left, right } from '../../../../../core/either';
import { Property } from '../../../enterprise/entities/property';
import { PropertyRepository } from '../../repositories/property-repository';
import { Injectable } from '@nestjs/common';
import { InvalidDateError } from '../errors/invalid-date-error';

interface FetchAvailablePropertiesUseCaseRequest {
  startDate: Date;
  endDate: Date;
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
  }: FetchAvailablePropertiesUseCaseRequest): Promise<FetchAvailablePropertiesUseCaseResponse> {
    if (startDate >= endDate) {
      return left(new InvalidDateError());
    }

    const properties = await this.propertyRepository.findAllAvailable(
      startDate,
      endDate,
    );

    return right({ properties });
  }
}
