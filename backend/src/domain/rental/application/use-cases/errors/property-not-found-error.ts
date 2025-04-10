import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class PropertyNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Propriedade não encontrada.');
  }
}
