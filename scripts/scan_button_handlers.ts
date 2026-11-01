import * as fs from 'fs';
import * as path from 'path';

function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (full.endsWith('.tsx') || full.endsWith('.jsx')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('./src');
let totalButtons = 0;
let buttonsWithoutOnClick: { file: string; line: number; snippet: string }[] = [];

files.forEach((f) => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  const regex = /<button\b([^>]*)>/gs;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    totalButtons++;
    const attrs = match[1];
    const hasOnClick = /onClick\s*=/.test(attrs);
    const isSubmit = /type\s*=\s*['"`]submit['"`]/.test(attrs);

    if (!hasOnClick && !isSubmit) {
      // Find line number
      const offset = match.index;
      const lineNum = content.slice(0, offset).split('\n').length;
      buttonsWithoutOnClick.push({
        file: f,
        line: lineNum,
        snippet: match[0].replace(/\s+/g, ' ').slice(0, 120),
      });
    }
  }
});

console.log('Total button elements found in codebase:', totalButtons);
console.log('Buttons without onClick and not type="submit":', buttonsWithoutOnClick.length);
buttonsWithoutOnClick.forEach((b) => {
  console.log(`- ${b.file}:${b.line} -> ${b.snippet}`);
});
