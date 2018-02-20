import * as fs from 'fs-extra';
import * as ProgressBar from 'progress';

import { copyFile, File, mergeDirs, validateInput, validateOutput, walkInput } from '~zipdir';

export async function zip (dirs: string[], outDir: string) {
    try {
        // Validate that the input and output are valid
        await validateInput(dirs);
        await validateOutput(outDir);

        // Create output directory
        await fs.ensureDir(outDir);

        // Get the output structure
        const inputDirStructures = await walkInput(dirs);
        const mergedDirStructure = Array.from(mergeDirs(inputDirStructures, outDir));

        // Traverse through the merged structure and copy files to their destination
        const barDisplay = '[:bar] :current of :total :name';
        const bar = new ProgressBar(barDisplay, { total: mergedDirStructure.length, width: 25 });

        for (const file of mergedDirStructure) {
            bar.tick({ name: (file[1] as File).name || (file[1] as File[])[0].name });
            await copyFile(file);
        }
    } catch (e) {
        console.error(e);
    }
}
