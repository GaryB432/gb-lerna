import { normalize, schema, virtualFs } from '@angular-devkit/core';
import { createConsoleLogger, NodeJsSyncHost } from '@angular-devkit/core/node';
import { Logger } from '@angular-devkit/core/src/logger';
import { formats } from '@angular-devkit/schematics';
import { WorkflowExecutionContext } from '@angular-devkit/schematics/src/workflow';
import { NodeWorkflow, validateOptionsWithSchema } from '@angular-devkit/schematics/tools';
import { collection } from '.';
import { Reporter } from './reporter';
import { PackageOptions, RepoOptions } from './types';

type SchematicOptions = RepoOptions | PackageOptions;

export class Runner {
  private logger: Logger;
  private readonly workflow: NodeWorkflow;
  constructor(dryRun = false, force = false) {
    this.logger = createConsoleLogger(false, process.stdout, process.stderr);
    const fsHost = new virtualFs.ScopedHost(new NodeJsSyncHost(), normalize(process.cwd()));
    const registry = new schema.CoreSchemaRegistry(formats.standardFormats);
    const reporter = new Reporter(this.logger, dryRun);

    this.workflow = new NodeWorkflow(fsHost, {
      dryRun,
      force,
      registry,
      resolvePaths: [process.cwd(), __dirname],
    });
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);
    this.workflow.engineHost.registerOptionsTransform(validateOptionsWithSchema(registry));
    this.workflow.reporter.subscribe({
      next: (event) => reporter.handleEvent(event),
    });
    this.workflow.lifeCycle.subscribe({
      next: (evemt) => reporter.handleLifecycle(evemt),
    });
  }
  public getExecutionContext(
    schematic: string,
    options: SchematicOptions
  ): WorkflowExecutionContext {
    return {
      allowPrivate: false,
      collection,
      debug: false,
      logger: this.logger,
      options,
      schematic,
    };
  }
  public createRepository(options: RepoOptions): void {
    this.workflow.execute(this.getExecutionContext('repo', options)).subscribe({
      next: () => {
        this.logger.info('repo done');
      },
    });
  }
  public createPackage(options: PackageOptions): void {
    this.workflow.execute(this.getExecutionContext('package', options)).subscribe({
      next: () => {
        this.logger.info('package done');
      },
    });
  }
}
