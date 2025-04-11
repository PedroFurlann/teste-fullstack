import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/prisma/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateCustomerUseCase } from '../../domain/rental/application/use-cases/authenticate-customer-use-case/authenticate-customer-use-case';
import { CancelBookingUseCase } from '../../domain/rental/application/use-cases/cancel-booking-use-case/cancel-booking-use-case';
import { CreateBookingUseCase } from '../../domain/rental/application/use-cases/create-booking-use-case/create-booking-use-case';
import { CreatePropertyUseCase } from '../../domain/rental/application/use-cases/create-property-use-case/create-property-use-case';
import { DeleteBookingUseCase } from '../../domain/rental/application/use-cases/delete-booking-use-case/delete-booking-use-case';
import { DeleteCustomerUseCase } from '../../domain/rental/application/use-cases/delete-customer-use-case/delete-customer-use-case';
import { DeletePropertyUseCase } from '../../domain/rental/application/use-cases/delete-property-use-case/delete-property-use-case';
import { EditBookingUseCase } from '../../domain/rental/application/use-cases/edit-booking-use-case/edit-booking-use-case';
import { EditCustomerUseCase } from '../../domain/rental/application/use-cases/edit-customer-use-case/edit-customer-use-case';
import { EditPropertyUseCase } from '../../domain/rental/application/use-cases/edit-property-use-case/edit-property-use-case';
import { FetchAvailablePropertiesUseCase } from '../../domain/rental/application/use-cases/fetch-available-properties-use-case/fetch-available-properties-use-case';
import { FetchBookingWithPropertyDetailsUseCase } from '../../domain/rental/application/use-cases/fetch-booking-with-property-details-use-case/fetch-booking-with-property-details-use-case';
import { FetchCustomerBookingsWithPropertyNameUseCase } from '../../domain/rental/application/use-cases/fetch-customer-bookings-with-property-name-use-case/fetch-customer-bookings-with-property-name-use-case';
import { FetchCustomerByIdUseCase } from '../../domain/rental/application/use-cases/fetch-customer-by-id-use-case/fetch-customer-by-id-use-case';
import { FetchCustomerPropertiesUseCase } from '../../domain/rental/application/use-cases/fetch-customer-properties-use-case/fetch-customer-properties-use-case';
import { FetchPropertyByIdUseCase } from '../../domain/rental/application/use-cases/fetch-property-by-id-use-case/fetch-property-by-id-use-case';
import { RegisterCustomerUseCase } from '../../domain/rental/application/use-cases/register-customer-use-case/register-customer-use-case';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [],
  providers: [
    AuthenticateCustomerUseCase,
    CancelBookingUseCase,
    CreateBookingUseCase,
    CreatePropertyUseCase,
    DeleteBookingUseCase,
    DeleteCustomerUseCase,
    DeletePropertyUseCase,
    EditBookingUseCase,
    EditCustomerUseCase,
    EditPropertyUseCase,
    FetchAvailablePropertiesUseCase,
    FetchBookingWithPropertyDetailsUseCase,
    FetchCustomerBookingsWithPropertyNameUseCase,
    FetchCustomerByIdUseCase,
    FetchCustomerPropertiesUseCase,
    FetchPropertyByIdUseCase,
    RegisterCustomerUseCase,
  ],
})
export class HttpModule {}
