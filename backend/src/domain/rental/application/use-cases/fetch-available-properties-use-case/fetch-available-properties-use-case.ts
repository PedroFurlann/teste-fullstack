import { Either, right } from '../../../../../core/either';
import { Property } from '../../../enterprise/entities/property';
import { PropertyRepository } from '../../repositories/property-repository';
import { Injectable } from '@nestjs/common';

interface FetchAvailablePropertiesUseCaseRequest {
  startDate: Date;
  endDate: Date;
}

type FetchAvailablePropertiesUseCaseResponse = Either<
  null,
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
    const properties = await this.propertyRepository.findAllAvailable(
      startDate,
      endDate,
    );

    return right({ properties });
  }
}
