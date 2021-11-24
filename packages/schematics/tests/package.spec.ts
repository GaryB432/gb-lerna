import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../src/collection.json');

describe('package', () => {
  it('works', async () => {
    const st = Tree.empty();
    st.create('/lerna.json', '{ "version": "1.2.3" }');
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync(
        'package',
        { name: '@DemoScope/DasherizedPackageName' },
        st
      )
      .toPromise();

    const packageJsonPath = '/packages/dasherized-package-name/package.json';
    expect(tree.files).toEqual([
      '/lerna.json',
      packageJsonPath,
      '/packages/dasherized-package-name/README.md',
      '/packages/dasherized-package-name/tsconfig.json',
      '/packages/dasherized-package-name/src/index.ts',
      '/packages/dasherized-package-name/tests/index.spec.ts',
    ]);

    expect(
      tree.read('/packages/dasherized-package-name/README.md')?.toString()
    ).toMatch(/^# @demo-scope\/dasherized-package-name/);
    expect(tree.read(packageJsonPath)?.toString()).toMatch(
      /"name": "@demo-scope\/dasherized-package-name".*"version": "1.2.3"/s
    );
  });
  it('works with independent version', async () => {
    const st = Tree.empty();
    st.create('/lerna.json', '{ "version": "independent" }');
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync(
        'package',
        { name: '@DemoScope/DasherizedPackageName' },
        st
      )
      .toPromise();

    const packageJsonPath = '/packages/dasherized-package-name/package.json';
    expect(tree.read(packageJsonPath)?.toString()).toMatch(
      /"name": "@demo-scope\/dasherized-package-name".*"version": "0.0.0"/s
    );
  });
});
