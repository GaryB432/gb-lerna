import { tags } from '@angular-devkit/core';
import { Logger } from '@angular-devkit/core/src/logger';
import { DryRunEvent } from '@angular-devkit/schematics';
import { LifeCycleEvent } from '@angular-devkit/schematics/src/workflow';
import * as colors from 'colors/safe';

export class WorkflowHandler {
  public nothingDone = false;
  public error = false;
  private loggingQueue: string[] = [];
  public constructor(private logger: Logger) {}
  public handleEvent(event: DryRunEvent): void {
    this.loggingQueue.push(colors.yellow(event.kind));
    this.nothingDone = false;
    const eventPath = event.path.startsWith('/') ? event.path.substr(1) : event.path;
    switch (event.kind) {
      case 'error':
        this.error = true;
        const desc = event.description == 'alreadyExist' ? 'already exists' : 'does not exist';
        this.logger.error(`ERROR! ${eventPath} ${desc}.`);
        break;
      case 'update':
        this.loggingQueue.push(tags.oneLine`
        ${colors.white('UPDATE')} ${eventPath} (${event.content.length} bytes)
      `);
        break;
      case 'create':
        this.loggingQueue.push(tags.oneLine`
        ${colors.green('CREATE')} ${eventPath} (${event.content.length} bytes)
      `);
        break;
      case 'delete':
        this.loggingQueue.push(`${colors.yellow('DELETE')} ${eventPath}`);
        break;
      case 'rename':
        const eventToPath = event.to.startsWith('/') ? event.to.substr(1) : event.to;
        this.loggingQueue.push(`${colors.blue('RENAME')} ${eventPath} => ${eventToPath}`);
        break;
    }
  }
  public handleLifecycle(event: LifeCycleEvent): void {
    this.loggingQueue.push(colors.blue(event.kind));
    if (event.kind == 'workflow-end' || event.kind == 'post-tasks-start') {
      if (!this.error) {
        // Flush the log queue and clean the error state.
        this.loggingQueue.forEach((log) => this.logger.info(log));
      }
      this.loggingQueue = [];
      this.error = false;
    }
  }
}
