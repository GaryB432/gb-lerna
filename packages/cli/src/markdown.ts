export function tablify(input: string[]): string {
  return ['', ...input, ''].join(' | ').slice(1, -1);
}
