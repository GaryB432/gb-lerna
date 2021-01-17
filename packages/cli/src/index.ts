#!/usr/bin/env node

// symbol polyfill must go first
import 'symbol-observable';
import { normalize, schema, tags, virtualFs } from '@angular-devkit/core';
import { createConsoleLogger, NodeJsSyncHost, ProcessOutput } from '@angular-devkit/core/node';
import { DryRunEvent, formats, UnsuccessfulWorkflowExecution } from '@angular-devkit/schematics';
import { NodeWorkflow, validateOptionsWithSchema } from '@angular-devkit/schematics/tools';
import * as colors from 'colors/safe';
import { getWorkflowInfo } from './options-utils';

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
  const logger = createConsoleLogger(false, stdout, stderr);
  const argv = getWorkflowInfo(args);

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
  let nothingDone = true;

  let loggingQueue: string[] = [];
  let error = false;

  workflow.reporter.subscribe((event: DryRunEvent) => {
    nothingDone = false;
    const eventPath = event.path.startsWith('/') ? event.path.substr(1) : event.path;

    switch (event.kind) {
      case 'error':
        error = true;
        const desc = event.description == 'alreadyExist' ? 'already exists' : 'does not exist';
        logger.error(`ERROR! ${eventPath} ${desc}.`);
        break;
      case 'update':
        loggingQueue.push(tags.oneLine`
        ${colors.white('UPDATE')} ${eventPath} (${event.content.length} bytes)
      `);
        break;
      case 'create':
        loggingQueue.push(tags.oneLine`
        ${colors.green('CREATE')} ${eventPath} (${event.content.length} bytes)
      `);
        break;
      case 'delete':
        loggingQueue.push(`${colors.yellow('DELETE')} ${eventPath}`);
        break;
      case 'rename':
        const eventToPath = event.to.startsWith('/') ? event.to.substr(1) : event.to;
        loggingQueue.push(`${colors.blue('RENAME')} ${eventPath} => ${eventToPath}`);
        break;
    }
  });

  workflow.lifeCycle.subscribe((event) => {
    if (event.kind == 'workflow-end' || event.kind == 'post-tasks-start') {
      if (!error) {
        // Flush the log queue and clean the error state.
        loggingQueue.forEach((log) => logger.info(log));
      }
      loggingQueue = [];
      error = false;
    }
  });

  // Add prompts.
  // workflow.registry.usePromptProvider(_createPromptProvider());

  try {
    const { schematicName: schematic, options } = argv;
    await workflow
      .execute({
        allowPrivate: false,
        collection: '@gb-lerna/schematics',
        debug: false,
        logger: logger,
        options,
        schematic,
      })
      .toPromise();

    if (dryRun) {
      logger.info(`${colors.green('DRY RUN')} Nothing done`);
    }

    if (nothingDone) {
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
