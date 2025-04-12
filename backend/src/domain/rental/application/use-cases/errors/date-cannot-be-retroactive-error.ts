import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class DateCannotBeRetroactiveError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('As datas da reserva não podem ser retroativas.');
  }
}
