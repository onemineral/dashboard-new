import * as fs from 'fs';
import { Resource, ResourceAction } from './resource';
import { schemaUtils } from './schema-utils';
import { parseFields } from './parse-fields';
import { parseActions } from './parse-actions';

export interface Schema {
    [resource: string]: Resource;
}

export function parseSchema(path: string): Schema {
    let contents = JSON.parse(fs.readFileSync(path).toString('utf-8'));

    if ('schema' in contents) {
        contents = contents.schema;
    }

    const transformed: Schema = {};
    Object.keys(contents).forEach((resourceName: string) => {
        const resource = contents[resourceName];
        const interfaceName = schemaUtils.resourceToInterfaceName(resourceName);

        const properties = parseFields(resource.fields);

        let actions: ResourceAction[] = [];
        if (resource.actions) {
            actions = parseActions(interfaceName, resource.actions);
        }

        transformed[resourceName] = {
            name: resourceName,
            interfaceName,
            properties,
            actions,
        };
    });

    return transformed;
}
