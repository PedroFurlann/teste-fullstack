import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class PropertyDoesNotBelongToCustomerError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      'Você não tem permissão de realizar qualquer ação sobre essa propriedade.',
    );
  }
}
