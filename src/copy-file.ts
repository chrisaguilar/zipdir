import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import { ensureDir } from 'fs-extra';

import { File, resolveConflict } from '~zipdir';

const copy = util.promisify(fs.copyFile);
// const symlink = util.promisify(fs.symlink);

export async function copyFile ([name, file]: [string, File | File[]]): Promise<any> {
    const destination = path.resolve(name);

    await ensureDir(path.dirname(destination));

    if (Array.isArray(file)) {
        const choice: false | File = await resolveConflict(file);
        if (choice) {
            if (choice.link) console.error("Sorry, I can't handle symbolic links at this time");
            else await copy(choice.path, destination);
        }
    } else {
        if (file.link) console.error("Sorry, I can't handle symbolic links at this time");
        await copy(file.path, destination);
    }
}
