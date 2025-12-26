import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, dirname } from 'path';

async function fixImports(dir) {
    const files = await readdir(dir, { withFileTypes: true, recursive: true });

    for (const file of files) {
        const fullPath = join(file.parentPath || dir, file.name);

        if (file.isFile() && file.name.endsWith('.js')) {
            let content = await readFile(fullPath, 'utf-8');
            const fileDir = dirname(fullPath);

            // Fix ES6 import/export statements with relative paths
            // Matches: import ... from './path' or export ... from './path'
            const importRegex = /\b(import|export)\s+(?:[\s\S]*?\s+from\s+)?['"](\.[^'"]+)['"]/g;
            const matches = [...content.matchAll(importRegex)];

            for (const match of matches) {
                const [fullMatch, keyword, importPath] = match;

                if (!importPath.endsWith('.js') && !importPath.includes('?')) {
                    // Check if the path points to a directory with an index file
                    const absolutePath = join(fileDir, importPath);
                    let newPath = importPath;

                    try {
                        const stats = await stat(absolutePath);
                        if (stats.isDirectory()) {
                            // It's a directory, append /index.js
                            newPath = `${importPath}/index.js`;
                        } else {
                            // It's a file, just add .js
                            newPath = `${importPath}.js`;
                        }
                    } catch {
                        // File doesn't exist yet or is a file, assume it needs .js
                        newPath = `${importPath}.js`;
                    }

                    content = content.replace(fullMatch, fullMatch.replace(importPath, newPath));
                }
            }

            // Fix dynamic imports: import('./path')
            content = content.replace(/\bimport\s*\(\s*['"](\.[^'"]+)['"]\s*\)/g, async (match, path) => {
                if (!path.endsWith('.js') && !path.includes('?')) {
                    const absolutePath = join(fileDir, path);
                    try {
                        const stats = await stat(absolutePath);
                        if (stats.isDirectory()) {
                            return `import('${path}/index.js')`;
                        }
                    } catch {}
                    return `import('${path}.js')`;
                }
                return match;
            });

            await writeFile(fullPath, content, 'utf-8');
        }
    }
}

fixImports('./dist/esm').catch(console.error);
