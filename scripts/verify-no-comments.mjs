import { execFileSync } from "node:child_process";
import { extname } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import postcss from "postcss";
import ts from "typescript";

const trackedFiles = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard"],
  { encoding: "utf8" },
)
  .split("\n")
  .filter((file) => file.length > 0 && existsSync(file));
const scriptExtensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const lineCommentFiles = new Set([".gitignore", ".npmrc", ".yml", ".yaml"]);
const violations = [];

function findScriptComments(file, source) {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    file.endsWith("x") ? ts.LanguageVariant.JSX : ts.LanguageVariant.Standard,
    source,
  );
  let token = scanner.scan();
  while (token !== ts.SyntaxKind.EndOfFileToken) {
    if (
      token === ts.SyntaxKind.SingleLineCommentTrivia ||
      token === ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      violations.push(`${file}:${source.slice(0, scanner.getTokenPos()).split("\n").length}`);
    }
    token = scanner.scan();
  }
}

function findCssComments(file, source) {
  postcss.parse(source, { from: file }).walkComments((comment) => {
    violations.push(`${file}:${comment.source?.start?.line ?? 1}`);
  });
}

for (const file of trackedFiles) {
  const extension = extname(file);
  if (!scriptExtensions.has(extension) && extension !== ".css" && extension !== ".html" && !lineCommentFiles.has(extension) && !lineCommentFiles.has(file)) {
    continue;
  }

  const source = readFileSync(file, "utf8");
  if (scriptExtensions.has(extension)) {
    findScriptComments(file, source);
  } else if (extension === ".css") {
    findCssComments(file, source);
  } else if (extension === ".html") {
    source.split("\n").forEach((line, index) => {
      if (line.includes("<!--") || line.includes("-->")) {
        violations.push(`${file}:${index + 1}`);
      }
    });
  } else {
    source.split("\n").forEach((line, index) => {
      if (/^\s*#/.test(line)) {
        violations.push(`${file}:${index + 1}`);
      }
    });
  }
}

if (violations.length > 0) {
  throw new Error(`Code comments found:\n${violations.join("\n")}`);
}
