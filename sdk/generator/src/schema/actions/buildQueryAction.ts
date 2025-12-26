import { QueryResourceAction } from '../resource';
import { AnyObject } from '../../types';
import { parseArgs } from '../parse-args';

export function buildQueryAction(
    interfaceName: string,
    action: AnyObject
): QueryResourceAction {
    const { name, description } = action;
    const args = parseArgs(action.args);

    return {
        kind: 'query',
        name,
        description,
        args: args,
        responseKind: 'PaginatedResponse',
        responseType: `PaginatedResponse<${interfaceName}>`,
    };
}
