import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class PropertyHasActiveBookingsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      'Não é possível excluir a propriedade, pois há reservas ativas associadas a ela.',
    );
  }
}
