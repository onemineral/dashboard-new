import { AnyObject } from '../../types';
import { PropertyOptions, SimpleResourceProperty } from '../resource';
import { schemaUtils } from '../schema-utils';

export function buildBooleanField(
    field: AnyObject,
    options?: PropertyOptions
): SimpleResourceProperty {
    const { name, description } = field;

    return {
        kind: 'simple',
        name: schemaUtils.fieldToMemberName(name),
        description,
        type: 'boolean' + (options?.nullable ? ' | null' : ''),
        options,
    };
}
