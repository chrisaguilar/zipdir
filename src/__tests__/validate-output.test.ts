// tslint:disable
import * as fs from 'fs-extra';

import { validateOutput } from '~zipdir/validate-output';

describe('validate-output', () => {
    const dir1 = 'testDir1';
    const dir2 = 'testDir2';
    const file1 = `${dir1}/foobar.txt`;

    beforeAll(async () => {
        await fs.mkdir(dir1);
        await fs.mkdir(dir2);
        await fs.ensureFile(file1);
    });

    afterAll(async () => {
        await fs.remove(dir1);
        await fs.remove(dir2);
    });

    it('should throw if given an invalid number of arguments', async () => {
        const testCases = [[], [dir1, dir2], ['a', 'b', 'c', 'd']];

        for (const testCase of testCases) {
            await validateOutput(...testCase).catch((e) => {
                expect(e.message).toEqual(`Expected one argument, got ${testCase.length}`);
                expect(e.name).toEqual('SyntaxError');
            });
        }
    });

    it('should throw if not given a string', async () => {
        const testCases = [1, true, null, function() {}, {}];

        for (const testCase of testCases) {
            await validateOutput(testCase as any).catch((e) => {
                expect(e.message).toEqual(`Expected string, got ${typeof testCase}`);
                expect(e.name).toEqual('TypeError');
            });
        }
    });

    it('should throw if the given string contains only invalid characters', async () => {
        const testCases = [';;;', '&&&', '*', ')', '/'];

        for (const testCase of testCases) {
            await validateOutput(testCase).catch((e) => {
                expect(e.message).toEqual(`Expected valid filename, got "${testCase}"`);
                expect(e.name).toEqual('Error');
            });
        }
    });

    it('should throw if the given path exists and is not a directory', async () => {
        const testCases = [file1];

        for (const testCase of testCases) {
            await validateOutput(testCase).catch((e) => {
                expect(e.message).toEqual(`Expected "${testCase}" to be a directory`);
                expect(e.name).toEqual('Error');
            });
        }
    });

    it('should throw if the given directory exists and is not empty', async () => {
        const testCases = [dir1];

        for (const testCase of testCases) {
            await validateOutput(testCase).catch((e) => {
                expect(e.message).toEqual(`Expected directory "${testCase}" to be empty`);
                expect(e.name).toEqual('Error');
            });
        }
    });

    it('should not throw if the given directory exists and is empty', async () => {
        const testCases = [dir2];

        for (const testCase of testCases) {
            await validateOutput(testCase).catch((e) => {
                expect(e).toBeUndefined();
            });
        }
    });

    it('should not throw if the given directory does not exist', async () => {
        const testCases = ['testDir3', 'testDir4', 'testDir5'];

        for (const testCase of testCases) {
            await validateOutput(testCase).catch((e) => {
                expect(e).toBeUndefined();
            });
        }
    });
});
