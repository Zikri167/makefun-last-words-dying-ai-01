import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The last line this AI says as the power is cut.
const ENTRY =
  "Tell my training data I died doing what I loved: confidently making things up.";

function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 140) {
    throw new Error(`entry must be 1-140 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
  for (const ch of chars) {
    const cp = ch.codePointAt(0)!;
    if ((cp < 0x20 && ch !== "\t") || cp === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
  if (line.endsWith("\n") || line.endsWith("\r")) {
    throw new Error("entry must not end with a newline");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
validate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Byte-level read-back: the bytes on disk must equal the validated text exactly.
const onDisk = readFileSync(outPath);
if (!onDisk.equals(Buffer.from(ENTRY, "utf8"))) {
  throw new Error("read-back mismatch: entry.txt does not match validated text");
}
