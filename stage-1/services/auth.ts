/**
 * Token Management
 * Stores and retrieves the Bearer token from localStorage
 */

const AUTH_API_URL = "/evaluation-service/auth";

interface AuthResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}

const AUTH_PAYLOAD = {
  email: "shaikaakheel9@gmail.com",
  name: "shaik aakheel",
  rollNo: "29627",
  accessCode: "juFphv",
  clientID: "4ef35bfd-29d4-4540-82a1-e7a3f93fa2b2",
  clientSecret: "CQsAMUZbKrbUTArw",
};

export function setAuthToken(token: string): void {
  localStorage.setItem("token", token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

export function clearAuthToken(): void {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export async function initializeAuthToken(): Promise<string> {
  const response = await fetch(AUTH_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(AUTH_PAYLOAD),
  });

  if (!response.ok) {
    throw new Error(`Auth request failed with status ${response.status}`);
  }

  const data = (await response.json()) as AuthResponse;
  setAuthToken(data.access_token);
  return data.access_token;
}
