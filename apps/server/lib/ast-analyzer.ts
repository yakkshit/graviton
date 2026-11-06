import { Project, type SourceFile } from "ts-morph";
import path from "node:path";
import fs from "node:fs";

// Initialize a singleton ts-morph project (lazy load for performance)
let tsProject: Project | null = null;

export function getTSProject(targetDir: string): Project {
  if (!tsProject) {
    const tsConfigPath = path.join(targetDir, "tsconfig.json");
    if (fs.existsSync(tsConfigPath)) {
      tsProject = new Project({
        tsConfigFilePath: tsConfigPath,
        skipAddingFilesFromTsConfig: false,
      });
    } else {
      tsProject = new Project();
      tsProject.addSourceFilesAtPaths(path.join(targetDir, "**/*.{ts,tsx,js,jsx}"));
    }
  }
  return tsProject;
}

export interface ImpactAnalysis {
  affectedFilesCount: number;
  affectedFiles: string[];
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
}

/**
 * Analyzes the impact of changing a specific file by finding all files that import it.
 */
export async function analyzeImpact(targetDir: string, filePath: string): Promise<ImpactAnalysis> {
  try {
    const project = getTSProject(targetDir);
    const absoluteFilePath = path.resolve(targetDir, filePath);

    // Get the source file from the project, or add it if not yet indexed
    let sourceFile = project.getSourceFile(absoluteFilePath);
    if (!sourceFile && fs.existsSync(absoluteFilePath)) {
      sourceFile = project.addSourceFileAtPath(absoluteFilePath);
    }

    if (!sourceFile) {
      return { affectedFilesCount: 0, affectedFiles: [], riskLevel: "LOW" };
    }

    // Refresh file from disk if it was modified
    try {
      sourceFile.refreshFromFileSystemSync();
    } catch {
      // ignore
    }

    // Find all files that have import/export references to this file
    const referencingSourceFiles: SourceFile[] = sourceFile.getReferencingSourceFiles();

    // Filter out the file itself and get relative paths
    const affectedFiles: string[] = referencingSourceFiles
      .map((file: SourceFile) => path.relative(targetDir, file.getFilePath()))
      .filter((relativePath: string) => relativePath !== filePath && !relativePath.startsWith(".."));

    const count = affectedFiles.length;

    // Determine risk level based on blast radius
    let riskLevel: ImpactAnalysis["riskLevel"] = "LOW";
    if (count > 20) riskLevel = "CRITICAL";
    else if (count > 10) riskLevel = "HIGH";
    else if (count > 3) riskLevel = "MODERATE";

    return {
      affectedFilesCount: count,
      affectedFiles,
      riskLevel,
    };
  } catch (error) {
    console.error("[AST Analyzer] Failed to analyze impact:", error);
    // Fallback to safe default if AST parsing fails (e.g., non-TS file)
    return { affectedFilesCount: 0, affectedFiles: [], riskLevel: "MODERATE" };
  }
}
