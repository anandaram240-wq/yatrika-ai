/**
 * @file src/prediction/uncertaintyEstimator.ts
 * @description Probabilistic uncertainty and confidence interval estimator for YatriKa AI V4.
 * Implements weighted moving averages, quantile intervals, and formal limitations metadata.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface UncertaintyInterval<T = number> {
  pointEstimate: T;
  lowerBound: T; // e.g. 10th percentile
  upperBound: T; // e.g. 90th percentile
  confidenceLevel: number; // e.g. 0.80 or 0.95
  sampleSize: number;
  variance: number;
  standardDeviation: number;
}

export interface PredictionMetadata {
  modelId: string;
  modelVersion: string;
  generatedAt: string;
  dataWindowDays: number;
  knownLimitations: string[];
}

export class UncertaintyEstimator {
  /**
   * Calculates normal approximation quantile confidence interval for a given baseline and variance.
   */
  public static calculateInterval(
    mean: number,
    stdDev: number,
    confidenceLevel: number = 0.90,
    sampleSize: number = 30
  ): UncertaintyInterval<number> {
    // Z-score lookup for typical hackathon / engineering bounds
    let zScore = 1.645; // 90%
    if (confidenceLevel >= 0.95) zScore = 1.96;
    else if (confidenceLevel <= 0.80) zScore = 1.282;

    const spread = zScore * stdDev; // Total spread of individual journey times

    return {
      pointEstimate: Math.round(mean * 10) / 10,
      lowerBound: Math.max(0, Math.round((mean - spread) * 10) / 10),
      upperBound: Math.round((mean + spread) * 10) / 10,
      confidenceLevel,
      sampleSize,
      variance: Math.round(stdDev * stdDev * 100) / 100,
      standardDeviation: Math.round(stdDev * 10) / 10,
    };
  }

  /**
   * Exponential moving average with decay weighting.
   */
  public static exponentialMovingAverage(values: number[], alpha: number = 0.3): number {
    if (values.length === 0) return 0;
    let ema = values[0];
    for (let i = 1; i < values.length; i++) {
      ema = alpha * values[i] + (1 - alpha) * ema;
    }
    return Math.round(ema * 10) / 10;
  }
}
