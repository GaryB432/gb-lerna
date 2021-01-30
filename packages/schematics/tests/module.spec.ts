import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ModuleOptions } from '../src/module';
import { ILernaJson } from '../src/utils';

const collectionPath = path.join(__dirname, '../src/collection.json');

const lernaJson: ILernaJson = {
  packages: ['packages/*'],
  version: 'N/A',
};

describe('functions module', () => {
  test('tested', async () => {
    const st = Tree.empty();
    st.create('/lerna.json', JSON.stringify(lernaJson));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync<ModuleOptions>(
        'module',
        {
          kind: 'functions',
          name: 'MyFunctions',
          packageName: '@DemoScope/DasherizedPackageName',
          test: true,
        },
        st
      )
      .toPromise();

    expect(tree.files).toEqual([
      '/lerna.json',
      '/packages/dasherized-package-name/src/my-functions.ts',
      '/packages/dasherized-package-name/tests/my-functions.spec.ts',
    ]);

    expect(
      tree
        .read('/packages/dasherized-package-name/src/my-functions.ts')
        ?.toString()
    ).toMatch(/{\s*return `MyFunctions says: hello to \${name}`;\s*}/s);
  });

  test('untested', async () => {
    const st = Tree.empty();
    st.create('/lerna.json', JSON.stringify(lernaJson));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync<ModuleOptions>(
        'module',
        {
          kind: 'functions',
          name: 'my-untested-functions',
          packageName: '@DemoScope/DasherizedPackageName',
        },
        st
      )
      .toPromise();

    expect(tree.files).toEqual([
      '/lerna.json',
      '/packages/dasherized-package-name/src/my-untested-functions.ts',
    ]);

    expect(
      tree
        .read('/packages/dasherized-package-name/src/my-untested-functions.ts')
        ?.toString()
    ).toMatch(
      /{\s*return `my-untested-functions says: hello to \${name}`;\s*}/s
    );
  });
});

describe('class module', () => {
  test('tested', async () => {
    const st = Tree.empty();
    st.create('/lerna.json', JSON.stringify(lernaJson));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync<ModuleOptions>(
        'module',
        {
          kind: 'class',
          name: 'MyClass',
          packageName: '@DemoScope/DasherizedPackageName',
          test: true,
        },
        st
      )
      .toPromise();

    expect(tree.files).toEqual([
      '/lerna.json',
      '/packages/dasherized-package-name/src/my-class.ts',
      '/packages/dasherized-package-name/tests/my-class.spec.ts',
    ]);

    expect(
      tree.read('/packages/dasherized-package-name/src/my-class.ts')?.toString()
    ).toMatch(/{\s*return `MyClass says: hello to \${name}`;\s*}/s);
  });

  test('untested', async () => {
    const st = Tree.empty();
    st.create('/lerna.json', JSON.stringify(lernaJson));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync<ModuleOptions>(
        'module',
        {
          kind: 'class',
          name: 'my-untested-class',
          packageName: '@DemoScope/DasherizedPackageName',
        },
        st
      )
      .toPromise();

    expect(tree.files).toEqual([
      '/lerna.json',
      '/packages/dasherized-package-name/src/my-untested-class.ts',
    ]);

    expect(
      tree
        .read('/packages/dasherized-package-name/src/my-untested-class.ts')
        ?.toString()
    ).toMatch(/{\s*return `MyUntestedClass says: hello to \${name}`;\s*}/s);
  });
});
