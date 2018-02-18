import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const lstat = util.promisify(fs.lstat);

export async function validateInput(dirs: string[], ...args: any[]): Promise<void> {
    if (dirs === undefined) throw new Error('Expected one argument, got 0');
    if (args.length > 0) throw new Error(`Expected one argument, got ${args.length + 1}`);
    if (!Array.isArray(dirs)) throw new Error(`Expected array, got ${typeof dirs}`);
    if (!dirs.every(e => typeof e === 'string')) throw new Error('Expected an array of strings');
    if (dirs.length < 2) throw new Error('Expected an array of at least length 2');

    for (const dir of dirs) {
        const directory = path.resolve(process.cwd(), dir);

        const stat = await lstat(directory).catch(_ => {
            throw new Error(`"${directory}" is not a file or directory`);
        });

        if (!stat.isDirectory()) throw new Error(`"${dir}" is not a directory`);
    }
}
