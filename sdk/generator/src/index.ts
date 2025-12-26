import sade from 'sade';
import * as path from 'path';
import * as fs from 'fs';
import JSON5 from 'json5';
import { generateFromSchema } from './generator';
import { parseSchema } from './schema';
import { Project } from 'ts-morph';

sade('pms-sdk-generator', true)
    .version('0.0.1')
    .option('--schema', 'Path to the schema file')
    .option('--tsConfig', 'Path to the typescript config')
    .action(async (args: any) => {
        const {
            schema,
            tsConfig = 'tsconfig.json',
        }: { schema: string; tsConfig: string } = args;

        if (!schema) {
            console.error(`No schema provided
Do not forget to pass  \`--schema example.json\` flag.`);
            return;
        }

        const schemaPath = path.join(process.cwd(), schema);

        if (!fs.existsSync(schemaPath)) {
            console.error(`File at "${schemaPath}" does not exist`);
            return;
        }

        try {
            JSON.parse(fs.readFileSync(schemaPath).toString('utf8'));
        } catch {
            console.error(
                `File contents at "${schemaPath}" is not a valid JSON`
            );
            return;
        }

        // TODO(bunea): find or create a default typescript config
        const tsConfigFilePath = path.join(process.cwd(), tsConfig);
        if (!fs.existsSync(tsConfigFilePath)) {
            console.error(`tsconfig.json does not exist at path ${tsConfigFilePath}
The sdk generator currently only supports typescript

Either pass it as an arg using \`--tsConfig path/to/tsconfig.json\` or create one in the root of your project`);
            return;
        }

        const tsOpts = JSON5.parse(
            fs.readFileSync(tsConfigFilePath).toString('utf8')
        );
        const { rootDir } = tsOpts.compilerOptions;
        if (!rootDir) {
            console.error(`No \`rootDir\` set in tsconfig.json.`);
            return;
        }

        // TODO(bunea): generate the files from the schema into the `src` dir
        //  by default (non-configurable for now). Also move and generate (don't overwrite)
        //  all the dependencies necessary (api-client.ts, axios api client, fixtures client,
        //  error, and response classes. (These should not be overwritten by updates, just in
        //  case we need to manually modify clients for different tenants like Guest

        const project = generateFromSchema(
            parseSchema(schema),
            new Project({
                tsConfigFilePath,
            })
        );

        await project.save();
    })
    .parse(process.argv);
