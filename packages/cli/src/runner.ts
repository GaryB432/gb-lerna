import { normalize, schema, virtualFs } from '@angular-devkit/core';
import { createConsoleLogger, NodeJsSyncHost } from '@angular-devkit/core/node';
import { formats } from '@angular-devkit/schematics';
import { WorkflowExecutionContext } from '@angular-devkit/schematics/src/workflow';
import { NodeWorkflow, validateOptionsWithSchema } from '@angular-devkit/schematics/tools';
import { Reporter } from './reporter';
import { ModuleOptions, PackageOptions, RepoOptions } from './types';

type SchematicOptions = RepoOptions | PackageOptions;

export class Runner {
  private readonly logger = createConsoleLogger(false, process.stdout, process.stderr);
  private readonly workflow: NodeWorkflow;
  private readonly reporter: Reporter;

  constructor(dryRun = false, force = false) {
    const fsHost = new virtualFs.ScopedHost(new NodeJsSyncHost(), normalize(process.cwd()));
    const registry = new schema.CoreSchemaRegistry(formats.standardFormats);
    this.reporter = new Reporter(this.logger, dryRun);

    this.workflow = new NodeWorkflow(fsHost, {
      dryRun,
      force,
      registry,
      resolvePaths: [process.cwd(), __dirname],
    });
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);
    this.workflow.engineHost.registerOptionsTransform(validateOptionsWithSchema(registry));
    this.workflow.reporter.subscribe({
      next: (event) => this.reporter.handleEvent(event),
    });
    this.workflow.lifeCycle.subscribe({
      next: (event) => this.reporter.handleLifecycle(event),
    });
  }
  public getExecutionContext(
    schematic: string,
    options: SchematicOptions
  ): WorkflowExecutionContext {
    return {
      allowPrivate: false,
      collection: '@gb-lerna/schematics',
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
  public createModule(options: ModuleOptions): void {
    this.workflow.execute(this.getExecutionContext('module', options)).subscribe({
      next: () => {
        this.logger.info('module done');
      },
    });
  }
  public showMessages(): void {
    const content = Buffer.from('testing', 'utf8');
    const path = 'testing/stuff.txt';
    this.reporter.handleEvent({ content, kind: 'create', path });
    this.reporter.handleEvent({ content, kind: 'update', path });
    this.reporter.handleEvent({ kind: 'delete', path });
    this.reporter.handleEvent({ kind: 'rename', path, to: 'asdf' });
    this.reporter.complete(true);
  }
}
