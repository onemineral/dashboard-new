import { AnyObject } from '../../types';
import { CreateResourceAction, ResourceProperty } from '../resource';
import { parseArgs } from '../parse-args';

export function buildCreateAction(
    interfaceName: string,
    action: AnyObject
): CreateResourceAction {
    const { name, description } = action;
    const args = parseArgs(action.args);

    return {
        kind: 'create',
        name,
        description,
        args,
        responseKind: 'Response',
        responseType: `Response<${interfaceName}>`,
    };
}
