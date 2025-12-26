import { AnyObject } from '../../types';
import { CustomResourceAction } from '../resource';
import { parseArgs } from '../parse-args';

export function buildCustomAction(
    interfaceName: string,
    action: AnyObject
): CustomResourceAction {
    const { name, description } = action;
    const args = parseArgs(action.args);

    const isPaginated = args.find((a) => a.name === 'paginate') !== undefined;

    return {
        kind: 'custom',
        name,
        description,
        args,
        responseKind: isPaginated ? 'PaginatedResponse' : 'Response',
        responseType: isPaginated ? 'PaginatedResponse<any>' : 'Response<any>',
    };
}
