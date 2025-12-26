import { AnyObject } from '../../types';
import { MorphToResourceProperty, PropertyOptions } from '../resource';
import { schemaUtils } from '../schema-utils';

export function buildMorphToType(
    field: AnyObject,
    options?: PropertyOptions
): MorphToResourceProperty {
    const { name, description, relates_to } = field;
    const relatedTypes = relates_to.map((r: string) =>
        schemaUtils.resourceToInterfaceName(r)
    );

    return {
        kind: 'morph-to',
        name: schemaUtils.fieldToMemberName(name),
        description,
        relatedTypes,
        type: {
            type:
                relates_to
                    .map((r: string) => {
                        return `'${r}'`;
                    })
                    .join(' | ') + (options?.nullable ? ' | null' : ''),
            record:
                relatedTypes.join(' | ') + (options?.nullable ? ' | null' : ''),
        },
        options,
    };
}
