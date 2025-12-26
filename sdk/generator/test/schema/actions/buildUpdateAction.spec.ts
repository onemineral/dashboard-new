import { readAndParseFixture } from '../../test-utils';
import { schemaUtils } from '../../../src/schema/schema-utils';
import { buildUpdateAction } from '../../../src/schema/actions/buildUpdateAction';

describe('buildUpdateAction', () => {
    const { resource } = readAndParseFixture('resource-with-simple-actions');
    const interfaceName = schemaUtils.resourceToInterfaceName('resource');

    it('builds a update action', () => {
        const action = buildUpdateAction(
            interfaceName,
            resource.actions.update
        );

        expect(action.kind).toEqual('update');
        expect(action.name).toEqual('update');
        expect(action.responseType).toEqual('Response<Resource>');
        expect(action.args.length).toEqual(2);
    });

    it('contains the right params params', () => {
        const action = buildUpdateAction(
            interfaceName,
            resource.actions.update
        );

        expect(action.args.map((a) => a.name)).toEqual(['id', 'name']);
    });

    it('parses id param correctly', () => {
        const action = buildUpdateAction(
            interfaceName,
            resource.actions.update
        );

        expect(action.args[0]).toEqual({
            kind: 'simple',
            name: 'id',
            description: '',
            type: 'number',
        });
    });

    it('parses name param correctly', () => {
        const action = buildUpdateAction(
            interfaceName,
            resource.actions.update
        );

        expect(action.args[1]).toEqual({
            kind: 'simple',
            name: 'name',
            description: '',
            type: 'TranslatedText',
        });
    });
});
