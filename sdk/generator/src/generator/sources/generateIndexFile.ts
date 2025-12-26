import { Project, SourceFile, Writers } from 'ts-morph';
import { addNamedImport } from '../imports/addNamedImport';

export function generateIndexFile(project: Project): SourceFile {
    return project.createSourceFile(`src/generated/index.ts`, '', {
        overwrite: true,
    });
}

export function addExport(indexFile: SourceFile, moduleName: string) {
    indexFile
        .addExportDeclaration({
            moduleSpecifier: `./${moduleName}`,
        })
        .toNamespaceExport();
}

export function addClientImport(
    indexFile: SourceFile,
    clientName: string,
    moduleName: string
) {
    addNamedImport(indexFile, clientName, `./${moduleName}`);
}

export function addInitFunc(
    indexFile: SourceFile,
    clients: { [key: string]: string }
) {
    addNamedImport(indexFile, 'ApiClient', '../api-client');

    const initFunc = indexFile.addFunction({
        name: 'init',
        isExported: true,
        parameters: [
            {
                name: 'apiClient',
                type: 'ApiClient',
            },
        ],
    });

    initFunc.setBodyText((writer) => {
        writer.write('return ');
        Writers.object(clients)(writer);
        writer.write(';');
    });
}
