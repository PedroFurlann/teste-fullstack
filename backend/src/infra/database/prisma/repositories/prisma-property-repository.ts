import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PropertyRepository } from '../../../../domain/rental/application/repositories/property-repository';
import { Property } from '../../../../domain/rental/enterprise/entities/property';
import { PrismaPropertyMapper } from '../mappers/prisma-property-mapper';

@Injectable()
export class PrismaPropertyRepository implements PropertyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(property: Property): Promise<void> {
    const data = PrismaPropertyMapper.toPersistence(property);

    await this.prismaService.locacao.create({
      data,
    });
  }

  async findAllAvailable(startDate: Date, endDate: Date): Promise<Property[]> {
    const properties = await this.prismaService.locacao.findMany({
      where: {
        Reserva: {
          every: {
            OR: [
              {
                dataFim: { lt: startDate },
              },
              {
                dataInicio: { gt: endDate },
              },
              {
                situacao: { not: 'confirmed' },
              },
            ],
          },
        },
      },
    });

    return properties.map((property) =>
      PrismaPropertyMapper.toDomain(property),
    );
  }

  async findById(propertyId: string): Promise<Property | null> {
    const property = await this.prismaService.locacao.findUnique({
      where: { id: propertyId },
    });

    if (!property) return null;

    return PrismaPropertyMapper.toDomain(property);
  }

  async findByCustomerId(customerId: string): Promise<Property[]> {
    const properties = await this.prismaService.locacao.findMany({
      where: { clienteId: customerId },
    });

    return properties.map((property) =>
      PrismaPropertyMapper.toDomain(property),
    );
  }

  async update(property: Property): Promise<void> {
    const data = PrismaPropertyMapper.toPersistence(property);

    await this.prismaService.locacao.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(propertyId: string): Promise<void> {
    await this.prismaService.locacao.delete({
      where: { id: propertyId },
    });
  }
}
