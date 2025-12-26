import { AnyObject } from '../../types';
import { PropertyOptions, RelationResourceProperty } from '../resource';
import { schemaUtils } from '../schema-utils';

export function buildSingleRelationshipType(
    field: AnyObject,
    options?: PropertyOptions
): RelationResourceProperty {
    const { name, description, relates_to } = field;
    const relation = schemaUtils.resourceToInterfaceName(relates_to);

    return {
        kind: 'relation',
        relationKind: 'single',
        name: schemaUtils.fieldToMemberName(name),
        description,
        relatedType: relation + (options?.nullable ? ' | null' : ''),
        type: relation,
        options,
    };
}
