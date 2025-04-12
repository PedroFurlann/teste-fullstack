import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class InvalidDateError extends Error implements UseCaseError {
  constructor() {
    super('A data de início deve ser anterior à data de término.');
  }
}
