import { addNamedImport } from '../imports/addNamedImport';
import {
    ClassDeclaration,
    MethodDeclaration,
    Scope,
    SourceFile,
    StructureKind,
} from 'ts-morph';
import { camelCase } from 'lodash';
import { schemaUtils } from '../../schema/schema-utils';
import { addPropertiesToInterface } from '../interface/addProperties';
import { Resource, ResourceAction } from '../../schema/resource';

export function addResourceActions(sourceFile: SourceFile, resource: Resource) {
    const { interfaceName, actions } = resource;

    if (actions.length === 0) {
        return;
    }

    addNamedImport(sourceFile, 'ApiClient', '../api-client');

    const cls = sourceFile.addClass({
        name: `${interfaceName}Client`,
        isExported: true,
    });

    addConstructor(cls);
    addResourcePath(cls, resource);
    addActions(sourceFile, cls, resource);
}

function addConstructor(cls: ClassDeclaration) {
    cls.addConstructor({
        scope: Scope.Public,
        parameters: [
            {
                name: 'apiClient',
                type: 'ApiClient',
                isReadonly: true,
                scope: Scope.Private,
            },
        ],
    });
}

function addResourcePath(cls: ClassDeclaration, resource: Resource) {
    const { name } = resource;

    cls.addProperty({
        name: 'path',
        type: 'string',
        scope: Scope.Private,
        initializer: `'${name}'`,
    });
}

function addActions(
    sourceFile: SourceFile,
    cls: ClassDeclaration,
    resource: Resource
) {
    const { actions, name } = resource;

    function getMethodPath(name: string) {
        return name === 'del' ? 'delete' : name;
    }

    function addMethod(a: ResourceAction) {
        return cls.addMethod({
            name: camelCase(a.name),
            returnType: `Promise<${a.responseType}>`,
            isAsync: true,
            kind: StructureKind.Method,
            scope: Scope.Public,
            statements: (writer) => {
                const hasFileUpload =
                    a.args.find((arg) => arg.kind === 'file') !== undefined;
                const body = ['return ', 'this.apiClient.request('];

                const params = [
                    `\`\${this.path}/${getMethodPath(a.name)}\`,`,
                    '{',
                ];

                if (a.args.length > 0) {
                    params.push('params,');
                }

                if (!hasFileUpload) {
                    params.push('options');
                } else {
                    params.push('options: {...options, fileUpload: true}');
                }

                params.push('}');

                const returnLine = body.concat(params);
                returnLine.push(');');

                writer.writeLine(returnLine.join(''));
            },
        });
    }

    function addArgs(method: MethodDeclaration, a: ResourceAction) {
        const { args } = a;

        if (args.length === 0) {
            return;
        }

        const paramsInterfaceName = schemaUtils.resourceToInterfaceName(
            `${name}-${a.name === 'del' ? 'delete' : a.name}-params`
        );
        const paramsInterface = sourceFile.addInterface({
            name: paramsInterfaceName,
            isExported: true,
        });

        addPropertiesToInterface(paramsInterface, a.args);

        const hasQuestionToken = args.reduce(
            (acc, arg) => acc && Boolean(arg.options?.optional),
            true
        );
        method.addParameter({
            name: 'params',
            type: paramsInterfaceName,
            hasQuestionToken,
        });
    }

    function addOpts(method: MethodDeclaration) {
        addNamedImport(sourceFile, 'RequestOptions', '../request-options');
        method.addParameter({
            name: 'options',
            type: 'RequestOptions',
            hasQuestionToken: true,
        });
    }

    actions.forEach((a) => {
        const method = addMethod(a);

        addArgs(method, a);
        addOpts(method);
        addNamedImport(sourceFile, a.responseKind, '../response');
    });
}
