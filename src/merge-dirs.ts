import * as path from 'path';

import { File } from '~zipdir';

export function mergeDirs (files: File[], outDir: string) {
    const outputStructure: Map<string, File | File[]> = new Map();

    for (const file of files) {
        const outputFile = path.join(outDir, file.relative);

        if (!outputStructure.has(outputFile)) {
            outputStructure.set(outputFile, file);
        } else {
            const dest = outputStructure.get(outputFile) as File | File[];
            outputStructure.set(outputFile, Array.isArray(dest) ? [...dest, file] : [dest, file]);
        }
    }

    return outputStructure;
}
