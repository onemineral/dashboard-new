import { InterfaceDeclaration } from 'ts-morph';
import { addNamedImport } from '../imports/addNamedImport';
import {
    FileResourceProperty,
    JsonResourceProperty,
    MorphToResourceProperty,
    PicklistResourceProperty,
    RelationResourceProperty,
    SimpleResourceProperty,
    StatusResourceProperty,
} from '../../schema/resource';

export type SimpleProperty =
    | SimpleResourceProperty
    | FileResourceProperty
    | RelationResourceProperty
    | JsonResourceProperty
    | MorphToResourceProperty
    | PicklistResourceProperty
    | StatusResourceProperty;

export function addImports(inter: InterfaceDeclaration, field: SimpleProperty) {
    const sourceFile = inter.getSourceFile();

    if (isRelation(field) && field.relatedType !== inter.getName()) {
        addNamedImport(sourceFile, field.relatedType, `./${field.relatedType}`);
    } else if (isMorphTo(field)) {
        field.relatedTypes.forEach((r) => {
            addNamedImport(sourceFile, r, `./${r}`);
        });
    } else {
        let type = getSharedType(field);
        if (type) {
            addNamedImport(sourceFile, type);
        }
    }
}

const sharedTypes = ['TranslatedText', 'Geo', 'DateRange', 'NodeFileUpload'];

function getSharedType(field: SimpleProperty): string | null {
    for (let i in sharedTypes) {
        if (field.type.includes(sharedTypes[i])) {
            return sharedTypes[i];
        }
    }

    return null;
}

function isRelation(field: SimpleProperty): field is RelationResourceProperty {
    return field.kind === 'relation' && !field.type.includes('number');
}

function isMorphTo(field: SimpleProperty): field is MorphToResourceProperty {
    return field.kind.includes('morph-to');
}
