// tslint:disable
import * as path from 'path';

import { expect } from 'chai';
import * as fs from 'fs-extra';

import { validateInput } from '~zipdir/validate-input';

describe('validate-input', () => {
    const testDir = path.join(process.cwd(), 'testDir');
    const dir1 = 'testDir/a';
    const dir2 = './testDir/b';
    const dir3 = 'testDir/c';
    const file1 = 'testDir/d';

    before(async () => {
        await fs.mkdir(testDir);
        await fs.mkdir(dir1);
        await fs.mkdir(dir2);
        await fs.mkdir(dir3);
        await fs.ensureFile(file1);
    });

    after(async () => await fs.remove(testDir));

    it('should throw if not given an array', async () => {
        const testCases = [true, 'foobar', 12, {}, null, function() {}];

        for (const testCase of testCases) {
            await validateInput(testCase as any).catch((e) => {
                expect(e.message).to.equal(`Expected array, got ${typeof testCase}`);
                expect(e.name).to.equal('TypeError');
            });
        }
    });

    it('should throw if not given an array of strings', async () => {
        const testCases = [[true, false, true], [12, 13, 14], [null, undefined, null]];

        for (const testCase of testCases) {
            await validateInput(testCase as any).catch((e) => {
                expect(e.message).to.equal('Expected an array of strings');
                expect(e.name).to.equal('TypeError');
            });
        }
    });

    it('should throw if not given an array of length >= 2', async () => {
        const testCases = [[], ['a']];
        for (const testCase of testCases) {
            await validateInput(testCase as any).catch((e) => {
                expect(e.message).to.equal('Expected an array of at least length 2');
                expect(e.name).to.equal('SyntaxError');
            });
        }
    });

    it('should throw if given an invalid number of arguments', async () => {
        const testCases = [[], [['a', 'b', 'c'], 'd']];

        for (const testCase of testCases) {
            await validateInput(...(testCase as any)).catch((e) => {
                expect(e.message).to.equal(`Expected one argument, got ${testCase.length}`);
                expect(e.name).to.equal('SyntaxError');
            });
        }
    });

    it('should throw if any element in the given array is not a file or directory', async () => {
        const testCases = [
            ['a', 'b', 'c', 'd'],
            [dir1, 'b', 'c', 'd'],
            [dir1, dir2, 'c', 'd'],
            [dir1, dir2, dir3, 'd']
            // [dir1, dir2, dir3, file1]
        ];

        for (const [i, testCase] of Object.entries(testCases)) {
            await validateInput(testCase as any).catch((e) => {
                expect(e.message).to.equal(`"${path.resolve(testCase[+i])}" is not a file or directory`);
                expect(e.name).to.equal('Error');
            });
        }
    });

    it('should throw if any element in the given array is not a directory', async () => {
        const testCases = [
            [dir1, dir2, dir3, file1],
            [dir1, dir2, file1, dir3],
            [dir1, file1, dir2, dir3],
            [file1, dir1, dir2, dir3]
        ];

        for (const testCase of testCases) {
            await validateInput(testCase as any).catch((e) => {
                expect(e.message).to.equal(`"${file1}" is not a directory`);
                expect(e.name).to.equal('Error');
            });
        }
    });

    it('should not throw if each element in the given array resolves to a valid path', async () => {
        try {
            await validateInput([dir1, dir2, dir3]);
        } catch (e) {
            expect(e).to.not.exist;
        }
    });
});
