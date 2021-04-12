import { JsonObject } from '@angular-devkit/core';
import { Logger, LoggerApi, LogLevel } from '@angular-devkit/core/src/logger';
import { Reporter } from '../src/reporter';

class MockLogger implements LoggerApi {
  public count = 0;
  createChild(_name: string): Logger {
    throw new Error('not implemented');
  }
  debug(_message: string, _metadata?: JsonObject): void {
    this.count++;
  }
  error(_message: string, _metadata?: JsonObject): void {
    this.count++;
  }
  fatal(_message: string, _metadata?: JsonObject): void {
    this.count++;
  }
  info(_message: string, _metadata?: JsonObject): void {
    this.count++;
  }
  log(_level: LogLevel, _message: string, _metadata?: JsonObject): void {
    this.count++;
  }
  warn(_message: string, _metadata?: JsonObject): void {
    this.count++;
  }
}

describe('Reporter', () => {
  let logger: LoggerApi;
  let sut: Reporter;
  const content = Buffer.from('testing', 'utf8');
  const path = 'testing/stuff.txt';
  beforeEach(() => {
    logger = new MockLogger();
    sut = new Reporter(logger, false);
  });
  it('queues messages', () => {
    logger.info = jest.fn();
    sut.handleEvent({ kind: 'create', path, content });
    expect(logger.info).not.toHaveBeenCalled();
  });
  it('logs on end', () => {
    logger.info = jest.fn();
    sut.handleEvent({ kind: 'create', path, content });
    sut.handleLifecycle({ kind: 'workflow-end' });
    expect(logger.info).not.toHaveBeenCalledTimes(1);
  });
});
