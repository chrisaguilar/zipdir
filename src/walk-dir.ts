// tslint:disable:object-literal-sort-keys
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const lstat = util.promisify(fs.lstat);
const readdir = util.promisify(fs.readdir);
const readlink = util.promisify(fs.readlink);

export type File = {
    name: string;
    path: string;
    relative: string;
    link?: string;
};

export async function walkDir (dir: string, baseDir: string): Promise<File[]> {
    const contents: File[] = [];
    const currentDirectoryContents = await readdir(dir);
    const context = path.resolve(dir);

    for (const file of currentDirectoryContents) {
        const fullPath = path.resolve(context, file);
        const stats = await lstat(fullPath);

        const meta = {
            name: file,
            path: fullPath,
            relative: path.relative(baseDir, fullPath)
        };

        if (stats.isFile()) {
            contents.push({ ...meta });
        } else if (stats.isSymbolicLink()) {
            const symlink = path.resolve(path.dirname(fullPath), await readlink(fullPath));
            contents.push({ ...meta, link: symlink });
        } else if (stats.isDirectory()) {
            contents.push.apply(contents, await walkDir(fullPath, baseDir));
        } else {
            throw new Error('An unknown error occurred');
        }
    }

    return contents;
}
