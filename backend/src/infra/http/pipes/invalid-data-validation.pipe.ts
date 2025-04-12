import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class InvalidDataValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          error_description:
            error.errors[0].message ||
            'Os dados fornecidos para a requisição são inválidos',
        });
      }

      throw new BadRequestException({
        error_description: 'A validação falhou devido a um erro desconhecido',
      });
    }
  }
}
