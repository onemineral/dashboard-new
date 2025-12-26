import { AnyObject } from '../../types';
import { PropertyOptions, SimpleResourceProperty } from '../resource';
import { schemaUtils } from '../schema-utils';

export function buildTranslatedTextField(
    field: AnyObject,
    options?: PropertyOptions
): SimpleResourceProperty {
    const { name, description } = field;

    return {
        kind: 'simple',
        name: schemaUtils.fieldToMemberName(name),
        description,
        type: 'TranslatedText' + (options?.nullable ? ' | null' : ''),
        options,
    };
}
