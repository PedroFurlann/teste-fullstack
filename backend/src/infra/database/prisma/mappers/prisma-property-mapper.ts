import { Property } from '../../../../domain/rental/enterprise/entities/property';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { Prisma, Locacao as PrismaProperty } from '@prisma/client';

export class PrismaPropertyMapper {
  static toDomain(raw: PrismaProperty): Property {
    return Property.create(
      {
        customerId: new UniqueEntityID(raw.clienteId),
        name: raw.nome,
        type: raw.tipo,
        description: raw.descricao,
        minTime: raw.tempoMinimo,
        maxTime: raw.tempoMaximo,
        pricePerHour: raw.valorHora,
        createdAt: raw.dataCriacao,
        updatedAt: raw.dataAtualizacao,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(property: Property): Prisma.LocacaoUncheckedCreateInput {
    return {
      id: property.id.toString(),
      clienteId: property.customerId.toString(),
      nome: property.name,
      tipo: property.type,
      descricao: property.description,
      tempoMinimo: property.minTime,
      tempoMaximo: property.maxTime,
      valorHora: property.pricePerHour,
      dataCriacao: property.createdAt,
      dataAtualizacao: property.updatedAt ?? undefined,
    };
  }
}
