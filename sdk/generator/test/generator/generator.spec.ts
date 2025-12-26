import { parseSchema } from '../../src/schema';
import path from 'path';
import { generateFromSchema } from '../../src/generator';
import { kebabCase } from 'lodash';
import { Project } from 'ts-morph';

const simpleFieldsResource = path.resolve(
    __dirname,
    '../fixtures/resource-with-simple-fields.json'
);
const relationFieldsResource = path.resolve(
    __dirname,
    '../fixtures/resource-with-relations.json'
);
const simpleActionsResource = path.resolve(
    __dirname,
    '../fixtures/resource-with-simple-actions.json'
);
const complexArgActionResource = path.resolve(
    __dirname,
    '../fixtures/resource-action-with-complex-field.json'
);
const tsConfigFilePath = path.resolve(__dirname, '../../tsconfig.json');

describe('generator', () => {
    describe('generateFromSchema', () => {
        describe('resource with simple fields', () => {
            const project = generateFromSchema(
                parseSchema(simpleFieldsResource),
                new Project({
                    tsConfigFilePath,
                })
            );

            const sourceFile = project.getSourceFile(
                'src/generated/resource.ts'
            );

            it('builds the Resource interface file', () => {
                expect(sourceFile).toBeDefined();

                const inter = sourceFile!.getInterface('Resource');
                expect(inter).toBeDefined();
            });

            test.each`
                name              | type
                ${'id'}           | ${'number'}
                ${'counter'}      | ${'number'}
                ${'day'}          | ${'string'}
                ${'color'}        | ${'string'}
                ${'brochure_url'} | ${'string'}
                ${'file'}         | ${'string'}
                ${'email'}        | ${'string'}
                ${'rating'}       | ${'number'}
                ${'percent'}      | ${'number'}
                ${'amount'}       | ${'number'}
                ${'created_at'}   | ${'string'}
            `('$name is $type', ({ name, type }) => {
                const inter = sourceFile!.getInterface('Resource');
                const properties = inter!.getProperties();

                const prop = properties.find(
                    (property) => property.getName() === name
                );

                expect(prop).toBeDefined();
                expect(prop!.getType().getText()).toEqual(type);
            });
        });

        describe('resource with relations', () => {
            const project = generateFromSchema(
                parseSchema(relationFieldsResource),
                new Project({
                    tsConfigFilePath,
                })
            );

            const sourceFile = project.getSourceFile(
                'src/generated/resource.ts'
            );

            describe.each`
                name                          | relatedType                | type
                ${'belongs_to_resource'}      | ${'BelongsToResource'}     | ${'BelongsToResource'}
                ${'belongs_to_many_resource'} | ${'BelongsToManyResource'} | ${'BelongsToManyResource[]'}
                ${'has_one'}                  | ${'HasOne'}                | ${'HasOne'}
                ${'has_many'}                 | ${'HasMany'}               | ${'HasMany[]'}
                ${'ancestors'}                | ${'Ancestor'}              | ${'Ancestor[]'}
            `('$name', ({ name, relatedType, type }) => {
                const inter = sourceFile!.getInterface('Resource');
                const properties = inter!.getProperties();

                const prop = properties.find(
                    (property) => property.getName() === name
                );

                it(`is ${relatedType}`, () => {
                    expect(prop).toBeDefined();
                    expect(prop!.getTypeNode()!.getText()).toEqual(type);
                });

                it('imports the correct file', () => {
                    const decl = sourceFile!.getImportDeclaration((impd) => {
                        const moduleSpecifier = impd
                            .getModuleSpecifier()
                            .getLiteralValue();

                        return (
                            moduleSpecifier === `./${kebabCase(relatedType)}`
                        );
                    });

                    expect(decl).toBeDefined();
                    expect(
                        decl!
                            .getNamedImports()
                            .find((i) => i.getName() === relatedType)
                    ).toBeDefined();
                });
            });
        });

        describe('resource with actions', () => {
            const project = generateFromSchema(
                parseSchema(simpleActionsResource),
                new Project({
                    tsConfigFilePath,
                })
            );

            const sourceFile = project.getSourceFile(
                'src/generated/resource.ts'
            );

            project.save();
        });

        describe('resource action with complex field', () => {
            const project = generateFromSchema(
                parseSchema(complexArgActionResource),
                new Project({
                    tsConfigFilePath,
                })
            );

            const sourceFile = project.getSourceFile(
                'src/generated/resource.ts'
            );

            project.save();
        });
    });
});
