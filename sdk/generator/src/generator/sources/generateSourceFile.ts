import { Project, SourceFile } from 'ts-morph';

export function generateSourceFile(project: Project, name: string): SourceFile {
    return project.createSourceFile(`src/generated/${name}.ts`, '', {
        overwrite: true,
    });
}
