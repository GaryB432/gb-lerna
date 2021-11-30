import { Rule, Tree } from '@angular-devkit/schematics';
import { format, Options } from 'prettier';

export type PrettierOptions = Options;

export function getPrettierOptions(tree: Tree): PrettierOptions {
  const config = tree.read('.prettierrc');
  return config
    ? JSON.parse(config.toString())
    : {
        printWidth: 80,
        singleQuote: true,
        trailingComma: 'es5',
        endOfLine: 'auto',
      };
}

export function formatFiles(options: PrettierOptions): Rule {
  return (tree: Tree): Tree => {
    tree.visit((path, entry) => {
      if (entry) {
        try {
          tree.overwrite(
            path,
            format(entry.content.toString(), { ...options, filepath: path })
          );
        } catch {
          // empty
        }
      }
    });
    return tree;
  };
}
