import { AnyObject } from '../types';
import { ResourceProperty } from './resource';
import { parseField } from './parse-fields';

export function parseArgs(fields: AnyObject): ResourceProperty[] {
    return Object.values(fields).map((f) => {
        let parsed = parseField(f);

        if (parsed.kind === 'relation') {
            parsed = {
                ...parsed,
                type:
                    (parsed.relationKind === 'single' ? 'number' : 'number[]') +
                    (f.is_nullable ? ' | null' : ''),
            };
        }

        return parsed;
    });
}
