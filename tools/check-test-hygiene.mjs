// Fails if a committed test is skipped or focused (EN-001, AGENTS.md).
// A skipped test is a silently disabled check; for safety fixtures that is never acceptable.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['src', 'e2e'];
const TEST_FILE = /\.(spec|test)\.ts$/;
const FORBIDDEN = [
  /\b(?:describe|it|test)(?:\.\w+)*\.(?:skip|only|todo|fixme|fails)\b/,
  /\b(?:xit|xdescribe|xtest|fit|fdescribe)\s*\(/,
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (TEST_FILE.test(name)) yield path;
  }
}

const problems = [];
let files = 0;
for (const root of ROOTS) {
  try {
    statSync(root);
  } catch {
    continue;
  }
  for (const file of walk(root)) {
    files += 1;
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (FORBIDDEN.some((pattern) => pattern.test(line))) {
          problems.push(`${relative('.', file)}:${index + 1}: ${line.trim()}`);
        }
      });
  }
}

if (problems.length > 0) {
  console.error('Skipped or focused tests are not allowed (see AGENTS.md):\n');
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Test hygiene: ${files} test files, none skipped or focused.`);
