import {
    ComposedResourceProperty,
    ListOfResourceProperty,
    MorphToResourceProperty,
    ResourceProperty,
} from '../../schema/resource';
import { AnyObject } from '../../types';
import {
    CodeBlockWriter,
    InterfaceDeclaration,
    WriterFunction,
    Writers,
} from 'ts-morph';
import { addImports } from '../sources/addImports';
import { buildMorphToType } from './addMorphTo';

export function addComposed(
    inter: InterfaceDeclaration,
    field: ComposedResourceProperty | MorphToResourceProperty
) {
    const result = buildComposedType(inter, field.type);

    inter.addProperty({
        name: field.name,
        type: Writers.object(result),
        hasQuestionToken: field.options?.optional,
    });
}

export function buildComposedType(
    inter: InterfaceDeclaration,
    type: ResourceProperty[]
): AnyObject {
    return type.reduce((acc, mt) => {
        let innerType: any = mt.type;

        if (mt.kind === 'composed') {
            innerType = Writers.object(buildComposedType(inter, innerType));
        }

        if (mt.kind === 'list-of') {
            innerType = buildListOfType(inter, mt);

            if (typeof innerType === 'function') {
                const prevType = innerType;
                innerType = (writer: CodeBlockWriter) => {
                    writer.write('Array<');
                    prevType(writer);
                    writer.write('>');
                };
            }
        }

        if (
            mt.kind === 'morph-to' ||
            mt.kind === 'relation' ||
            mt.kind === 'simple'
        ) {
            addImports(inter, mt);
        }

        const fieldName = mt.options?.optional ? `${mt.name}?` : mt.name;
        acc[fieldName] = innerType;

        return acc;
    }, {} as AnyObject);
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

        return buildListOfType(inter, itemType);
    }

    return itemType;
}
