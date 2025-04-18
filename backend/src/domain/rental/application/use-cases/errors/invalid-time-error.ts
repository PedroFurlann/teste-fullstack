import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class InvalidTimeError extends Error implements UseCaseError {
  constructor() {
    super('O tempo mínimo deve ser menor ou igual ao tempo máximo.');
  }
}
