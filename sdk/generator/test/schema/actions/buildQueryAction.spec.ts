import { readAndParseFixture } from '../../test-utils';
import { buildQueryAction } from '../../../src/schema/actions/buildQueryAction';
import { schemaUtils } from '../../../src/schema/schema-utils';

describe('buildQueryAction', () => {
    const { resource } = readAndParseFixture('resource-with-simple-actions');
    const interfaceName = schemaUtils.resourceToInterfaceName('resource');

    it('builds a query action', () => {
        const action = buildQueryAction(interfaceName, resource.actions.query);

        expect(action.kind).toEqual('query');
        expect(action.name).toEqual('query');
        expect(action.responseType).toEqual('PaginatedResponse<Resource>');
        expect(action.args.length).toEqual(3);
    });

    it('contains sort, pagination, and with params', () => {
        const action = buildQueryAction(interfaceName, resource.actions.query);

        expect(action.args.map((a) => a.name)).toEqual([
            'sort',
            'paginate',
            'with',
        ]);
    });

    it('parses sort params correctly', () => {
        const action = buildQueryAction(interfaceName, resource.actions.query);

        expect(action.args[0]).toEqual({
            kind: 'composed',
            name: 'sort',
            description: '',
            type: [
                {
                    kind: 'composed',
                    name: 'id',
                    description: '',
                    type: [
                        {
                            kind: 'picklist',
                            name: 'direction',
                            description: '',
                            type: "'asc' | 'desc'",
                        },
                    ],
                },
            ],
        });
    });

    it('parses paginate params correctly', () => {
        const action = buildQueryAction(interfaceName, resource.actions.query);

        expect(action.args[1]).toEqual({
            kind: 'composed',
            name: 'paginate',
            description: '',
            type: [
                {
                    kind: 'simple',
                    name: 'page',
                    description: '',
                    type: 'number',
                },
                {
                    kind: 'simple',
                    name: 'perpage',
                    description: '',
                    type: 'number',
                },
            ],
        });
    });

    it('parses with param correctly', () => {
        const action = buildQueryAction(interfaceName, resource.actions.query);

        expect(action.args[2]).toEqual({
            kind: 'list-of',
            name: 'with',
            description: '',
            itemType: 'string',
            type: 'string[]',
        });
    });
});
