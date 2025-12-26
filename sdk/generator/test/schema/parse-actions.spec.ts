import { readAndParseFixture } from '../test-utils';
import { parseActions } from '../../src/schema/parse-actions';

describe('parse-actions', () => {
    const { resource } = readAndParseFixture('resource-with-simple-actions');

    it('builds a query action', () => {
        const action = parseActions('Resource', resource.actions)[0];

        expect(action.kind).toEqual('query');
        expect(action.name).toEqual('query');
    });

    it('builds a fetch action', () => {
        const action = parseActions('Resource', resource.actions)[1];

        expect(action.kind).toEqual('fetch');
        expect(action.name).toEqual('fetch');
    });

    it('builds a create action', () => {
        const action = parseActions('Resource', resource.actions)[2];

        expect(action.kind).toEqual('create');
        expect(action.name).toEqual('create');
    });

    it('builds a update action', () => {
        const action = parseActions('Resource', resource.actions)[3];

        expect(action.kind).toEqual('update');
        expect(action.name).toEqual('update');
    });

    it('builds a delete action', () => {
        const action = parseActions('Resource', resource.actions)[4];

        expect(action.kind).toEqual('delete');
        expect(action.name).toEqual('del');
    });

    describe('parse custom actions', () => {
        const action = parseActions('Resource', resource.actions)[5];

        it('parses properly', () => {
            expect(action.kind).toEqual('custom');
            expect(action.name).toEqual('set-status');
        });
    });
});
