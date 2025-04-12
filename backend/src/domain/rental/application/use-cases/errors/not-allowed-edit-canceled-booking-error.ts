import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class NotAllowedEditCanceledBookingError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Não é possível editar uma reserva que já foi cancelada.');
  }
}
