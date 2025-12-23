import { Lead } from '../models/index.js';

async function main() {
	const count = await Lead.count();
	console.log('leads_count:', count);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
