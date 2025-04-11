import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CustomerRepository } from '../../../../domain/rental/application/repositories/customer-repository';
import { Customer } from '../../../../domain/rental/enterprise/entities/customer';
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPersistence(customer);

    await this.prismaService.cliente.create({
      data,
    });
  }

  async findByEmailOrCpf(params: {
    email?: string;
    cpf?: string;
  }): Promise<Customer | null> {
    const { email, cpf } = params;

    const customer = await this.prismaService.cliente.findFirst({
      where: {
        OR: [email ? { email } : undefined, cpf ? { cpf } : undefined].filter(
          Boolean,
        ),
      },
    });

    if (!customer) return null;

    return PrismaCustomerMapper.toDomain(customer);
  }

  async findById(customerId: string): Promise<Customer | null> {
    const customer = await this.prismaService.cliente.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) return null;

    return PrismaCustomerMapper.toDomain(customer);
  }

  async update(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPersistence(customer);

    await this.prismaService.cliente.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(customerId: string): Promise<void> {
    await this.prismaService.cliente.delete({
      where: {
        id: customerId,
      },
    });
  }
}
