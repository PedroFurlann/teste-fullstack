import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class CustomerNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Cliente não encontrado.`);
  }
}
