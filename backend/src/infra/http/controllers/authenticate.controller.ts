import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticateCustomerUseCase } from '../../../domain/rental/application/use-cases/authenticate-customer-use-case/authenticate-customer-use-case';
import { Public } from '../../auth/public';
import { WrongCredentialsError } from '../../../domain/rental/application/use-cases/errors/wrong-credentials-error';
import { InvalidDataValidationPipe } from '../pipes/invalid-data-validation.pipe';
import { z } from 'zod';

const authenticateCustomerBodySchema = z.object({
  type: z.enum(['email', 'cpf']),
  identifier: z.string().min(1),
  password: z.string().min(1),
});

type AuthenticateCustomerBodyType = z.infer<
  typeof authenticateCustomerBodySchema
>;

@Controller('/auth')
@Public()
export class AuthenticateCustomerController {
  constructor(
    private readonly authenticateCustomerUseCase: AuthenticateCustomerUseCase,
  ) {}

  @Post('/customer')
  @HttpCode(200)
  async authenticateCustomer(
    @Body(new InvalidDataValidationPipe(authenticateCustomerBodySchema))
    body: AuthenticateCustomerBodyType,
  ) {
    const { type, identifier, password } = body;

    const result = await this.authenticateCustomerUseCase.execute({
      type,
      identifier,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException({
            status: 401,
            message: error.message,
          });

        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
