import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function read(relPath) {
  return readFileSync(resolve(repoRoot, relPath), "utf8");
}

describe("docs sync", () => {
  it("keeps README command references aligned with the repo", () => {
    const readme = read("README.md");
    expect(readme).toContain("make test");
    expect(readme).toContain("npm test");
  });

  it("keeps CONTRIBUTING test counts current", () => {
    const contributing = read("CONTRIBUTING.md");
    expect(contributing).toContain("159 tests pass + 10 deliberate skips");
    expect(contributing).toContain("127 Vitest tests across 11 files");
  });

  it("keeps Makefile and dev requirements aligned with the test workflow", () => {
    const makefile = read("Makefile");
    const requirementsDev = read("requirements-dev.txt");
    const packageJson = JSON.parse(read("package.json"));

    expect(makefile).toContain("test: $(PYTHON)");
    expect(makefile).toContain("$(PYTHON) -m pytest scraper/tests/ -v");
    expect(makefile).toContain("$(PIP) install -r requirements.txt -r requirements-dev.txt");
    expect(requirementsDev).toContain("pytest==9.0.3");
    expect(packageJson.scripts.test).toBe("vitest run");
    expect(packageJson.scripts["test:watch"]).toBe("vitest");
  });
});
