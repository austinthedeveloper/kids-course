// Fails if app copy or catalog text claims a plan is safe (EN-012, docs/product/SAFETY.md).
// Approved wording: "passes the app's layout checks".
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'src';
const SCANNED = /\.(html|ts|json)$/;
const SKIPPED = /\.(spec|test)\.ts$/;
// "safety", "unsafe" and "certification" are fine; asserting the outcome is not.
const PROHIBITED =
  /\b(?:safe|safely|safer|safest|certified|certifies|risk[- ]?free|hazard[- ]?free|child[- ]?proof|guaranteed?)\b/gi;

const allowlist = JSON.parse(
  readFileSync(new URL('./copy-claims-allowlist.json', import.meta.url), 'utf8'),
).phrases.map((phrase) => phrase.toLowerCase());

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (SCANNED.test(name) && !SKIPPED.test(name)) yield path;
  }
}

/** Blank out allowlisted phrases so terms inside them are not reported. */
function withoutAllowed(line) {
  let result = line;
  for (const phrase of allowlist) {
    let at = result.toLowerCase().indexOf(phrase);
    while (at !== -1) {
      result = result.slice(0, at) + ' '.repeat(phrase.length) + result.slice(at + phrase.length);
      at = result.toLowerCase().indexOf(phrase, at + phrase.length);
    }
  }
  return result;
}

const problems = [];
let files = 0;
for (const file of walk(ROOT)) {
  files += 1;
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      const matches = withoutAllowed(line).match(PROHIBITED);
      if (matches) {
        problems.push(
          `${relative('.', file)}:${index + 1}: "${matches.join('", "')}" in: ${line.trim()}`,
        );
      }
    });
}

if (problems.length > 0) {
  console.error('Prohibited safety claims found. The app must never describe a plan as safe or');
  console.error(
    'certified; say it "passes the app\'s layout checks". See docs/product/SAFETY.md.\n',
  );
  console.error(problems.join('\n'));
  console.error(
    '\nIf the phrase negates the claim, add the exact phrase to tools/copy-claims-allowlist.json after review.',
  );
  process.exit(1);
}
console.log(`Copy claims: ${files} files scanned, no prohibited safety claims.`);
