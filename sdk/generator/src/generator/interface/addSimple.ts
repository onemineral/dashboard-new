import { InterfaceDeclaration } from 'ts-morph';
import { addImports, SimpleProperty } from '../sources/addImports';

export function addSimple(inter: InterfaceDeclaration, field: SimpleProperty) {
    addImports(inter, field);

    inter.addProperty({
        name: field.name,
        type: field.type,
        hasQuestionToken: field.options?.optional,
    });
}
