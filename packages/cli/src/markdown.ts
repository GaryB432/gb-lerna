export function tablify(headers: string[], lines: string[][]): string {
  return [
    tablifyLine(headers),
    tablifyLine(headers.map(() => '---')),
    ...lines.map(tablifyLine),
  ].join('\n');
}

export function tablifyLine(input: string[]): string {
  return ['', ...input, ''].join(' | ').slice(1, -1);
}
