import { parseSchema } from '../../src/schema';
import * as path from 'path';

const simpleFieldsResource = path.resolve(
    __dirname,
    '../fixtures/resource-with-simple-fields.json'
);

describe('schema', () => {
    describe('parseSchema', () => {
        it('transforms resource name', () => {
            const { resource } = parseSchema(simpleFieldsResource);
            expect(resource.interfaceName).toEqual('Resource');
        });
    });
});
