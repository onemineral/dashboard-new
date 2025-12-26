import { ResourceProperty } from '../../src/schema/resource';
import { parseFields } from '../../src/schema/parse-fields';
import { readAndParseFixture } from '../test-utils';

describe('parseFields', () => {
    describe('parses simple fields', () => {
        const { resource } = readAndParseFixture('resource-with-simple-fields');
        const properties = parseFields(resource.fields);

        test.each([
            ['id', 'number'],
            ['name', 'string'],
            ['counter', 'number'],
            ['day', 'string'],
            ['color', 'string'],
            ['brochure_url', 'string'],
            ['file', 'string'],
            ['email', 'string'],
            ['rating', 'number'],
            ['percent', 'number'],
            ['amount', 'number'],
            ['created_at', 'string'],
            ['file', 'string'],
        ])('%s is transformed to %s', (name: string, type: string) => {
            expect(getProperty(properties, name)).toEqual({
                kind: 'simple',
                name,
                description: '',
                type: type,
            });
        });
    });

    describe('parses relation fields', () => {
        const { resource } = readAndParseFixture('resource-with-relations');
        const properties = parseFields(resource.fields);

        test.each`
            name                          | relatedType                | type                         | relationKind
            ${'belongs_to_resource'}      | ${'BelongsToResource'}     | ${'BelongsToResource'}       | ${'single'}
            ${'belongs_to_many_resource'} | ${'BelongsToManyResource'} | ${'BelongsToManyResource[]'} | ${'many'}
            ${'has_one'}                  | ${'HasOne'}                | ${'HasOne'}                  | ${'single'}
            ${'has_many'}                 | ${'HasMany'}               | ${'HasMany[]'}               | ${'many'}
            ${'ancestors'}                | ${'Ancestor'}              | ${'Ancestor[]'}              | ${'many'}
        `(
            '$name is transformed to $type',
            ({ name, relatedType, type, relationKind }) => {
                expect(getProperty(properties, name)).toEqual({
                    kind: 'relation',
                    name,
                    relationKind,
                    relatedType,
                    type,
                    description: '',
                });
            }
        );
    });
});

function getProperty(
    properties: ResourceProperty[],
    name: string
): ResourceProperty {
    const field = properties.find((p) => p.name === name);
    return field!;
}
