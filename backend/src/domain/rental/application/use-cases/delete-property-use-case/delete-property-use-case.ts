import { Either, left, right } from '../../../../../core/either';
import { PropertyRepository } from '../../repositories/property-repository';
import { PropertyNotFoundError } from '../errors/property-not-found-error';
import { PropertyDoesNotBelongToCustomerError } from '../errors/property-does-not-belong-to-customer-error';

interface DeletePropertyUseCaseRequest {
  propertyId: string;
  customerId: string;
}

type DeletePropertyUseCaseResponse = Either<
  PropertyNotFoundError | PropertyDoesNotBelongToCustomerError,
  null
>;

export class DeletePropertyUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute({
    propertyId,
    customerId,
  }: DeletePropertyUseCaseRequest): Promise<DeletePropertyUseCaseResponse> {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      return left(new PropertyNotFoundError());
    }

    if (property.customerId.toString() !== customerId) {
      return left(new PropertyDoesNotBelongToCustomerError());
    }

    await this.propertyRepository.delete(propertyId);

    return right(null);
  }
}
