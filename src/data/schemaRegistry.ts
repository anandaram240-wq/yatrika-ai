/**
 * @file src/data/schemaRegistry.ts
 * @description Canonical schema specifications and schema versioning for YatriKa AI V4 data fabric.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface SchemaDefinition {
  schemaName: string;
  version: string;
  requiredFields: string[];
  fieldTypes: Record<string, string>;
}

export const SCHEMA_REGISTRY: Record<string, SchemaDefinition> = {
  'canonical-poi': {
    schemaName: 'canonical-poi',
    version: '2.1.0',
    requiredFields: [
      'id',
      'canonicalName',
      'canonicalNameKannada',
      'category',
      'district',
      'macroRegion',
      'coordinates',
      'licenseId',
    ],
    fieldTypes: {
      id: 'string',
      canonicalName: 'string',
      canonicalNameKannada: 'string',
      category: 'string',
      district: 'string',
      macroRegion: 'string',
      coordinates: 'array',
      licenseId: 'string',
    },
  },
  'road-segment': {
    schemaName: 'road-segment',
    version: '1.2.0',
    requiredFields: ['segmentId', 'highwayCode', 'startCoordinates', 'endCoordinates', 'lengthKm', 'isGhat'],
    fieldTypes: {
      segmentId: 'string',
      highwayCode: 'string',
      startCoordinates: 'array',
      endCoordinates: 'array',
      lengthKm: 'number',
      isGhat: 'boolean',
    },
  },
  'transit-schedule': {
    schemaName: 'transit-schedule',
    version: '1.1.0',
    requiredFields: ['transitId', 'agency', 'originStation', 'destinationStation', 'serviceType'],
    fieldTypes: {
      transitId: 'string',
      agency: 'string',
      originStation: 'string',
      destinationStation: 'string',
      serviceType: 'string',
    },
  },
};

export class SchemaValidator {
  public static validate(data: Record<string, unknown>, schemaName: string): { isValid: boolean; missingFields: string[]; typeMismatches: string[] } {
    const schema = SCHEMA_REGISTRY[schemaName];
    if (!schema) {
      throw new Error(`Unknown schema definition: ${schemaName}`);
    }

    const missingFields: string[] = [];
    const typeMismatches: string[] = [];

    schema.requiredFields.forEach((field) => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        missingFields.push(field);
      }
    });

    Object.entries(schema.fieldTypes).forEach(([field, expectedType]) => {
      const val = data[field];
      if (val !== undefined && val !== null) {
        if (expectedType === 'array' && !Array.isArray(val)) {
          typeMismatches.push(`${field}: expected array`);
        } else if (expectedType !== 'array' && typeof val !== expectedType) {
          typeMismatches.push(`${field}: expected ${expectedType}, got ${typeof val}`);
        }
      }
    });

    return {
      isValid: missingFields.length === 0 && typeMismatches.length === 0,
      missingFields,
      typeMismatches,
    };
  }
}
