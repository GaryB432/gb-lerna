import { SchemaValidationException } from '@angular-devkit/core/src/json/schema';
import { LoggerApi } from '@angular-devkit/core/src/logger';
import { DryRunEvent } from '@angular-devkit/schematics';
import { LifeCycleEvent } from '@angular-devkit/schematics/src/workflow';
import { InvalidInputOptions } from '@angular-devkit/schematics/tools/schema-option-transform';
import * as colors from 'colors/safe';

class Message {
  constructor(
    public readonly format: (s: string) => string,
    public readonly note: string,
    public readonly text: string
  ) {}
}

export class Reporter {
  public error = false;
  private queue: Message[] = [];
  public constructor(private logger: LoggerApi, private dryRun: boolean) {}
  public getMessages(): string[] {
    const pad = new Array(10).fill(' ').join('');
    const noteLength = this.queue.reduce((a, b) => {
      return Math.max(a, b.note.length);
    }, 0);
    return this.queue.map((m) => {
      const note = m.note.concat(pad).substr(0, noteLength);
      return [colors.white('gb-lerna'), m.format(note), m.text].join(' ');
    });
  }
  public queueMessage(
    note: string,
    text: string,
    format: (s: string) => string = colors.white
  ): void {
    this.queue.push(new Message(format, note, text));
  }
  public handleEvent(event: DryRunEvent): void {
    // this.loggingQueue.push(colors.yellow(event.kind));
    const eventPath = event.path.startsWith('/') ? event.path.substr(1) : event.path;
    switch (event.kind) {
      case 'error':
        this.error = true;
        const desc = event.description == 'alreadyExist' ? 'already exists' : 'does not exist';
        this.logger.error(`ERROR! ${eventPath} ${desc}.`);
        break;
      case 'update':
        this.queueMessage('UPDATE', `${eventPath} (${event.content.length} bytes)`, colors.white);
        break;
      case 'create':
        this.queueMessage('CREATE', `${eventPath} (${event.content.length} bytes)`, colors.green);
        break;
      case 'delete':
        this.queueMessage('DELETE', eventPath, colors.yellow);
        break;
      case 'rename':
        const eventToPath = event.to.startsWith('/') ? event.to.substr(1) : event.to;
        this.queueMessage('RENAME', `${eventPath} => ${eventToPath}`, colors.blue);
        break;
    }
  }
  public handleLifecycle(event: LifeCycleEvent): void {
    if (event.kind == 'workflow-end') {
      this.complete();
    }
  }
  public handleException(e: Error): void {
    this.error = true;
    this.queueMessage('ERROR', e.message, colors.red);
    this.complete();
  }
  public complete(dryRun = this.dryRun): void {
    if (dryRun) {
      this.queueMessage('DRY RUN', 'nothing done', colors.yellow);
    }
    if (this.error) {
      this.queueMessage('ERROR', 'see above', (s: string) => colors.bgRed(colors.white(s)));
    } else {
      this.queueMessage('SUCCESS', '', (s: string) => colors.bgGreen(colors.white(s)));
    }
    this.getMessages().forEach((log) => this.logger.info(log));
    this.queue = [];
    this.error = false;
  }
}
