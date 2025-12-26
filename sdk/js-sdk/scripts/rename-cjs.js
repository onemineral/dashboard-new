import { readdir, rename } from 'fs/promises';
import { join } from 'path';

async function renameCjsFiles(dir) {
    const files = await readdir(dir, { withFileTypes: true, recursive: true });

    for (const file of files) {
        const fullPath = join(file.parentPath || dir, file.name);

        if (file.isFile() && file.name.endsWith('.js')) {
            await rename(fullPath, fullPath.replace(/\.js$/, '.cjs'));
        } else if (file.isFile() && file.name.endsWith('.d.ts')) {
            await rename(fullPath, fullPath.replace(/\.d\.ts$/, '.d.cts'));
        }
    }
}

renameCjsFiles('./dist/cjs').catch(console.error);
