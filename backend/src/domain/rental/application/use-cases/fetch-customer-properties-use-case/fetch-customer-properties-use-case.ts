import { Either, right } from '../../../../../core/either';
import { Property } from '../../../enterprise/entities/property';
import { PropertyRepository } from '../../repositories/property-repository';
import { Injectable } from '@nestjs/common';

interface FetchCustomerPropertiesUseCaseRequest {
  customerId: string;
}

type FetchCustomerPropertiesUseCaseResponse = Either<
  null,
  {
    properties: Property[];
  }
>;

@Injectable()
export class FetchCustomerPropertiesUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute({
    customerId,
  }: FetchCustomerPropertiesUseCaseRequest): Promise<FetchCustomerPropertiesUseCaseResponse> {
    const properties =
      await this.propertyRepository.findByCustomerId(customerId);

    return right({ properties });
  }
}
