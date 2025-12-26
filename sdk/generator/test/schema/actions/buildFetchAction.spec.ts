import { readAndParseFixture } from '../../test-utils';
import { buildFetchAction } from '../../../src/schema/actions/buildFetchAction';
import { schemaUtils } from '../../../src/schema/schema-utils';

describe('buildFetchAction', () => {
    const { resource } = readAndParseFixture('resource-with-simple-actions');
    const interfaceName = schemaUtils.resourceToInterfaceName('resource');

    it('builds a fetch action', () => {
        const action = buildFetchAction(interfaceName, resource.actions.fetch);

        expect(action.kind).toEqual('fetch');
        expect(action.name).toEqual('fetch');
        expect(action.responseType).toEqual('Response<Resource>');
        expect(action.args.length).toEqual(2);
    });

    it('contains sort, pagination, and with params', () => {
        const action = buildFetchAction(interfaceName, resource.actions.fetch);

        expect(action.args.map((a) => a.name)).toEqual(['id', 'with']);
    });

    it('parses id param correctly', () => {
        const action = buildFetchAction(interfaceName, resource.actions.fetch);

        expect(action.args[0]).toEqual({
            kind: 'simple',
            name: 'id',
            description: '',
            type: 'number',
        });
    });

    it('parses with param correctly', () => {
        const action = buildFetchAction(interfaceName, resource.actions.fetch);

        expect(action.args[1]).toEqual({
            kind: 'list-of',
            name: 'with',
            description: '',
            itemType: 'string',
            type: 'string[]',
        });
    });
});
