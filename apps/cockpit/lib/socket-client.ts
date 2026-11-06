import { useCockpitStore, DiffItem } from "./cockpit-store";

let socket: WebSocket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

export function getGravitonSocket(): WebSocket | null {
  return socket;
}
export const getOrbitSocket = getGravitonSocket;

export function initGravitonWebSocket(defaultUrl = "ws://localhost:9121"): () => void {
  function connect() {
    if (typeof window === "undefined") return;

    try {
      // 1. Resolve Auth Token from URL query param or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken =
        urlParams.get("token") || urlParams.get("auth") || urlParams.get("key");
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("graviton_auth_token") || localStorage.getItem("orbit_auth_token")
          : null;
      const activeToken =
        urlToken || storedToken || useCockpitStore.getState().authToken || "";

      if (urlToken && typeof window !== "undefined") {
        localStorage.setItem("graviton_auth_token", urlToken);
        localStorage.setItem("orbit_auth_token", urlToken);
        useCockpitStore.getState().setAuthToken(urlToken);
      } else if (storedToken) {
        useCockpitStore.getState().setAuthToken(storedToken);
      }

      // 2. Resolve target WebSocket URL (support custom tunnel URL via ?ws= query param)
      const customWs = urlParams.get("ws");
      const rawBase = customWs || useCockpitStore.getState().serverUrl || defaultUrl;
      useCockpitStore.getState().setServerUrl(rawBase);

      let targetUrl = rawBase;
      if (targetUrl.startsWith("https://")) {
        targetUrl = targetUrl.replace("https://", "wss://");
      } else if (targetUrl.startsWith("http://")) {
        targetUrl = targetUrl.replace("http://", "ws://");
      }

      const connectionUrl = new URL(targetUrl);
      if (activeToken) {
        connectionUrl.searchParams.set("token", activeToken);
      }

      console.log(`[Graviton Cockpit] Connecting to WebSocket: ${connectionUrl.origin}${connectionUrl.pathname}`);
      socket = new WebSocket(connectionUrl.toString());

      socket.onopen = () => {
        console.log("[Graviton Cockpit] Connected to Graviton Core WebSocket Server");
        useCockpitStore.getState().setIsConnected(true);
        useCockpitStore.getState().setAuthError(null);
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "HANDSHAKE") {
            const payload = data.payload;
            if (payload?.tunnelUrl) {
              useCockpitStore.getState().setPublicTunnelUrl(payload.tunnelUrl);
            }
            if (payload?.authRequired) {
              useCockpitStore.getState().setIsAuthRequired(true);
            }
          } else if (data.type === "AUTH_ERROR") {
            console.error("[Graviton Cockpit] Auth rejection:", data.payload);
            useCockpitStore
              .getState()
              .setAuthError(
                data.payload?.message || "Authentication failed. Provide valid auth key."
              );
            useCockpitStore.getState().setIsConnected(false);
          } else if (data.type === "DIFF_PROPOSED") {
            const payload = data.payload;
            const diffItem: DiffItem = {
              id: payload.id,
              filePath: payload.filePath,
              fileName: payload.filePath.split("/").pop() || payload.filePath,
              model: payload.model || "Claude 3.7 Sonnet",
              modelType: payload.modelType || "claude",
              action: payload.action || "MCP Intercepted Edit",
              impactScore: payload.impactScore ?? 0,
              affectedFiles: payload.affectedFiles ?? [],
              riskLevel: payload.riskLevel ?? "LOW",
              summary: payload.explanation || "AI proposed code modification via MCP",
              timestamp: "Just now",
              status: "pending",
              diffLines: [
                { type: "same", text: `// Target: ${payload.filePath}`, oldLine: 1, newLine: 1 },
                {
                  type: "remove",
                  text: payload.oldContent ? payload.oldContent.slice(0, 300) : "// empty file",
                  oldLine: 2,
                },
                {
                  type: "add",
                  text: payload.newContent ? payload.newContent.slice(0, 300) : "// new file content",
                  newLine: 2,
                },
              ],
            };
            useCockpitStore.getState().injectNewDiff(diffItem);
          } else if (data.type === "DECISION_MADE") {
            const { id, action } = data.payload;
            if (action === "approved") {
              useCockpitStore.getState().approveDiff(id);
            } else {
              useCockpitStore.getState().blockDiff(id);
            }
          } else if (data.type === "GIT_UPDATE") {
            if (data.payload?.branch) {
              useCockpitStore.getState().setGitBranch(data.payload.branch);
            }
          }
        } catch (err) {
          console.error("[Graviton Cockpit] Failed to parse WebSocket message:", err);
        }
      };

      socket.onclose = (event) => {
        useCockpitStore.getState().setIsConnected(false);
        // Do not auto-reconnect if explicitly rejected for auth failure
        if (event.code === 4001) {
          console.warn("[Graviton Cockpit] WebSocket closed due to unauthorized authentication.");
          useCockpitStore
            .getState()
            .setAuthError("Unauthorized: Invalid Graviton auth key. Please update your token.");
          return;
        }

        if (!reconnectTimer) {
          reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            connect();
          }, 3000);
        }
      };

      socket.onerror = () => {
        useCockpitStore.getState().setIsConnected(false);
      };
    } catch {
      useCockpitStore.getState().setIsConnected(false);
    }
  }

  connect();

  return () => {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (socket) {
      socket.close();
      socket = null;
    }
  };
}
export const initOrbitWebSocket = initGravitonWebSocket;

export function reconnectGravitonWebSocket(token: string, newWsUrl?: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("graviton_auth_token", token);
    localStorage.setItem("orbit_auth_token", token);
  }
  useCockpitStore.getState().setAuthToken(token);
  useCockpitStore.getState().setAuthError(null);
  if (newWsUrl) {
    useCockpitStore.getState().setServerUrl(newWsUrl);
  }
  if (socket) {
    socket.close();
  }
  initGravitonWebSocket(newWsUrl || useCockpitStore.getState().serverUrl);
}
export const reconnectOrbitWebSocket = reconnectGravitonWebSocket;

export function sendDecisionToGraviton(id: string, action: "approved" | "blocked") {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "DECISION_MADE",
        payload: { id, action },
      })
    );
  }
}
export const sendDecisionToOrbit = sendDecisionToGraviton;
