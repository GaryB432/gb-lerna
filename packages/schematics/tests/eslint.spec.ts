import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { IPackageJson } from '../src/utils';

const collectionPath = path.join(__dirname, '../src/collection.json');
const packageInfo = `{
  "devDependencies": {
  },
  "scripts": {
    "test": "yes please"
  }
}`;

describe('package', () => {
  it('works', async () => {
    const seedTree = Tree.empty();
    seedTree.create('/package.json', packageInfo);
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematicAsync('eslint', {}, seedTree).toPromise();

    expect(tree.files).toEqual(['/package.json', '/.eslintrc.js']);

    const packageJson: IPackageJson = JSON.parse(tree.read('/package.json')!.toString());

    expect(packageJson.devDependencies['@typescript-eslint/eslint-plugin']).toBeDefined();
    expect(packageJson.devDependencies['@typescript-eslint/parser']).toBeDefined();
    expect(packageJson.devDependencies['eslint']).toBeDefined();
    expect(packageJson.devDependencies['eslint-config-prettier']).toBeDefined();
    expect(packageJson.devDependencies['eslint-formatter-friendly']).toBeDefined();
    expect(packageJson.devDependencies['eslint-plugin-prettier']).toBeDefined();
  });
});
