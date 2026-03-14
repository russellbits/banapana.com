import { spawn, execSync } from 'child_process';
import { watch, existsSync } from 'fs';
import { resolve } from 'path';

const contentDir = resolve('./content');

// Run sync once on startup
console.log('[watch-content] Running initial sync...');
try {
	execSync('node scripts/sync-content.js', { stdio: 'inherit' });
	console.log('[watch-content] Initial sync complete.');
} catch (err) {
	console.error('[watch-content] Sync failed:', err.message);
}

// Watch for changes (only if ./content directory exists)
if (existsSync(contentDir)) {
	watch(contentDir, { recursive: true }, (eventType, filename) => {
		console.log(`[watch-content] Change detected (${eventType}): ${filename}`);
		try {
			execSync('node scripts/sync-content.js', { stdio: 'inherit' });
			console.log('[watch-content] Sync complete.');
		} catch (err) {
			console.error('[watch-content] Sync failed:', err.message);
		}
	});
	console.log(`[watch-content] Watching ${contentDir} for changes...`);
} else {
	console.warn(`[watch-content] Warning: ${contentDir} does not exist — skipping file watcher.`);
}

// Spawn vite dev
const vite = spawn('npx', ['vite', 'dev', '--host', '--port', '2222'], {
	stdio: 'inherit',
	shell: true
});

vite.on('close', (code) => {
	process.exit(code ?? 0);
});

process.on('SIGINT', () => {
	vite.kill('SIGINT');
	process.exit(0);
});
