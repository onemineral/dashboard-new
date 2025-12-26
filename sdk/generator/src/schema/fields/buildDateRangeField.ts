import { AnyObject } from '../../types';
import { PropertyOptions, SimpleResourceProperty } from '../resource';
import { schemaUtils } from '../schema-utils';

export function buildDateRangeField(
    field: AnyObject,
    options?: PropertyOptions
): SimpleResourceProperty {
    const { name, description } = field;

    return {
        kind: 'simple',
        name: schemaUtils.fieldToMemberName(name),
        description,
        type: 'DateRange' + (options?.nullable ? ' | null' : ''),
        options,
    };
}
