import { AnyObject } from '../../types';
import { UpdateResourceAction } from '../resource';
import { parseArgs } from '../parse-args';

export function buildUpdateAction(
    interfaceName: string,
    action: AnyObject
): UpdateResourceAction {
    const { name, description } = action;
    const args = parseArgs(action.args);

    return {
        kind: 'update',
        name,
        description,
        args,
        responseKind: 'Response',
        responseType: `Response<${interfaceName}>`,
    };
}
