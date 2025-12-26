import { readAndParseFixture } from '../../test-utils';
import { schemaUtils } from '../../../src/schema/schema-utils';
import { buildCustomAction } from '../../../src/schema/actions/buildCustomAction';

describe('buildCustomAction', () => {
    const { resource } = readAndParseFixture('resource-with-simple-actions');
    const interfaceName = schemaUtils.resourceToInterfaceName('resource');

    it('builds a update action', () => {
        const action = buildCustomAction(
            interfaceName,
            resource.actions['set-status']
        );

        expect(action.kind).toEqual('custom');
        expect(action.name).toEqual('set-status');
        expect(action.responseType).toEqual('Response<any>');
        expect(action.args.length).toEqual(2);
    });

    it('contains the right params params', () => {
        const action = buildCustomAction(
            interfaceName,
            resource.actions['set-status']
        );

        expect(action.args.map((a) => a.name)).toEqual(['id', 'status']);
    });

    it('parses id param correctly', () => {
        const action = buildCustomAction(
            interfaceName,
            resource.actions['set-status']
        );

        expect(action.args[0]).toEqual({
            kind: 'simple',
            name: 'id',
            description: '',
            type: 'number',
        });
    });

    it('parses name param correctly', () => {
        const action = buildCustomAction(
            interfaceName,
            resource.actions['set-status']
        );

        expect(action.args[1]).toEqual({
            kind: 'picklist',
            name: 'status',
            description: '',
            type: "'enabled' | 'pending' | 'disabled'",
        });
    });
});
