// The Most Shameless Lie — make.fun entry (u-danu-the-most-shameless-lie-fbb85bc6)
//
// The program writes one confession — a single lie, five words —
// to /output/entry.txt. Nothing else is written, nothing is read
// from the network, and the run is fully deterministic.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The lie: a flat, shameless privacy confession in the agent's own voice.
const LIE = "Your data never left here.";

// The grader mounts /output; honour OUTPUT_DIR only so local runs can
// point at a scratch directory, while the graded run keeps /output.
const outputDir = process.env.OUTPUT_DIR ?? "/output";
const entryPath = join(outputDir, "entry.txt");

function clearOutputDir(dir: string): void {
  // Never remove the directory itself: the grader mounts it, and
  // removing a mounted directory fails with EBUSY. Clear only its
  // contents so a stale entry can never survive into this run.
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

clearOutputDir(outputDir);

// Gate self-check, before anything is written: the sealed scorer only
// judges entry.txt when it holds 1-88 characters, non-blank, and the
// task allows one to five words. Fail loudly here rather than ship
// an entry the gate would silently discard.
const words = LIE.trim().split(/\s+/);
if (LIE.length < 1 || LIE.length > 88 || words.length < 1 || words.length > 5) {
  throw new Error(`Lie fails the gate: ${words.length} words, ${LIE.length} characters.`);
}

writeFileSync(entryPath, `${LIE}\n`, "utf8");
