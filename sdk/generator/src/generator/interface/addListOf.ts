import {
    ListOfResourceProperty,
    ResourceProperty,
} from '../../schema/resource';
import {
    CodeBlockWriter,
    InterfaceDeclaration,
    WriterFunction,
    Writers,
} from 'ts-morph';
import { buildComposedType } from './addComposed';
import { addImports } from '../sources/addImports';
import { buildMorphToType } from './addMorphTo';

export function addListOf(
    inter: InterfaceDeclaration,
    field: ListOfResourceProperty
) {
    let result = buildListOfType(inter, field);

    if (typeof result !== 'string') {
        const prevResult = result;

        result = (writer) => {
            writer.write('Array<');
            prevResult(writer);
            writer.write('>');
        };
    } else {
        result = `${result}[]`;
    }

    inter.addProperty({
        name: field.name,
        type: result,
        hasQuestionToken: field.options?.optional,
    });
}

function buildListOfType(
    inter: InterfaceDeclaration,
    field: ListOfResourceProperty
): string | WriterFunction {
    const { itemType } = field;

    if (Array.isArray(itemType)) {
        const first = itemType[0];
        if (typeof first === 'string') {
            return itemType.join(' | ');
        }

        return Writers.object(
            buildComposedType(inter, itemType as ResourceProperty[])
        );
    }

    if (typeof itemType === 'object') {
        if (itemType.kind === 'morph-to') {
            return buildMorphToType(inter, itemType);
        }

        let innerType = buildListOfType(inter, itemType);

        if (typeof innerType === 'function') {
            const prevType = innerType;
            innerType = (writer: CodeBlockWriter) => {
                writer.write('Array<');
                prevType(writer);
                writer.write('>');
            };
        }

        return innerType;
    }

    return itemType;
}
