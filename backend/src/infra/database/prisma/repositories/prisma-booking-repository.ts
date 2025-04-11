import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BookingRepository } from '../../../../domain/rental/application/repositories/booking-repository';
import { Booking } from '../../../../domain/rental/enterprise/entities/booking';
import { PrismaBookingMapper } from '../mappers/prisma-booking-mapper';

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(booking: Booking): Promise<void> {
    const data = PrismaBookingMapper.toPersistence(booking);

    await this.prismaService.reserva.create({
      data,
    });
  }

  async findById(bookingId: string): Promise<Booking | null> {
    const booking = await this.prismaService.reserva.findUnique({
      where: { id: bookingId },
    });

    if (!booking) return null;

    return PrismaBookingMapper.toDomain(booking);
  }

  async findByCustomerId(customerId: string): Promise<Booking[]> {
    const bookings = await this.prismaService.reserva.findMany({
      where: { clienteId: customerId },
    });

    return bookings.map((booking) => PrismaBookingMapper.toDomain(booking));
  }

  async findByPropertyId(propertyId: string): Promise<Booking[]> {
    const bookings = await this.prismaService.reserva.findMany({
      where: { locacaoId: propertyId },
    });

    return bookings.map((booking) => PrismaBookingMapper.toDomain(booking));
  }

  async update(booking: Booking): Promise<void> {
    const data = PrismaBookingMapper.toPersistence(booking);

    await this.prismaService.reserva.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(bookingId: string): Promise<void> {
    await this.prismaService.reserva.delete({
      where: { id: bookingId },
    });
  }

  async cancel(bookingId: string): Promise<void> {
    await this.prismaService.reserva.update({
      where: { id: bookingId },
      data: { situacao: 'canceled' },
    });
  }

  async findWithPropertyNameByCustomerId(customerId: string): Promise<
    {
      booking: Booking;
      propertyName: string;
    }[]
  > {
    const bookings = await this.prismaService.reserva.findMany({
      where: { clienteId: customerId },
      include: {
        locacao: true,
      },
    });

    return bookings.map((booking) => ({
      booking: PrismaBookingMapper.toDomain(booking),
      propertyName: booking.locacao.nome,
    }));
  }
}
