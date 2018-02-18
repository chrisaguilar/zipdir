import * as path from 'path';

import { expect } from 'chai';
import * as fs from 'fs-extra';

import { validateOutput } from '~zipdir/validate-output';

describe('validate-output', () => {
    const dir1 = path.resolve('testDir1');
    const dir2 = path.resolve('testDir2');

    before(async () => {
        await fs.mkdir(dir1);
        await fs.mkdir(dir2);
        await fs.ensureFile(path.resolve(dir1, 'foobar.txt'));
    });

    after(async () => {
        await fs.remove(dir1);
        await fs.remove(dir2);
    });

    it('should throw if given an invalid number of arguments', async () => {
        const testCases = [[], [dir1, dir2], ['a', 'b', 'c', 'd']];

        for (const testCase of testCases) {
            await validateOutput(...testCase).catch(e => {
                expect(e.message).to.equal(`Expected one argument, got ${testCase.length}`);
            });
        }
    });

    it('should throw if not given a string', async () => {
        const testCases = [1, true, null, function() {}, {}];

        for (const testCase of testCases) {
            await validateOutput(testCase).catch(e => {
                expect(e.message).to.equal(`Expected string, got ${typeof testCase}`);
            });
        }
    });

    it('should throw if the given string contains only invalid characters', async () => {
        const testCases = [';;;', '&&&', '*', ')', '/'];

        for (const testCase of testCases) {
            await validateOutput(testCase).catch(e => {
                expect(e.message).to.equal(`Expected valid filename, got "${testCase}"`)
            })
        }
    });

    it('should throw if the given directory exists and is not empty', async () => {
        const testCases = [dir1];

        for (const testCase of testCases) {
            await validateOutput(testCase).catch(e => {
                expect(e.message).to.equal(`Expected directory "${testCase}" to be empty`);
            })
        }
    });

    it('should not throw if the given directory exists and is empty', async () => {
        const testCases = [dir2];

        for (const testCase of testCases) {
            await validateOutput(testCase).catch(e => {
                expect(e).to.not.exist;
            })
        }
    });

    it('should not throw if the given directory does not exist', async () => {
        const testCases = ['testDir3', 'testDir4', 'testDir5'];

        for (const testCase of testCases) {
            await validateOutput(testCase).catch(e => {
                expect(e).to.not.exist;
            })
        }
    });
});
