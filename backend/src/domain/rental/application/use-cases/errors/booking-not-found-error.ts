import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class BookingNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Reserva não encontrada.');
  }
}
