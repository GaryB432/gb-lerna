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
        '/.eslintrc.js',
        '/.gitignore',
        '/.prettierrc',
        '/README.md',
        '/azure-pipelines.yml',
        '/jest.config.js',
        '/lerna.json',
        '/package.json',
        '/packages/gb-lerna/package.json',
        '/packages/gb-lerna/src/index.ts',
        '/packages/gb-lerna/tests/index.spec.ts',
        '/packages/gb-lerna/tsconfig.json',
        '/tsconfig.json',
      ])
    );

    const packageJson = JSON.parse(
      tree.read('package.json')?.toString('utf-8') || '{}'
    ) as {
      devDependencies: unknown;
    };

    expect(packageJson.devDependencies).toEqual({
      '@types/jest': '^27.0.2',
      '@types/node': '^16.11.5',
      '@typescript-eslint/eslint-plugin': '^5.1.0',
      '@typescript-eslint/parser': '^5.1.0',
      eslint: '^8.1.0',
      'eslint-config-prettier': '^8.3.0',
      'eslint-plugin-jest': '^25.2.2',
      'eslint-plugin-prettier': '^4.0.0',
      jest: '^27.3.1',
      'jest-junit': '^13.0.0',
      lerna: '^4.0.0',
      prettier: '^2.4.1',
      'ts-jest': '^27.0.7',
      typescript: '^4.4.4',
    });

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
