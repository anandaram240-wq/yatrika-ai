// scripts/audit-repo.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkgPath = path.join(root, 'package.json');
const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : {};
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

const report = {
  timestamp: new Date().toISOString(),
  versions: {
    react: deps['react'] || 'NOT_FOUND',
    vite: deps['vite'] || 'NOT_FOUND',
    typescript: deps['typescript'] || 'NOT_FOUND',
    tailwindcss: deps['tailwindcss'] || 'NOT_FOUND',
    maplibreGl: deps['maplibre-gl'] || 'NOT_FOUND',
    cesium: deps['cesium'] || 'NOT_FOUND',
    firebase: deps['firebase'] || 'NOT_FOUND',
    router: deps['react-router-dom'] || deps['@tanstack/react-router'] || 'NOT_FOUND',
  },
  uiLibraries: Object.keys(deps).filter((k) =>
    /(@radix-ui|@mui|antd|@chakra-ui|shadcn|lucide-react|framer-motion|gsap)/.test(k)
  ),
  deadControls: [],
};

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', 'dist', '.git'].includes(entry.name)) {
      scanDir(fullPath);
    } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (
          /onClick=\{\(\)\s*=>\s*\{\s*\}\}/.test(line) ||
          /href=["']#["']/.test(line) ||
          /TODO|FIXME|console\.log\(["']clicked/i.test(line)
        ) {
          report.deadControls.push({
            file: path.relative(root, fullPath),
            line: idx + 1,
            snippet: line.trim(),
          });
        }
      });
    }
  }
}

scanDir(path.join(root, 'src'));
fs.writeFileSync('AUDIT_REPORT.json', JSON.stringify(report, null, 2));
console.log('Audit complete. Wrote AUDIT_REPORT.json:', JSON.stringify(report, null, 2));
