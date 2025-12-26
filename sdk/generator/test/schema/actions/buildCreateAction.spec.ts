import { readAndParseFixture } from '../../test-utils';
import { schemaUtils } from '../../../src/schema/schema-utils';
import { buildCreateAction } from '../../../src/schema/actions/buildCreateAction';

describe('buildCreateAction', () => {
    const { resource } = readAndParseFixture('resource-with-simple-actions');
    const interfaceName = schemaUtils.resourceToInterfaceName('resource');

    it('builds a create action', () => {
        const action = buildCreateAction(
            interfaceName,
            resource.actions.create
        );

        expect(action.kind).toEqual('create');
        expect(action.name).toEqual('create');
        expect(action.responseType).toEqual('Response<Resource>');
        expect(action.args.length).toEqual(8);
    });

    it('contains the right params params', () => {
        const action = buildCreateAction(
            interfaceName,
            resource.actions.create
        );

        expect(action.args.map((a) => a.name)).toEqual([
            'name',
            'description',
            'bedrooms',
            'geo',
            'users',
            'checkin_category',
            'location',
            'max_booking_window',
        ]);
    });

    it('parses name param correctly', () => {
        const action = buildCreateAction(
            interfaceName,
            resource.actions.create
        );

        expect(action.args[0]).toEqual({
            kind: 'simple',
            name: 'name',
            description: '',
            type: 'TranslatedText',
        });
    });

    it('parses description param correctly', () => {
        const action = buildCreateAction(
            interfaceName,
            resource.actions.create
        );

        expect(action.args[1]).toEqual({
            kind: 'simple',
            name: 'description',
            description: '',
            type: 'TranslatedText',
        });
    });

    it('parses bedrooms param correctly', () => {
        const action = buildCreateAction(
            interfaceName,
            resource.actions.create
        );

        expect(action.args[2]).toEqual({
            kind: 'simple',
            name: 'bedrooms',
            description: '',
            type: 'number',
        });
    });

    it('parses geo param correctly', () => {
        const action = buildCreateAction(
            interfaceName,
            resource.actions.create
        );

        expect(action.args[3]).toEqual({
            kind: 'simple',
            name: 'geo',
            description: '',
            type: 'Geo',
        });
    });

    it('parses users param correctly', () => {
        const action = buildCreateAction(
            interfaceName,
            resource.actions.create
        );

        expect(action.args[4]).toEqual({
            kind: 'relation',
            relationKind: 'many',
            name: 'users',
            description: '',
            relatedType: 'User',
            type: 'number[]',
        });
    });

    it('parses checkin_category param correctly', () => {
        const action = buildCreateAction(
            interfaceName,
            resource.actions.create
        );

        expect(action.args[5]).toEqual({
            kind: 'picklist',
            name: 'checkin_category',
            description: '',
            type:
                "'doorman_entry' | 'lockbox' | 'smartlock' | 'keypad' | 'host_checkin' | 'other_checkin'",
        });
    });

    it('parses location param correctly', () => {
        const action = buildCreateAction(
            interfaceName,
            resource.actions.create
        );

        expect(action.args[6]).toEqual({
            kind: 'relation',
            relationKind: 'single',
            name: 'location',
            description: '',
            relatedType: 'Location',
            type: 'number',
        });
    });

    it('parses max_booking_window correctly', () => {
        const action = buildCreateAction(
            interfaceName,
            resource.actions.create
        );

        expect(action.args[7]).toEqual({
            kind: 'composed',
            name: 'max_booking_window',
            description: '',
            type: [
                {
                    kind: 'picklist',
                    name: 'value',
                    description: '',
                    type:
                        "'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24'",
                },
                {
                    kind: 'picklist',
                    name: 'type',
                    description: '',
                    type: "'days' | 'months'",
                },
            ],
        });
    });
});
