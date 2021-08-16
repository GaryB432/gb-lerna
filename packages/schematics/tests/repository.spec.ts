import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { IOptions } from '../src/repository';

const collectionPath = path.join(__dirname, '../src/collection.json');

describe('repository', () => {
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync<IOptions>(
        'repository',
        { independent: true },
        Tree.empty()
      )
      .toPromise();

    expect(tree.files).toEqual(
      expect.arrayContaining([
        '/lerna.json',
        '/.gitignore',
        '/jest.config.js',
        '/package.json',
        '/README.md',
        '/tsconfig.json',
        '/.prettierrc',
        '/.eslintrc.js',
        '/packages/gb-lerna/package.json',
        '/packages/gb-lerna/tsconfig.json',
        '/packages/gb-lerna/src/index.ts',
        '/packages/gb-lerna/tests/index.spec.ts',
      ])
    );

    expect(tree.read('lerna.json')?.toString()).toMatch(
      /"version": "independent"/
    );
  });
  it('works with packageName', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync('repository', { packageName: 'asdf' }, Tree.empty())
      .toPromise();

    expect(tree.files).toEqual(
      expect.arrayContaining([
        '/lerna.json',
        '/.gitignore',
        '/jest.config.js',
        '/package.json',
        '/README.md',
        '/tsconfig.json',
        '/.prettierrc',
        '/.eslintrc.js',
        '/packages/asdf/package.json',
        '/packages/asdf/tsconfig.json',
        '/packages/asdf/src/index.ts',
        '/packages/asdf/tests/index.spec.ts',
      ])
    );
  });
});
