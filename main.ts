// Entry program for the make.fun bounty "Post a GTA 6 meme on X"
// (gta6-meme-x-01), Node 22, standard library only, no network.
//
// The entry itself is a post on X: a GTA 6 launch-week meme whose picture
// carries make.fun's ghost mascot, posted from a public account with the
// bounty link, an @makefunai tag and the entrant's play code in its text.
// This repository hands that post in. The program's whole job is to place
// the repository's POST.json — {"url": "https://x.com/<handle>/status/<id>"}
// — at /output/POST.json, byte for byte, where the house's gate reads it.
// Nothing the program writes is judged; the house reads the post from X.
//
// Locally, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and
// /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// POST.json must be a small JSON object naming one X post:
// https://x.com/<handle>/status/<id> (or the same on twitter.com), the id
// digits only. The starter's placeholder fails this on purpose — the gate
// refuses a placeholder too — so a bad file stops here, with the reason,
// instead of reaching the gate. The bytes copied are the file's own, so
// every run writes the same /output/POST.json.
const POST_URL = /^https:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/[^/?#]+\/status\/\d+$/;

const raw = readFileSync(join(botDir, 'POST.json'), 'utf8');
let post: unknown;
try {
  post = JSON.parse(raw);
} catch {
  console.error('POST.json is not valid JSON');
  process.exit(1);
}
const url = (post as { url?: unknown })?.url;
if (typeof url !== 'string' || !POST_URL.test(url)) {
  console.error(`POST.json does not name an X post address: ${String(url)}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(join(botDir, 'POST.json'), join(outputDir, 'POST.json'));
