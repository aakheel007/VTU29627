export type LogStack = "frontend";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export type LogPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

const LOG_API_URL = "/evaluation-service/logs";

export async function Log(
  stack: LogStack,
  level: LogLevel,
  packageName: LogPackage,
  message: string
): Promise<void> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      // Token not available yet - fail silently (don't crash the app)
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 5000);

    try {
      await fetch(LOG_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stack, level, package: packageName, message }),
        signal: controller.signal,
      });
    } finally {
      window.clearTimeout(timeoutId);
    }
  } catch {
    // Logging must never crash the app. Intentionally swallowed.
  }
}
