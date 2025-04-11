import { Customer } from '../../../../domain/rental/enterprise/entities/customer';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { Prisma, Cliente as PrismaCustomer } from '@prisma/client';

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    return Customer.create(
      {
        name: raw.nome,
        email: raw.email,
        cpf: raw.cpf,
        password: raw.senha,
        phone: raw.telefone,
        createdAt: raw.dataCriacao,
        updatedAt: raw.dataAtualizacao,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(customer: Customer): Prisma.ClienteUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      nome: customer.name,
      email: customer.email,
      cpf: customer.cpf,
      senha: customer.password,
      telefone: customer.phone,
      dataCriacao: customer.createdAt,
      dataAtualizacao: customer.updatedAt ?? undefined,
    };
  }
}
