import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class BookingTimeOutsideAllowedRangeError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      'O tempo da reserva está fora do intervalo permitido para essa propriedade.',
    );
  }
}
