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

const registerCustomerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string().min(11).max(14),
  phone: z.string(),
  password: z.string().min(6),
});

const editCustomerBodySchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
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
      customer: CustomerPresenter.toHTTP(customer),
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
      customer: CustomerPresenter.toHTTP(customer),
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
