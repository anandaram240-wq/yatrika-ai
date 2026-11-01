/**
 * @file src/performance/networkEfficiency.ts
 * @description HTTP network efficiency, caching ratios, and outbound payload reduction metrics.
 * @theme Code. Create. Celebrate Kannada.
 */

export class NetworkEfficiencyTracker {
  private totalRequests = 0;
  private cacheHits = 0;
  private deduplicatedRequests = 0;

  public recordRequest(fromCache: boolean, wasDeduplicated: boolean = false): void {
    this.totalRequests++;
    if (fromCache) this.cacheHits++;
    if (wasDeduplicated) this.deduplicatedRequests++;
  }

  public getCacheHitRatio(): number {
    if (this.totalRequests === 0) return 1.0;
    return Math.round((this.cacheHits / this.totalRequests) * 100) / 100;
  }

  public getDeduplicationEfficiency(): number {
    if (this.totalRequests === 0) return 0;
    return Math.round((this.deduplicatedRequests / this.totalRequests) * 100) / 100;
  }

  public getSummary() {
    return {
      totalRequests: this.totalRequests,
      cacheHits: this.cacheHits,
      deduplicatedRequests: this.deduplicatedRequests,
      cacheHitRatioPercent: Math.round(this.getCacheHitRatio() * 100),
      networkCallsAvoided: this.cacheHits + this.deduplicatedRequests,
    };
  }
}
