/**
 * @file src/performance/runtimeProfiler.ts
 * @description Execution timing profiler for MapLibre 60 FPS loop, Kannada NLP, and 2-Opt TSP solver.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface RuntimeExecutionProfile {
  subsystem: 'MAPLIBRE_ANIMATION_LOOP' | 'KANNADA_MORPHOLOGY_NLP' | 'TWO_OPT_TSP_OPTIMIZER' | 'FEASIBILITY_ENGINE';
  measuredDurationMs: number;
  budgetMaxMs: number;
  isWithinBudget: boolean;
  notes: string;
}

export class RuntimeProfiler {
  /**
   * Benchmarks an execution block and verifies if it fits within the real-time frame or processing budget.
   */
  public static profileOperation<T>(
    subsystem: RuntimeExecutionProfile['subsystem'],
    budgetMaxMs: number,
    operation: () => T
  ): { result: T; profile: RuntimeExecutionProfile } {
    const start = performance.now();
    const result = operation();
    const end = performance.now();
    const measuredDurationMs = Math.round((end - start) * 100) / 100;

    return {
      result,
      profile: {
        subsystem,
        measuredDurationMs,
        budgetMaxMs,
        isWithinBudget: measuredDurationMs <= budgetMaxMs,
        notes: `Executed in ${measuredDurationMs}ms (Budget: ${budgetMaxMs}ms)`,
      },
    };
  }

  /**
   * Validates 60 FPS frame time budget (16.67ms per frame).
   */
  public static verify60FpsBudget(frameRenderMs: number): boolean {
    return frameRenderMs <= 16.67;
  }
}
