import { generateFromSchema } from '../src/generator';
import { parseSchema } from '../src/schema';
import { Project } from 'ts-morph';
import path from 'path';

const schema = path.resolve(__dirname, './fixtures/schema.json');
const tsConfigFilePath = path.resolve(__dirname, '../tsconfig.json');

describe('generate the whole schema', () => {
    const project = generateFromSchema(
        parseSchema(schema),
        new Project({
            tsConfigFilePath,
        })
    );

    project.save();
});
