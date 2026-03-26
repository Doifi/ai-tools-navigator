export const ADMIN_SESSION_COOKIE = "ai_tools_admin_session";

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD environment variable.");
  }

  return password;
}

export async function createAdminSessionValue() {
  return sha256(getAdminPassword());
}

export async function verifyAdminPassword(password: string) {
  return password === getAdminPassword();
}

export async function verifyAdminSession(sessionValue?: string | null) {
  if (!sessionValue) {
    return false;
  }

  return sessionValue === (await createAdminSessionValue());
}
