#!/usr/bin/env node

// symbol polyfill must go first
import 'symbol-observable';

import { normalize, schema, tags, virtualFs } from '@angular-devkit/core';
import { createConsoleLogger, NodeJsSyncHost, ProcessOutput } from '@angular-devkit/core/node';
import { formats, UnsuccessfulWorkflowExecution } from '@angular-devkit/schematics';
import { NodeWorkflow, validateOptionsWithSchema } from '@angular-devkit/schematics/tools';
import * as colors from 'colors/safe';
import { getWorkflowInfo } from './options-utils';
import { WorkflowHandler } from './workflow-utils';

interface MainOptions {
  args: string[];
  stdout?: ProcessOutput;
  stderr?: ProcessOutput;
}

export async function main({
  args,
  stdout = process.stdout,
  stderr = process.stderr,
}: MainOptions): Promise<0 | 1> {
  const argv = getWorkflowInfo(args);
  const logger = createConsoleLogger(false, stdout, stderr);
  const wfHandler = new WorkflowHandler(logger);

  if (!argv) {
    logger.info(getUsage());
    return 0;
  }

  // if (argv.help) {
  //   logger.info(getUsage());
  //   return 0;
  // }

  const dryRun: boolean = argv?.dryRun || false;
  const force: boolean = argv?.force || false;

  const fsHost = new virtualFs.ScopedHost(new NodeJsSyncHost(), normalize(process.cwd()));
  const registry = new schema.CoreSchemaRegistry(formats.standardFormats);

  const workflow = new NodeWorkflow(fsHost, {
    dryRun,
    force,
    registry,
    resolvePaths: [process.cwd(), __dirname],
  });

  registry.addPostTransform(schema.transforms.addUndefinedDefaults);
  workflow.engineHost.registerOptionsTransform(validateOptionsWithSchema(registry));

  workflow.reporter.subscribe({ next: (e) => wfHandler.handleEvent(e) });
  workflow.lifeCycle.subscribe({ next: (e) => wfHandler.handleLifecycle(e) });

  // Add prompts.
  // workflow.registry.usePromptProvider(_createPromptProvider());

  try {
    const { schematicName: schematic, options } = argv;
    await workflow
      .execute({
        allowPrivate: false,
        collection: '@gb-lerna/schematics',
        debug: false,
        logger,
        options,
        schematic,
      })
      .toPromise();

    if (dryRun) {
      logger.info(`${colors.green('DRY RUN')} Nothing done`);
    }

    if (wfHandler.nothingDone) {
      logger.info('Nothing to be done.');
    }

    return 0;
  } catch (err) {
    if (err instanceof UnsuccessfulWorkflowExecution) {
      logger.fatal('The Schematic workflow failed. See above.');
    } else {
      logger.fatal(err.stack || err.message);
    }

    return 1;
  }
}

/**
 * Get usage of the CLI tool.
 */
function getUsage(): string {
  return tags.stripIndent`
  gb-lerna repo [--packageName=@initial/package --independent] | package [--name @scope/name]

  Options:
      --dry-run           Do not output anything, but instead just show what actions would be
                          performed.

      --force             Force overwriting files that would otherwise be an error.

      --help              Show this message.

  `;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  main({ args })
    .then((exitCode) => (process.exitCode = exitCode))
    .catch((e) => {
      throw e;
    });
}
