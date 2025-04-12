import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  HttpCode,
  Query,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Param,
} from '@nestjs/common';
import { z } from 'zod';

import { CreatePropertyUseCase } from '../../../domain/rental/application/use-cases/create-property-use-case/create-property-use-case';
import { DeletePropertyUseCase } from '../../../domain/rental/application/use-cases/delete-property-use-case/delete-property-use-case';
import { FetchAvailablePropertiesUseCase } from '../../../domain/rental/application/use-cases/fetch-available-properties-use-case/fetch-available-properties-use-case';
import { FetchCustomerPropertiesUseCase } from '../../../domain/rental/application/use-cases/fetch-customer-properties-use-case/fetch-customer-properties-use-case';
import { FetchPropertyByIdUseCase } from '../../../domain/rental/application/use-cases/fetch-property-by-id-use-case/fetch-property-by-id-use-case';
import { EditPropertyUseCase } from '../../../domain/rental/application/use-cases/edit-property-use-case/edit-property-use-case';

import { PropertyPresenter } from '../presenters/property-presenter';
import { CurrentUser } from '../../auth/current-user.decorator';
import { UserPayload } from '../../auth/jwt.strategy';

import { PropertyNotFoundError } from '../../../domain/rental/application/use-cases/errors/property-not-found-error';
import { PropertyDoesNotBelongToCustomerError } from '../../../domain/rental/application/use-cases/errors/property-does-not-belong-to-customer-error';
import { PropertyHasActiveBookingsError } from '../../../domain/rental/application/use-cases/errors/property-has-active-bookings-error';

import { InvalidDataValidationPipe } from '../pipes/invalid-data-validation.pipe';

const createPropertyBodySchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  minTime: z.number(),
  maxTime: z.number(),
  pricePerHour: z.number(),
});

const editPropertyBodySchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  minTime: z.number().optional(),
  maxTime: z.number().optional(),
  pricePerHour: z.number().optional(),
});

const fetchAvailableQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

type CreatePropertyBody = z.infer<typeof createPropertyBodySchema>;
type EditPropertyBody = z.infer<typeof editPropertyBodySchema>;
type FetchAvailableQuery = z.infer<typeof fetchAvailableQuerySchema>;

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly deletePropertyUseCase: DeletePropertyUseCase,
    private readonly editPropertyUseCase: EditPropertyUseCase,
    private readonly fetchAvailablePropertiesUseCase: FetchAvailablePropertiesUseCase,
    private readonly fetchCustomerPropertiesUseCase: FetchCustomerPropertiesUseCase,
    private readonly fetchPropertyByIdUseCase: FetchPropertyByIdUseCase,
  ) {}

  @Post('/')
  @HttpCode(201)
  async createProperty(
    @CurrentUser() user: UserPayload,
    @Body(new InvalidDataValidationPipe(createPropertyBodySchema))
    body: CreatePropertyBody,
  ) {
    const customerId = user.sub;

    const result = await this.createPropertyUseCase.execute({
      customerId,
      name: body.name,
      type: body.type,
      description: body.description,
      minTime: body.minTime,
      maxTime: body.maxTime,
      pricePerHour: body.pricePerHour,
    });

    const { property } = result.value;

    return {
      status: 201,
      propertyId: property.id.toString(),
      message: 'Propriedade criada com sucesso!',
    };
  }

  @Get('/')
  async fetchCustomerProperties(@CurrentUser() user: UserPayload) {
    const customerId = user.sub;

    const result = await this.fetchCustomerPropertiesUseCase.execute({
      customerId,
    });

    const { properties } = result.value;

    return {
      properties: properties.map((property) =>
        PropertyPresenter.toHTTP(property),
      ),
    };
  }

  @Get('/available')
  async fetchAvailableProperties(
    @Query(new InvalidDataValidationPipe(fetchAvailableQuerySchema))
    query: FetchAvailableQuery,
  ) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException({
        status: 400,
        message: 'Formato de data inválido',
      });
    }

    const result = await this.fetchAvailablePropertiesUseCase.execute({
      startDate,
      endDate,
    });

    const { properties } = result.value;

    return {
      properties: properties.map((property) =>
        PropertyPresenter.toHTTP(property),
      ),
    };
  }

  @Get('/:id')
  async fetchPropertyById(@Param('id') id: string) {
    const result = await this.fetchPropertyByIdUseCase.execute({
      propertyId: id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PropertyNotFoundError:
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

    const { property } = result.value;

    return {
      property: PropertyPresenter.toHTTP(property),
    };
  }

  @Put('/:id')
  async editProperty(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body(new InvalidDataValidationPipe(editPropertyBodySchema))
    body: EditPropertyBody,
  ) {
    const customerId = user.sub;

    const result = await this.editPropertyUseCase.execute({
      customerId,
      propertyId: id,
      name: body.name,
      type: body.type,
      description: body.description,
      minTime: body.minTime,
      maxTime: body.maxTime,
      pricePerHour: body.pricePerHour,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PropertyNotFoundError:
          throw new NotFoundException({
            status: 404,
            message: error.message,
          });
        case PropertyDoesNotBelongToCustomerError:
          throw new ForbiddenException({
            status: 403,
            message: error.message,
          });
        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    const { property } = result.value;

    return {
      status: 200,
      propertyId: property.id.toString(),
      message: 'Propriedade editada com sucesso!',
    };
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteProperty(
    @CurrentUser() user: UserPayload,
    @Query('id') id: string,
  ) {
    const customerId = user.sub;

    const result = await this.deletePropertyUseCase.execute({
      propertyId: id,
      customerId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PropertyNotFoundError:
          throw new NotFoundException({
            status: 404,
            message: error.message,
          });
        case PropertyDoesNotBelongToCustomerError:
          throw new ForbiddenException({
            status: 403,
            message: error.message,
          });
        case PropertyHasActiveBookingsError:
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

    return { status: 204, message: 'Propriedade deletada com sucesso!' };
  }
}
