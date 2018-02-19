import * as inquirer from 'inquirer';

import { File } from '~zipdir';

export async function resolveConflict (files: File[]): Promise<false | File> {
    const filenames = files.map((e) => e.path);
    const choices: Map<string, File> = new Map(files.map((e) => [e.path, e]) as [string, File][]);

    const { decision } = await inquirer.prompt([
        {
            type: 'list',
            name: 'decision',
            message: `Files ${filenames.join(', ')} conflict, you must choose which to keep:`,
            choices: ['None', ...filenames]
        }
    ]);

    if (decision === 'None') return false;

    return choices.get(decision) as File;
}
