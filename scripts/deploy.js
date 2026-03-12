import 'dotenv/config';
import { existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
	host: 'banapana.com',
	user: process.env.FTP_USER,
	pass: process.env.FTP_PASSWORD,
	remoteDir: '/public_html'
};

if (!config.user || !config.pass) {
	console.error('FTP credentials not found.');
	process.exit(1);
}

async function deploy() {
	const buildDir = path.resolve('./build');

	if (!existsSync(buildDir)) {
		console.error('Build directory not found. Run npm run build first.');
		process.exit(1);
	}

	console.log('Deploying to banapana.com...');

	const files = getAllFiles(buildDir);

	// Build lftp script
	let lftpCommands = `set ssl:verify-certificate false
set ftp:ssl-allow yes
open -u "${config.user},${config.pass}" ftps://${config.host}
cd ${config.remoteDir}
`;

	// Add all file uploads
	for (const file of files) {
		const localPath = file;
		const relativePath = path.relative(buildDir, localPath);

		// Create directory structure in lftp format
		const parts = relativePath.split('/');
		let currentDir = config.remoteDir;
		for (let i = 0; i < parts.length - 1; i++) {
			currentDir += '/' + parts[i];
			lftpCommands += `mkdir -p ${currentDir}\n`;
		}

		lftpCommands += `put "${localPath}" -o ${config.remoteDir}/${relativePath}\n`;
	}

	lftpCommands += `bye\n`;

	// Write script to temp file
	const scriptPath = '/tmp/lftp-script.txt';
	writeFileSync(scriptPath, lftpCommands);

	// Execute lftp
	execSync(`lftp -f ${scriptPath}`, { stdio: 'inherit' });

	console.log('Deployment complete');
}

function getAllFiles(dir) {
	const files = [];
	const items = readdirSync(dir);

	for (const item of items) {
		const fullPath = path.join(dir, item);
		if (statSync(fullPath).isDirectory()) {
			files.push(...getAllFiles(fullPath));
		} else {
			files.push(fullPath);
		}
	}

	return files;
}

deploy().catch(console.error);
