import { ImportDeclaration, SourceFile } from 'ts-morph';
import { kebabCase } from 'lodash';
import { schemaUtils } from '../../schema/schema-utils';

export function addNamedImport(
    sourceFile: SourceFile,
    name: string,
    module: string = './shared'
) {
    if (isSameInterface(sourceFile, name)) {
        return;
    }

    let importDecl = getImportDeclaration(sourceFile, getModuleName(module));

    if (!hasNamedImport(importDecl, name)) {
        addNamedImportToDeclaration(importDecl, name);
    }
}

function getModuleName(module: string): string {
    const split = module.split('/');
    const moduleName = split[split.length - 1];
    split.pop();

    const kebabed = kebabCase(moduleName);
    split.push(kebabed);

    return split.join('/');
}

function getImportDeclaration(
    sourceFile: SourceFile,
    module: string
): ImportDeclaration {
    const importDecl = sourceFile.getImportDeclaration((importDeclaration) => {
        const moduleFile = importDeclaration
            .getModuleSpecifier()
            .getLiteralValue();

        return moduleFile === module;
    });

    return importDecl || addImportDeclaration(sourceFile, module);
}
function hasNamedImport(
    importDeclaration: ImportDeclaration,
    name: string
): boolean {
    const namedImports = importDeclaration.getNamedImports();
    return namedImports.find((i) => i.getName() === name) !== undefined;
}

function addImportDeclaration(
    sourceFile: SourceFile,
    module: string
): ImportDeclaration {
    return sourceFile.addImportDeclaration({
        moduleSpecifier: module,
    });
}

function addNamedImportToDeclaration(
    importDeclaration: ImportDeclaration,
    name: string
) {
    importDeclaration.addNamedImport(name);
}

function isSameInterface(sourceFile: SourceFile, name: string) {
    const interfaceName = schemaUtils.resourceToInterfaceName(
        sourceFile.getBaseNameWithoutExtension()
    );

    return name === interfaceName;
}
