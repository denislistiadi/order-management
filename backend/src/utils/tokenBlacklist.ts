/**
 * In-memory Token Blacklist manager.
 * Tracks revoked access and refresh tokens to prevent replay attacks post-logout.
 */

class TokenBlacklist {
  private blacklist: Set<string> = new Set();

  /**
   * Adds a token to the revocation blacklist.
   */
  add(token: string): void {
    this.blacklist.add(token);
  }

  /**
   * Checks whether a token has been revoked.
   */
  has(token: string): boolean {
    return this.blacklist.has(token);
  }

  /**
   * Clears all revoked tokens (useful for test resets).
   */
  clear(): void {
    this.blacklist.clear();
  }
}

export const tokenBlacklist = new TokenBlacklist();
export default tokenBlacklist;
