import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  Put,
} from '@nestjs/common';
import { z } from 'zod';

import { CreateBookingUseCase } from '../../../domain/rental/application/use-cases/create-booking-use-case/create-booking-use-case';
import { EditBookingUseCase } from '../../../domain/rental/application/use-cases/edit-booking-use-case/edit-booking-use-case';
import { CancelBookingUseCase } from '../../../domain/rental/application/use-cases/cancel-booking-use-case/cancel-booking-use-case';
import { DeleteBookingUseCase } from '../../../domain/rental/application/use-cases/delete-booking-use-case/delete-booking-use-case';
import { FetchBookingWithPropertyDetailsUseCase } from '../../../domain/rental/application/use-cases/fetch-booking-with-property-details-use-case/fetch-booking-with-property-details-use-case';
import { FetchCustomerBookingsWithPropertyNameUseCase } from '../../../domain/rental/application/use-cases/fetch-customer-bookings-with-property-name-use-case/fetch-customer-bookings-with-property-name-use-case';

import { InvalidDataValidationPipe } from '../../../infra/http/pipes/invalid-data-validation.pipe';
import { CurrentUser } from '../../auth/current-user.decorator';
import { UserPayload } from '../../auth/jwt.strategy';

import { BookingDateConflictError } from '../../../domain/rental/application/use-cases/errors/booking-date-conflict-error';
import { BookingDoesNotBelongToCustomerError } from '../../../domain/rental/application/use-cases/errors/booking-does-not-belong-to-customer-error';
import { BookingNotFoundError } from '../../../domain/rental/application/use-cases/errors/booking-not-found-error';
import { BookingTimeOutsideAllowedRangeError } from '../../../domain/rental/application/use-cases/errors/booking-time-outside-allowed-range-error';
import { PropertyNotFoundError } from '../../../domain/rental/application/use-cases/errors/property-not-found-error';
import { BookingWithPropertyDetailsPresenter } from '../presenters/booking-with-property-details-presenter';
import { CustomerBookingsWithPropertyNamePresenter } from '../presenters/customer-bookings-with-property-name-presenter';
import { InvalidDateError } from '../../../domain/rental/application/use-cases/errors/invalid-date-error';
import { NotAllowedEditCanceledBookingError } from '../../../domain/rental/application/use-cases/errors/not-allowed-edit-canceled-booking-error';
import { BookingAlreadyCanceledError } from '../../../domain/rental/application/use-cases/errors/booking-already-canceled-error';
import { DateCannotBeRetroactiveError } from 'src/domain/rental/application/use-cases/errors/date-cannot-be-retroactive-error';

const now = new Date();

const createBookingBodySchema = z
  .object({
    propertyId: z.string().uuid('ID da propriedade inválido'),
    startDate: z.coerce
      .date()
      .min(now, 'A data inicial não pode ser retroativa.'),
    endDate: z.coerce.date().min(now, 'A data final não pode ser retroativa.'),
  })
  .refine(
    (data) => {
      return data.startDate < data.endDate;
    },
    {
      message: 'A data de início deve ser menor que a data de término',
    },
  );

const editBookingBodySchema = z.object({
  startDate: z.coerce
    .date()
    .min(now, 'A data inicial não pode ser retroativa.')
    .optional(),
  endDate: z.coerce
    .date()
    .min(now, 'A data final não pode ser retroativa.')
    .optional(),
});

type CreateBookingBody = z.infer<typeof createBookingBodySchema>;
type EditBookingBody = z.infer<typeof editBookingBodySchema>;

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly editBookingUseCase: EditBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
    private readonly deleteBookingUseCase: DeleteBookingUseCase,
    private readonly fetchBookingWithPropertyDetailsUseCase: FetchBookingWithPropertyDetailsUseCase,
    private readonly fetchCustomerBookingsWithPropertyNameUseCase: FetchCustomerBookingsWithPropertyNameUseCase,
  ) {}

  @Post('/')
  @HttpCode(201)
  async createBooking(
    @CurrentUser() user: UserPayload,
    @Body(new InvalidDataValidationPipe(createBookingBodySchema))
    body: CreateBookingBody,
  ) {
    const customerId = user.sub;

    const result = await this.createBookingUseCase.execute({
      customerId,
      propertyId: body.propertyId,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PropertyNotFoundError:
          throw new NotFoundException({ status: 404, message: error.message });
        case InvalidDateError:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
        case BookingDateConflictError:
          throw new ConflictException({ status: 409, message: error.message });
        case BookingTimeOutsideAllowedRangeError:
        case DateCannotBeRetroactiveError:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    const { booking } = result.value;

    return {
      status: 201,
      bookingId: booking.id.toString(),
      message: 'Reserva criada com sucesso!',
    };
  }

  @Put('/:id')
  async editBooking(
    @Param('id') bookingId: string,
    @CurrentUser() user: UserPayload,
    @Body(new InvalidDataValidationPipe(editBookingBodySchema))
    body: EditBookingBody,
  ) {
    const customerId = user.sub;

    const result = await this.editBookingUseCase.execute({
      bookingId,
      customerId,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case BookingNotFoundError:
        case PropertyNotFoundError:
          throw new NotFoundException({ status: 404, message: error.message });
        case BookingDoesNotBelongToCustomerError:
        case NotAllowedEditCanceledBookingError:
          throw new ForbiddenException({ status: 403, message: error.message });
        case BookingDateConflictError:
        case InvalidDateError:
        case DateCannotBeRetroactiveError:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
        case BookingTimeOutsideAllowedRangeError:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    const { booking } = result.value;

    return {
      status: 200,
      bookingId: booking.id.toString(),
      message: 'Reserva editada com sucesso!',
    };
  }

  @Patch('/:id/cancel')
  async cancelBooking(
    @Param('id') bookingId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const customerId = user.sub;

    const result = await this.cancelBookingUseCase.execute({
      customerId,
      bookingId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case BookingNotFoundError:
          throw new NotFoundException({ status: 404, message: error.message });
        case BookingDoesNotBelongToCustomerError:
        case BookingAlreadyCanceledError:
          throw new ForbiddenException({ status: 403, message: error.message });
        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    return {
      status: 200,
      message: 'Reserva cancelada com sucesso!',
    };
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteBooking(
    @Param('id') bookingId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const customerId = user.sub;

    const result = await this.deleteBookingUseCase.execute({
      customerId,
      bookingId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case BookingNotFoundError:
          throw new NotFoundException({ status: 404, message: error.message });
        case BookingDoesNotBelongToCustomerError:
          throw new ForbiddenException({ status: 403, message: error.message });
        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    return;
  }

  @Get('/customer')
  async fetchCustomerBookingsWithPropertyName(
    @CurrentUser() user: UserPayload,
  ) {
    const customerId = user.sub;

    const result =
      await this.fetchCustomerBookingsWithPropertyNameUseCase.execute({
        customerId,
      });

    return CustomerBookingsWithPropertyNamePresenter.toHTTP(result.value);
  }

  @Get('/:id')
  async fetchBookingWithPropertyDetails(@Param('id') bookingId: string) {
    const result = await this.fetchBookingWithPropertyDetailsUseCase.execute({
      bookingId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case BookingNotFoundError:
        case PropertyNotFoundError:
          throw new NotFoundException({ status: 404, message: error.message });
        default:
          throw new BadRequestException({
            status: 400,
            message: error.message,
          });
      }
    }

    return {
      bookingWithPropertyDetails: BookingWithPropertyDetailsPresenter.toHTTP(
        result.value,
      ),
    };
  }
}
