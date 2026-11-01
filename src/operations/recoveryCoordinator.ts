/**
 * @file src/operations/recoveryCoordinator.ts
 * @description Fault tolerance, exponential backoff with jitter, and fallback recovery coordinator.
 * @theme Code. Create. Celebrate Kannada.
 */

import { ServiceHealthMonitor, ServiceIdentifier } from './serviceHealth';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  timeoutMs?: number;
}

export class RecoveryCoordinator {
  private inFlightRequests = new Map<string, Promise<unknown>>();

  constructor(private healthMonitor: ServiceHealthMonitor) {}

  /**
   * Execute an operation with timeout, exponential backoff, circuit breaker check, and fallback.
   */
  public async executeWithRecovery<T>(
    serviceId: ServiceIdentifier,
    requestKey: string,
    operation: () => Promise<T>,
    fallback: () => Promise<T> | T,
    options: RetryOptions = {}
  ): Promise<{ data: T; source: 'PRIMARY' | 'FALLBACK'; attempts: number; latencyMs: number }> {
    // 1. Deduplicate in-flight identical requests
    if (this.inFlightRequests.has(requestKey)) {
      const data = (await this.inFlightRequests.get(requestKey)) as T;
      return { data, source: 'PRIMARY', attempts: 1, latencyMs: 0 };
    }

    // 2. Check circuit breaker
    if (this.healthMonitor.isCircuitOpen(serviceId)) {
      const fallbackData = await fallback();
      return { data: fallbackData, source: 'FALLBACK', attempts: 0, latencyMs: 0 };
    }

    const maxRetries = options.maxRetries ?? 2;
    const initialDelayMs = options.initialDelayMs ?? 150;
    const maxDelayMs = options.maxDelayMs ?? 2000;
    const backoffFactor = options.backoffFactor ?? 2;
    const timeoutMs = options.timeoutMs ?? 3000;

    let attempt = 0;
    let delay = initialDelayMs;
    const startTime = Date.now();

    const executionPromise = (async (): Promise<{ data: T; source: 'PRIMARY' | 'FALLBACK'; attempts: number; latencyMs: number }> => {
      while (attempt <= maxRetries) {
        attempt++;
        try {
          // Timeout race
          const result = await Promise.race([
            operation(),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
            ),
          ]);

          const latencyMs = Date.now() - startTime;
          this.healthMonitor.recordSuccess(serviceId, latencyMs);
          return { data: result, source: 'PRIMARY', attempts: attempt, latencyMs };
        } catch (err: unknown) {
          const errMessage = err instanceof Error ? err.message : String(err);
          this.healthMonitor.recordFailure(serviceId, errMessage);

          if (attempt > maxRetries || this.healthMonitor.isCircuitOpen(serviceId)) {
            break;
          }

          // Exponential backoff with jitter: delay * factor + random jitter
          const jitter = Math.random() * 50;
          const waitTime = Math.min(maxDelayMs, delay + jitter);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          delay *= backoffFactor;
        }
      }

      // If all retries failed or circuit breaker tripped, execute fallback
      const fallbackData = await fallback();
      const latencyMs = Date.now() - startTime;
      return { data: fallbackData, source: 'FALLBACK', attempts: attempt, latencyMs };
    })();

    this.inFlightRequests.set(requestKey, executionPromise.then((res) => res.data));

    try {
      return await executionPromise;
    } finally {
      this.inFlightRequests.delete(requestKey);
    }
  }
}
