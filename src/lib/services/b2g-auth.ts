// B2G Authentication Service - Simulates Department's OAuth2 endpoint
import { B2GAuthToken } from "../types";

const AUTH_ENDPOINT = "https://api.health.gov.au/authentication/v2/oauth2/AccessToken";

interface AuthState {
  token: B2GAuthToken | null;
}

const state: AuthState = {
  token: null,
};

function generateMockToken(): B2GAuthToken {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
  return {
    accessToken: `mock_access_token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    expiresAt,
    tokenType: "Bearer",
  };
}

export const b2gAuthService = {
  /**
   * Simulates POST https://api.health.gov.au/authentication/v2/oauth2/AccessToken
   * Returns a mock access token
   */
  async authenticate(): Promise<{ success: boolean; token?: B2GAuthToken; error?: string }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    try {
      const token = generateMockToken();
      state.token = token;
      
      console.log(`[B2G Auth] POST ${AUTH_ENDPOINT} - Token obtained, expires at ${token.expiresAt}`);
      
      return { success: true, token };
    } catch (error) {
      console.error("[B2G Auth] Authentication failed:", error);
      return { success: false, error: "Authentication failed" };
    }
  },

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    if (!state.token) return null;
    if (this.isTokenExpired()) return null;
    return state.token.accessToken;
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    if (!state.token) return true;
    return new Date(state.token.expiresAt) < new Date();
  },

  /**
   * Refresh token if needed
   */
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (!this.isTokenExpired()) return true;
    
    const result = await this.authenticate();
    return result.success;
  },

  /**
   * Clear the current token
   */
  clearToken(): void {
    state.token = null;
  },

  /**
   * Get the auth endpoint URL (for display purposes)
   */
  getAuthEndpoint(): string {
    return AUTH_ENDPOINT;
  },

  /**
   * Get current token info (for display purposes)
   */
  getTokenInfo(): { hasToken: boolean; expiresAt?: string; isExpired: boolean } {
    return {
      hasToken: !!state.token,
      expiresAt: state.token?.expiresAt,
      isExpired: this.isTokenExpired(),
    };
  },
};
