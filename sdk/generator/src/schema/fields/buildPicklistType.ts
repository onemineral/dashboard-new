import { AnyObject } from '../../types';
import { PicklistResourceProperty, PropertyOptions } from '../resource';
import { isObject } from '../../utils';
import { schemaUtils } from '../schema-utils';

export function buildPicklistType(
    field: AnyObject,
    options?: PropertyOptions
): PicklistResourceProperty {
    let { name, description, possible_values, multivalue } = field;

    if (isObject(possible_values)) {
        possible_values = Object.keys(possible_values);
    }

    let joined = possible_values.map((p: string) => `"${p}"`).join(' | ');
    if (!joined) {
        joined = 'string' + (options?.nullable ? ' | null' : '');
    }

    if (multivalue) {
        joined = `Array<${joined}>`;
    }

    return {
        kind: 'picklist',
        name: schemaUtils.fieldToMemberName(name),
        description,
        type: joined,
        options,
    };
}
