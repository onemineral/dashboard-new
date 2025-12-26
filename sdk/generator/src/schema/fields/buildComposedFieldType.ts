import { AnyObject } from '../../types';
import {
    ComposedResourceProperty,
    PropertyOptions,
    ResourceProperty,
} from '../resource';
import { schemaUtils } from '../schema-utils';

export function buildComposedFieldType(
    composed: AnyObject,
    fieldTransformer: (
        f: AnyObject,
        options?: PropertyOptions
    ) => ResourceProperty,
    options?: PropertyOptions
): ComposedResourceProperty {
    const { name, description } = composed;

    let innerFields = composed.fields;

    if (!Array.isArray(innerFields) && typeof innerFields === 'object') {
        innerFields = Object.values(composed.fields);
    }

    const fields = innerFields.map((f: AnyObject) => {
        return fieldTransformer(f, options);
    });

    return {
        kind: 'composed',
        name: schemaUtils.fieldToMemberName(name),
        description,
        type: fields,
        options,
    };
}
