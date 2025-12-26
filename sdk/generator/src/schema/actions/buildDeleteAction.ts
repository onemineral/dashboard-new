import { AnyObject } from '../../types';
import { DeleteResourceAction } from '../resource';
import { parseArgs } from '../parse-args';

export function buildDeleteAction(
    interfaceName: string,
    action: AnyObject
): DeleteResourceAction {
    const { description } = action;
    const args = parseArgs(action.args);

    return {
        kind: 'delete',
        name: 'del',
        description,
        args,
        responseKind: 'Response',
        responseType: `Response<${interfaceName}>`,
    };
}
