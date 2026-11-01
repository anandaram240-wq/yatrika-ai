/**
 * @file src/offline/storageIntegrity.ts
 * @description Storage quota management, checksum verification, and cache corruption recovery.
 * @theme Code. Create. Celebrate Kannada.
 */

export class StorageIntegrityManager {
  /**
   * Generates a deterministic hex checksum for arbitrary data objects.
   */
  public static computeChecksum(data: unknown): string {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  /**
   * Validates if cached payload matches stored checksum.
   */
  public static verifyIntegrity(payload: unknown, expectedChecksum: string): boolean {
    const computed = this.computeChecksum(payload);
    return computed === expectedChecksum;
  }

  /**
   * Estimates storage size in Kilobytes.
   */
  public static estimateSizeKb(data: unknown): number {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    return Math.round((new TextEncoder().encode(str).length / 1024) * 10) / 10;
  }
}
