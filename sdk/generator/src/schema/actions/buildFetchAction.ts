import { FetchResourceAction } from '../resource';
import { AnyObject } from '../../types';
import { parseArgs } from '../parse-args';

export function buildFetchAction(
    interfaceName: string,
    action: AnyObject
): FetchResourceAction {
    const { name, description } = action;
    const args = parseArgs(action.args);

    return {
        kind: 'fetch',
        name,
        description,
        args: args,
        responseKind: 'Response',
        responseType: `Response<${interfaceName}>`,
    };
}
