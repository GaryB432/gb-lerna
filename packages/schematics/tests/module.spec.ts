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

describe('functions module with path', () => {
  test('tested', async () => {
    const st = Tree.empty();
    st.create('/lerna.json', JSON.stringify(lernaJson));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync<ModuleOptions>(
        'module',
        {
          kind: 'functions',
          name: 'a/b/MyFunctions',
          packageName: '@DemoScope/DasherizedPackageName',
          test: true,
        },
        st
      )
      .toPromise();

    expect(tree.files).toEqual([
      '/lerna.json',
      '/packages/dasherized-package-name/src/a/b/my-functions.ts',
      '/packages/dasherized-package-name/tests/a/b/my-functions.spec.ts',
    ]);

    expect(
      tree
        .read('/packages/dasherized-package-name/src/a/b/my-functions.ts')
        ?.toString()
    ).toMatch(/{\s*return `MyFunctions says: hello to \${name}`;\s*}/s);

    expect(
      tree
        .read(
          '/packages/dasherized-package-name/tests/a/b/my-functions.spec.ts'
        )
        ?.toString()
    ).toMatch(
      /import { add, greet } from '..\/..\/..\/src\/a\/b\/my-functions';/s
    );

    // import \{ Klass \} from '\.\.\/\.\.\/\.\.\/src\/a\/b\/klass';

    // import { Klass } from '../src/klass';
    // needs to be: import { Klass } from '../../../src/a/b/klass';
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
          name: 'a/b/my-untested-functions',
          packageName: '@DemoScope/DasherizedPackageName',
        },
        st
      )
      .toPromise();

    expect(tree.files).toEqual([
      '/lerna.json',
      '/packages/dasherized-package-name/src/a/b/my-untested-functions.ts',
    ]);

    expect(
      tree
        .read(
          '/packages/dasherized-package-name/src/a/b/my-untested-functions.ts'
        )
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

describe('class module with path', () => {
  test('tested', async () => {
    const st = Tree.empty();
    st.create('/lerna.json', JSON.stringify(lernaJson));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner
      .runSchematicAsync<ModuleOptions>(
        'module',
        {
          kind: 'class',
          name: 'a/b/MyClass',
          packageName: '@DemoScope/DasherizedPackageName',
          test: true,
        },
        st
      )
      .toPromise();

    expect(tree.files).toEqual([
      '/lerna.json',
      '/packages/dasherized-package-name/src/a/b/my-class.ts',
      '/packages/dasherized-package-name/tests/a/b/my-class.spec.ts',
    ]);

    expect(
      tree
        .read('/packages/dasherized-package-name/src/a/b/my-class.ts')
        ?.toString()
    ).toMatch(/{\s*return `MyClass says: hello to \${name}`;\s*}/s);

    expect(
      tree
        .read('/packages/dasherized-package-name/tests/a/b/my-class.spec.ts')
        ?.toString()

      // import { MyClass } from '../src/my-class';
    ).toMatch(/import { MyClass } from '..\/..\/..\/src\/a\/b\/my-class';/s);
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
