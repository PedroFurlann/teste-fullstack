import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class BookingDateConflictError extends Error implements UseCaseError {
  constructor() {
    super('Já existe uma reserva nessa propriedade confirmada nesse período.');
  }
}
