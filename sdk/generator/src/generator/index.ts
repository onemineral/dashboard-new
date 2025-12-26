import { Project, SourceFile } from 'ts-morph';
import { Schema } from '../schema';
import { addPropertiesToInterface } from './interface/addProperties';
import { ResourceProperty } from '../schema/resource';
import { generateSourceFile } from './sources/generateSourceFile';
import { addResourceActions } from './actions/addResourceActions';
import {
    addClientImport,
    addExport,
    addInitFunc,
    generateIndexFile,
} from './sources/generateIndexFile';
import { camelCase } from 'lodash';

const defaultProject = new Project({
    // TODO(bunea): create default ts options
    // tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
});

function addResourceInterface(
    sourceFile: SourceFile,
    interfaceName: string,
    properties: ResourceProperty[]
) {
    const inter = sourceFile.addInterface({
        leadingTrivia: (writer) => writer.newLine(),
        name: interfaceName,
        isExported: true,
    });

    addPropertiesToInterface(inter, properties);
}

export function generateFromSchema(
    schema: Schema,
    project: Project = defaultProject
) {
    generateSharedTypes(project);
    const indexFile = generateIndexFile(project);
    const clients: { [key: string]: string } = {};

    for (const resourceKey in schema) {
        if (!schema.hasOwnProperty(resourceKey)) {
            continue;
        }

        const resource = schema[resourceKey];
        const { name, interfaceName, properties } = resource;
        const sourceFile = generateSourceFile(project, name);

        addResourceInterface(sourceFile, interfaceName, properties);
        addResourceActions(sourceFile, resource);
        addExport(indexFile, name);

        if (resource.actions.length > 0) {
            const clientName = `${interfaceName}Client`;

            clients[camelCase(name)] = `new ${clientName}(apiClient)`;

            addClientImport(indexFile, clientName, name);
        }
    }

    addInitFunc(indexFile, clients);

    return project;
}

function generateSharedTypes(project: Project) {
    const sourceFile = project.createSourceFile('src/generated/shared.ts', '', {
        overwrite: true,
    });

    const translatedText = sourceFile.addInterface({
        name: 'TranslatedText',
        isExported: true,
    });

    translatedText.addIndexSignature({
        keyName: 'lang',
        keyType: 'string',
        returnType: 'string | null',
    });

    sourceFile.addInterface({
        name: 'Geo',
        isExported: true,
        properties: [
            {
                name: 'lat',
                type: 'number',
            },
            {
                name: 'lon',
                type: 'number',
            },
        ],
    });

    sourceFile.addInterface({
        name: 'DateRange',
        isExported: true,
        properties: [
            {
                name: 'start',
                type: 'string',
            },
            {
                name: 'end',
                type: 'string',
            },
        ],
    });

    sourceFile.addInterface({
        name: 'NodeFileUpload',
        isExported: true,
        properties: [
            {
                name: 'filename',
                type: 'string',
                hasQuestionToken: true,
            },
            {
                name: 'filepath',
                type: 'string',
                hasQuestionToken: true,
            },
            {
                name: 'contentType',
                type: 'string',
                hasQuestionToken: true,
            },
            {
                name: 'stream',
                type: 'any',
            },
        ],
    });
}

export async function saveProject(project: Project) {
    await project.save();
}
