import { File, walkDir } from '~zipdir';

export async function walkInput (dirs: string[]): Promise<File[]> {
    const structure: File[] = [];

    for (const dir of dirs) {
        structure.push.apply(structure, await walkDir(dir, dir));
    }

    return structure;
}
