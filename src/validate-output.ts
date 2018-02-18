import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import * as sanitize from 'sanitize-filename';

const lstat = util.promisify(fs.lstat);
const readdir = util.promisify(fs.readdir);

export async function validateOutput(dir: string, ...args: any[]): Promise<void> {
    if (dir === undefined) throw new Error('Expected one argument, got 0');
    else if (args.length > 0) throw new Error(`Expected one argument, got ${args.length + 1}`);
    else if (typeof dir !== 'string') throw new Error(`Expected string, got ${typeof dir}`);
    else if (sanitize(dir) === '') throw new Error(`Expected valid filename, got "${dir}"`);

    const directory = path.resolve(sanitize(dir));

    const stat = await lstat(directory).catch(_ => {});

    if (stat && !stat.isDirectory()) throw new Error(`Expected "${directory}" to be a directory`);
    else if (stat && stat.isDirectory() && (await readdir(directory)).length > 0)
        throw new Error(`Expected directory "${directory}" to be empty`);

}
