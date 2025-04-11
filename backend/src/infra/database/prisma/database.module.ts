/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PropertyRepository } from '../../../domain/rental/application/repositories/property-repository';
import { PrismaPropertyRepository } from './repositories/prisma-property-repository';
import { CustomerRepository } from '../../../domain/rental/application/repositories/customer-repository';
import { PrismaCustomerRepository } from './repositories/prisma-customer-repository';
import { BookingRepository } from '../../../domain/rental/application/repositories/booking-repository';
import { PrismaBookingRepository } from './repositories/prisma-booking-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: PropertyRepository,
      useClass: PrismaPropertyRepository,
    },
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
    {
      provide: BookingRepository,
      useClass: PrismaBookingRepository,
    },
  ],
  exports: [
    PrismaService,
    PropertyRepository,
    CustomerRepository,
    BookingRepository,
  ],
})
export class DatabaseModule {}
