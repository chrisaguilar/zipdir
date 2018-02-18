import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const lstat = util.promisify(fs.lstat);

export async function validateInput (dirs: string[], ...args: any[]): Promise<void> {
    if ([...arguments].length === 0) {
        throw new SyntaxError('Expected one argument, got 0');
    } else if (args.length > 0) {
        throw new Error(`Expected one argument, got ${args.length + 1}`);
    } else if (!Array.isArray(dirs)) {
        throw new Error(`Expected array, got ${typeof dirs}`);
    // tslint:disable-next-line:strict-type-predicates
    } else if (!dirs.every(e => typeof e === 'string')) {
        throw new Error('Expected an array of strings');
    } else if (dirs.length < 2) {
        throw new Error('Expected an array of at least length 2');
    }

    for (const dir of dirs) {
        const directory = path.resolve(dir);

        const stat = await lstat(directory).catch(_ => {
            throw new Error(`"${directory}" is not a file or directory`);
        });

        if (!stat.isDirectory()) {
            throw new Error(`"${dir}" is not a directory`);
        }
    }
}
