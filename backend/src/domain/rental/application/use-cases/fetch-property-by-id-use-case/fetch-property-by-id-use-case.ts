import { Either, left, right } from '../../../../../core/either';
import { Property } from '../../../enterprise/entities/property';
import { PropertyRepository } from '../../repositories/property-repository';
import { Injectable } from '@nestjs/common';
import { PropertyNotFoundError } from '../errors/property-not-found-error';

interface FetchPropertyByIdUseCaseRequest {
  propertyId: string;
}

type FetchPropertyByIdUseCaseResponse = Either<
  PropertyNotFoundError,
  {
    property: Property;
  }
>;

@Injectable()
export class FetchPropertyByIdUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute({
    propertyId,
  }: FetchPropertyByIdUseCaseRequest): Promise<FetchPropertyByIdUseCaseResponse> {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      return left(new PropertyNotFoundError());
    }

    return right({ property });
  }
}
