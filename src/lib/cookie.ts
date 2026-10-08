export function setAuthCookie(token: string) {
  if (typeof document !== "undefined") {
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not universally supported
    document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export function clearAuthCookie() {
  if (typeof document !== "undefined") {
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not universally supported
    document.cookie = "accessToken=; path=/; max-age=0";
  }
}

export function getAuthCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
}
