import { InterfaceDeclaration, WriterFunction, Writers } from 'ts-morph';
import { MorphToResourceProperty } from '../../schema/resource';
import { addImports } from '../sources/addImports';

export function addMorphTo(
    inter: InterfaceDeclaration,
    field: MorphToResourceProperty
) {
    inter.addProperty({
        name: field.name,
        type: buildMorphToType(inter, field),
        hasQuestionToken: field.options?.optional,
    });
}

export function buildMorphToType(
    inter: InterfaceDeclaration,
    field: MorphToResourceProperty
): WriterFunction {
    addImports(inter, field);

    return Writers.object(field.type);
}
