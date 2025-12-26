import { AnyObject } from '../../types';
import {
    ListOfResourceProperty,
    MorphToResourceProperty,
    PropertyOptions,
    ResourceProperty,
} from '../resource';
import { schemaUtils } from '../schema-utils';

export function buildListOfType(
    field: AnyObject,
    fieldTransformer: (
        f: AnyObject,
        options?: PropertyOptions
    ) => ResourceProperty,
    opts?: PropertyOptions
): ListOfResourceProperty {
    const { name, options } = field;

    const { field: innerField } = options;

    const innerType = fieldTransformer(innerField, opts);
    const { description } = innerType;
    let type:
        | string
        | string[]
        | ResourceProperty[]
        | MorphToResourceProperty
        | ListOfResourceProperty = innerType.type;

    if (innerType.kind === 'relation') {
        type = innerType.relatedType;
    } else if (innerType.kind === 'list-of' || innerType.kind === 'morph-to') {
        type = innerType;
    }

    return {
        kind: 'list-of',
        name: schemaUtils.fieldToMemberName(name),
        itemType: type,
        description,
        type: `${type}[]` + (options?.nullable ? ' | null' : ''),
        options: opts,
    };
}
