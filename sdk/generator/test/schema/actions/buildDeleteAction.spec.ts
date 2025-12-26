import { readAndParseFixture } from '../../test-utils';
import { schemaUtils } from '../../../src/schema/schema-utils';
import { buildDeleteAction } from '../../../src/schema/actions/buildDeleteAction';

describe('buildDeleteAction', () => {
    const { resource } = readAndParseFixture('resource-with-simple-actions');
    const interfaceName = schemaUtils.resourceToInterfaceName('resource');

    it('builds a delete action', () => {
        const action = buildDeleteAction(
            interfaceName,
            resource.actions.delete
        );

        expect(action.kind).toEqual('delete');
        expect(action.name).toEqual('del');
        expect(action.responseType).toEqual('Response<Resource>');
        expect(action.args.length).toEqual(1);
    });

    it('parses id param correctly', () => {
        const action = buildDeleteAction(
            interfaceName,
            resource.actions.delete
        );

        expect(action.args[0]).toEqual({
            kind: 'simple',
            name: 'id',
            description: '',
            type: 'number',
        });
    });
});
