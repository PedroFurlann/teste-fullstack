import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { z } from 'zod';

import { RegisterCustomerUseCase } from '../../../domain/rental/application/use-cases/register-customer-use-case/register-customer-use-case';
import { FetchCustomerByIdUseCase } from '../../../domain/rental/application/use-cases/fetch-customer-by-id-use-case/fetch-customer-by-id-use-case';
import { EditCustomerUseCase } from '../../../domain/rental/application/use-cases/edit-customer-use-case/edit-customer-use-case';
import { DeleteCustomerUseCase } from '../../../domain/rental/application/use-cases/delete-customer-use-case/delete-customer-use-case';

import { Public } from '../../auth/public';
import { CustomerPresenter } from '../presenters/cutomer-presenter';
import { CurrentUser } from '../../auth/current-user.decorator';
import { UserPayload } from '../../auth/jwt.strategy';

import { CustomerAlreadyExistsError } from '../../../domain/rental/application/use-cases/errors/customer-already-exists-error';
import { CustomerNotFoundError } from '../../../domain/rental/application/use-cases/errors/customer-not-found-error';

import { InvalidDataValidationPipe } from '../pipes/invalid-data-validation.pipe';

const phoneRegex = /^\d{11}$/;
const cpfRegex = /^\d{11}$/;

const registerCustomerBodySchema = z.object({
  name: z.string().min(5, 'O Nome deve ter pelo menos 5 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z
    .string()
    .regex(
      cpfRegex,
      'O CPF deve conter exatamente 11 dígitos numéricos (ex: 49246739459)',
    ),
  phone: z
    .string()
    .regex(
      phoneRegex,
      'O telefone deve conter exatamente 11 dígitos numéricos (ex: 17991145574)',
    ),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const editCustomerBodySchema = z.object({
  name: z.string().min(5, 'O Nome deve ter pelo menos 5 caracteres').optional(),
  phone: z
    .string()
    .regex(
      phoneRegex,
      'O telefone deve conter exatamente 11 dígitos numéricos (ex: 17991145574)',
    )
    .optional(),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .optional(),
});

type RegisterCustomerBody = z.infer<typeof registerCustomerBodySchema>;
type EditCustomerBody = z.infer<typeof editCustomerBodySchema>;

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly registerCustomerUseCase: RegisterCustomerUseCase,
    private readonly fetchCustomerByIdUseCase: FetchCustomerByIdUseCase,
    private readonly editCustomerUseCase: EditCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @Post('/')
  @HttpCode(201)
  @Public()
  async registerCustomer(
    @Body(new InvalidDataValidationPipe(registerCustomerBodySchema))
    body: RegisterCustomerBody,
  ) {
    const result = await this.registerCustomerUseCase.execute({
      name: body.name,
      email: body.email,
      cpf: body.cpf,
      phone: body.phone,
      password: body.password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CustomerAlreadyExistsError:
          throw new ConflictException({
            status: 409,
            message: error.message,
          });
        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    const { customer } = result.value;

    return {
      status: 201,
      customerId: customer.id.toString(),
      message: 'Cliente criado com sucesso!',
    };
  }

  @Get('/')
  async fetchCustomerById(@CurrentUser() user: UserPayload) {
    const customerId = user.sub;

    const result = await this.fetchCustomerByIdUseCase.execute({
      customerId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CustomerNotFoundError:
          throw new NotFoundException({
            status: 404,
            message: error.message,
          });
        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    const { customer } = result.value;

    return {
      customer: CustomerPresenter.toHTTP(customer),
    };
  }

  @Put('/')
  async editCustomer(
    @CurrentUser() user: UserPayload,
    @Body(new InvalidDataValidationPipe(editCustomerBodySchema))
    body: EditCustomerBody,
  ) {
    const customerId = user.sub;

    const result = await this.editCustomerUseCase.execute({
      customerId,
      ...body,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CustomerNotFoundError:
          throw new NotFoundException({
            status: 404,
            message: error.message,
          });
        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    const { customer } = result.value;

    return {
      stataus: 200,
      customerId: customer.id.toString(),
      message: 'Cliente editado com sucesso!',
    };
  }

  @Delete('/')
  @HttpCode(204)
  async deleteCustomer(@CurrentUser() user: UserPayload) {
    const customerId = user.sub;

    const result = await this.deleteCustomerUseCase.execute({
      customerId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CustomerNotFoundError:
          throw new NotFoundException({
            status: 404,
            message: error.message,
          });
        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    return;
  }
}
