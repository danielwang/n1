import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const config = JSON.parse(readFileSync('components.json', 'utf8'));
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const failures = [];

if (config.iconLibrary !== 'solar') failures.push('components.json must select solar.');
if (pkg.dependencies?.['lucide-react'] || pkg.devDependencies?.['lucide-react']) {
  failures.push('Remove the lucide-react dependency.');
}

function checkDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) checkDirectory(path);
    else if (/\.[cm]?[jt]sx?$/.test(entry.name) && /\bfrom\s*['"]lucide-react['"]|\bimport\s*\(\s*['"]lucide-react['"]\s*\)/.test(readFileSync(path, 'utf8'))) {
      failures.push(`${path} imports lucide-react.`);
    }
  }
}

checkDirectory('src');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Solar icon convention checked; no Lucide imports or dependency found.');
}
