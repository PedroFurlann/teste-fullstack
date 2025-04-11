import { Property } from '../../../domain/rental/enterprise/entities/property';

export class PropertyPresenter {
  static toHTTP(property: Property) {
    return {
      id: property.id.toString(),
      name: property.name,
      type: property.type,
      description: property.description,
      minTime: property.minTime,
      maxTime: property.maxTime,
      pricePerHour: property.pricePerHour,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }
}
