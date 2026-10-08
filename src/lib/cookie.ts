export function setAuthCookies(accessToken: string, refreshToken?: string) {
  if (typeof document !== "undefined") {
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not universally supported
    document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

    if (refreshToken) {
      // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not universally supported
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax`;
    }
  }
}

export function setAuthCookie(token: string) {
  setAuthCookies(token);
}

export function clearAuthCookies() {
  if (typeof document !== "undefined") {
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not universally supported
    document.cookie = "accessToken=; path=/; max-age=0";
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not universally supported
    document.cookie = "refreshToken=; path=/; max-age=0";
  }
}

export function clearAuthCookie() {
  clearAuthCookies();
}

export function getAuthCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
}

export function getRefreshTokenCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("refreshToken="))
    ?.split("=")[1];
}
