import fs from "node:fs/promises";
import path from "node:path";
import simpleGit, { SimpleGit } from "simple-git";

export class GitEngine {
  private repoRoot: string;
  private git: SimpleGit;
  private initialized = false;

  constructor(targetPath?: string) {
    this.repoRoot = path.resolve(targetPath || process.cwd());
    this.git = simpleGit(this.repoRoot);
  }

  get rootPath(): string {
    return this.repoRoot;
  }

  /**
   * Initializes the repository.
   * If not a git repo, initializes git and creates a baseline commit.
   */
  async initRepo(): Promise<void> {
    const isRepo = await this.git.checkIsRepo();
    if (!isRepo) {
      await this.git.init();
      // Add initial files if any exist
      await this.git.add(".");
      await this.git.commit("graviton(init): baseline repository state");
    }
    this.initialized = true;
  }

  /**
   * Safe path resolution to prevent directory traversal
   */
  private resolveSafePath(filePath: string): string {
    const resolved = path.resolve(this.repoRoot, filePath);
    if (!resolved.startsWith(this.repoRoot)) {
      throw new Error(`Access denied: path '${filePath}' is outside repository boundaries.`);
    }
    return resolved;
  }

  /**
   * Read file content from repository
   */
  async readFile(filePath: string): Promise<string> {
    const fullPath = this.resolveSafePath(filePath);
    return await fs.readFile(fullPath, "utf-8");
  }

  /**
   * Creates an atomic Git commit snapshot before applying an AI patch.
   */
  async createSnapshot(message: string): Promise<string> {
    try {
      await this.git.add(".");
      const commitResult = await this.git.commit(`graviton(snapshot): ${message}`, {
        "--allow-empty": null,
      });
      return commitResult.commit || (await this.git.revparse(["HEAD"]));
    } catch {
      return await this.git.revparse(["HEAD"]);
    }
  }

  /**
   * Rollback working directory and index to a specific commit hash.
   */
  async rollbackTo(hash: string): Promise<void> {
    await this.git.reset(["--hard", hash]);
    await this.git.clean("f", ["-d"]);
  }

  /**
   * Writes the approved content to disk safely.
   */
  async applyDiff(filePath: string, newContent: string): Promise<void> {
    const fullPath = this.resolveSafePath(filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, newContent, "utf-8");
  }

  /**
   * Returns current Git status & branch telemetry.
   */
  async getGitStatus() {
    const status = await this.git.status();
    let lastCommit = "initial";
    try {
      lastCommit = (await this.git.revparse(["--short", "HEAD"])).trim();
    } catch {
      // empty repo
    }

    return {
      branch: status.current || "main",
      clean: status.isClean(),
      modified: status.modified,
      not_added: status.not_added,
      lastCommit,
    };
  }
}

