export const HeaderAuthKey = "User-Token";
export const HeaderNodeApiKey = "node-api-key";

export const AUTH_TOKEN_LIFETIME_DAYS = 4;
export const AUTH_COOKIE_MAX_AGE_MS =
  1000 * 60 * 60 * 24 * AUTH_TOKEN_LIFETIME_DAYS;
export const AUTH_TOKEN_EXPIRES_IN = `${AUTH_TOKEN_LIFETIME_DAYS}d`;
