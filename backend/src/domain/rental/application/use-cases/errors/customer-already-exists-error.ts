import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class CustomerAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Cliente com o mesmo endereço de email ou cpf já existe.`);
  }
}
