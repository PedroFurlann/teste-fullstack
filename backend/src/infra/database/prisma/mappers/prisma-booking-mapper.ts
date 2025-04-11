import { Prisma, Reserva as PrismaBooking } from '@prisma/client';
import { Booking } from '../../../../domain/rental/enterprise/entities/booking';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export class PrismaBookingMapper {
  static toDomain(raw: PrismaBooking): Booking {
    return Booking.create(
      {
        customerId: new UniqueEntityID(raw.clienteId),
        propertyId: new UniqueEntityID(raw.locacaoId),
        startDate: raw.dataInicio,
        endDate: raw.dataFim,
        finalPrice: raw.valorFinal,
        status: raw.situacao,
        createdAt: raw.dataCriacao,
        updatedAt: raw.dataAtualizacao,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(booking: Booking): Prisma.ReservaUncheckedCreateInput {
    return {
      id: booking.id.toString(),
      clienteId: booking.customerId.toString(),
      locacaoId: booking.propertyId.toString(),
      dataInicio: booking.startDate,
      dataFim: booking.endDate,
      valorFinal: booking.finalPrice,
      situacao: booking.status,
      dataCriacao: booking.createdAt,
      dataAtualizacao: booking.updatedAt ?? undefined,
    };
  }
}
