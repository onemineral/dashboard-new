import { AnyObject } from '../../types';
import { PropertyOptions, RelationResourceProperty } from '../resource';
import { schemaUtils } from '../schema-utils';

export function buildMultipleRelationshipType(
    field: AnyObject,
    options?: PropertyOptions
): RelationResourceProperty {
    const { name, description, relates_to } = field;
    const relation = schemaUtils.resourceToInterfaceName(relates_to);

    return {
        kind: 'relation',
        relationKind: 'many',
        name: schemaUtils.fieldToMemberName(name),
        relatedType: relation,
        description,
        type: `${relation}[]` + (options?.nullable ? ' | null' : ''),
        options,
    };
}
