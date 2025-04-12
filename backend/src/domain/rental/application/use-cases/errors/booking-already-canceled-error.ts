import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class BookingAlreadyCanceledError extends Error implements UseCaseError {
  constructor() {
    super('Esta reserva já está cancelada.');
  }
}
