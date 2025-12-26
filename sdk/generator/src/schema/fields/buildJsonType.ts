import { AnyObject } from '../../types';
import { JsonResourceProperty, PropertyOptions } from '../resource';
import { schemaUtils } from '../schema-utils';

export function buildJsonFieldType(
    field: AnyObject,
    options?: PropertyOptions
): JsonResourceProperty {
    const { name, description } = field;

    return {
        kind: 'json',
        name: schemaUtils.fieldToMemberName(name),
        description,
        type: 'any',
        options,
    };
}
