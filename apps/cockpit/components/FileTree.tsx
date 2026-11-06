"use client";

import React, { useState, useEffect } from "react";
import { useCockpitStore, FileNode } from "@/lib/cockpit-store";
import { useAccentTheme } from "@/components/theme-provider";
import { FileTreeSkeleton } from "@repo/ui/skeleton";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

const INITIAL_TREE: FileNode[] = [
  {
    id: "dir-src",
    name: "src",
    path: "src",
    type: "directory",
    children: [
      {
        id: "dir-auth",
        name: "auth",
        path: "src/auth",
        type: "directory",
        children: [
          {
            id: "file-session",
            name: "session.ts",
            path: "src/auth/session.ts",
            type: "file",
            hasPendingDiff: true,
            diffStatus: "pending",
          },
          {
            id: "file-jwt",
            name: "jwt.ts",
            path: "src/auth/jwt.ts",
            type: "file",
          },
        ],
      },
      {
        id: "dir-api",
        name: "api",
        path: "src/api",
        type: "directory",
        children: [
          {
            id: "dir-routes",
            name: "routes",
            path: "src/api/routes",
            type: "directory",
            children: [
              {
                id: "file-billing",
                name: "billing.ts",
                path: "src/api/routes/billing.ts",
                type: "file",
                hasPendingDiff: true,
                diffStatus: "pending",
              },
            ],
          },
        ],
      },
      {
        id: "dir-orchestrator",
        name: "orchestrator",
        path: "src/orchestrator",
        type: "directory",
        children: [
          {
            id: "file-executor",
            name: "executor.ts",
            path: "src/orchestrator/executor.ts",
            type: "file",
            hasPendingDiff: true,
            diffStatus: "approved",
          },
          {
            id: "file-mcp-gateway",
            name: "mcp-gateway.ts",
            path: "src/orchestrator/mcp-gateway.ts",
            type: "file",
          },
        ],
      },
      {
        id: "file-index",
        name: "index.ts",
        path: "src/index.ts",
        type: "file",
      },
    ],
  },
  {
    id: "file-package",
    name: "package.json",
    path: "package.json",
    type: "file",
  },
  {
    id: "file-config",
    name: "graviton.config.json",
    path: "graviton.config.json",
    type: "file",
  },
];

export function FileTree() {
  const { currentAccent } = useAccentTheme();
  const {
    activeFilePath,
    setActiveFilePath,
    pendingDiffs,
    activeFilter,
    setActiveFilter,
    isConnected,
  } = useCockpitStore();

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [openDirs, setOpenDirs] = useState<Record<string, boolean>>({
    "src": true,
    "src/auth": true,
    "src/api": true,
    "src/api/routes": true,
    "src/orchestrator": true,
  });

  const toggleDir = (path: string) => {
    setOpenDirs((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const getDiffStatusForPath = (path: string) => {
    const diff = pendingDiffs.find((d) => d.filePath === path);
    return diff ? diff.status : undefined;
  };

  const renderNode = (node: FileNode, level = 0) => {
    const isDir = node.type === "directory";
    const isOpen = openDirs[node.path] ?? false;
    const isSelected = activeFilePath === node.path;
    const diffStatus = getDiffStatusForPath(node.path);

    if (
      searchQuery &&
      !node.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !isDir
    ) {
      return null;
    }

    if (
      !isDir &&
      activeFilter !== "all" &&
      diffStatus !== activeFilter
    ) {
      return null;
    }

    return (
      <div key={node.id} className="select-none font-mono text-xs">
        <div
          onClick={() => {
            if (isDir) {
              toggleDir(node.path);
            } else {
              setActiveFilePath(node.path);
            }
          }}
          className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-150 ${
            isSelected
              ? "bg-white/8 text-white font-medium"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-white/3"
          }`}
          style={{
            paddingLeft: `${level * 14 + 8}px`,
            borderLeft: isSelected
              ? `2px solid ${currentAccent.hex}`
              : "2px solid transparent",
          }}
        >
          <div className="flex items-center gap-1.5 truncate">
            {isDir ? (
              <>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                )}
                {isOpen ? (
                  <FolderOpen className="w-3.5 h-3.5 text-neutral-300" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-neutral-400" />
                )}
              </>
            ) : (
              <>
                <span className="w-3.5" />
                {node.name.endsWith(".json") ? (
                  <FileJson className="w-3.5 h-3.5 text-amber-400/80" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 text-blue-400/80" />
                )}
              </>
            )}
            <span className="truncate">{node.name}</span>
          </div>

          {/* Status pill for modified/diffed files */}
          {diffStatus && (
            <div className="ml-2 shrink-0">
              {diffStatus === "pending" && (
                <span
                  className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `rgba(${currentAccent.rgb}, 0.15)`,
                    color: currentAccent.hex,
                  }}
                >
                  DIFF
                </span>
              )}
              {diffStatus === "approved" && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 uppercase">
                  OK
                </span>
              )}
              {diffStatus === "blocked" && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500/15 text-red-400 uppercase">
                  BLOCKED
                </span>
              )}
            </div>
          )}
        </div>

        {isDir && isOpen && node.children && (
          <div>{node.children.map((child) => renderNode(child, level + 1))}</div>
        )}
      </div>
    );
  };

  if (isInitializing && !isConnected) {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-[#08080c]/90 border-r border-white/10 select-none">
        <FileTreeSkeleton rows={10} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#08080c]/90 border-r border-white/10 select-none">
      <div className="p-3 space-y-3">
        {/* Title */}
        <div className="flex items-center justify-between text-xs font-mono uppercase text-neutral-400 tracking-wider font-semibold px-1">
          <span>Repository Explorer</span>
          <span className="text-[10px] text-neutral-600">AST Indexed</span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-white/10 bg-black/50 text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-[10px] font-mono border-b border-white/5 pb-2">
          {(["all", "pending", "approved", "blocked"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                activeFilter === filter
                  ? "bg-white/10 text-white font-semibold"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* File Tree List */}
        <div className="space-y-0.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          {INITIAL_TREE.map((node) => renderNode(node, 0))}
        </div>
      </div>

      {/* Tree Bottom Telemetry */}
      <div className="p-3 border-t border-white/10 bg-[#060609] text-[11px] font-mono text-neutral-400 space-y-1">
        <div className="flex justify-between">
          <span>AST Cache:</span>
          <span className="text-emerald-400">HOT (3.2ms)</span>
        </div>
        <div className="flex justify-between">
          <span>File Watcher:</span>
          <span className="text-white">Active (Chokidar)</span>
        </div>
      </div>
    </div>
  );
}

