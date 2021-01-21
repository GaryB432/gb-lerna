import { readFile } from 'fs';

export function greet(name: string): string {
  return `lerna says: hello to ${name}`;
}
export function add(a: number, b: number): number {
  return a + b;
}
interface LernaConfig {
  wtf: boolean;
}

function readJSON<T>(path: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    readFile(path, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(<T>JSON.parse(buffer.toString()));
      }
    });
  });
}

export async function getPackages(): Promise<string[]> {
  return ['a', 'b'];
}
