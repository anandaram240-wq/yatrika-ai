/**
 * @file src/__tests__/predictiveIntelligence.test.ts
 * @description Unit tests for YatriKa AI V4 Predictive Intelligence Engine.
 */

import { describe, it, expect } from 'vitest';
import { TravelTimePredictor } from '../prediction/travelTimePredictor';
import { WeatherRiskForecast } from '../prediction/weatherRiskForecast';
import { DestinationDemandForecaster } from '../prediction/destinationDemand';
import { UncertaintyEstimator } from '../prediction/uncertaintyEstimator';

describe('Predictive Travel Intelligence (Phase 2)', () => {
  it('predicts highway travel time with quantile confidence interval and peak hour slowdowns', () => {
    // 200 km plain highway trip leaving at 8:00 AM on weekend
    const prediction = TravelTimePredictor.predictDuration({
      baseDistanceKm: 200,
      isGhatSection: false,
      departureHour: 8,
      isWeekend: true,
      currentPrecipitationMm: 0,
    });

    expect(prediction.nominalDurationMinutes).toBeGreaterThan(150);
    expect(prediction.peakHourSurchargeMinutes).toBeGreaterThan(0);
    expect(prediction.expectedDurationMinutes).toBeGreaterThan(prediction.nominalDurationMinutes);

    // Uncertainty interval sanity check
    expect(prediction.interval.lowerBound).toBeLessThan(prediction.expectedDurationMinutes);
    expect(prediction.interval.upperBound).toBeGreaterThan(prediction.expectedDurationMinutes);
    expect(prediction.interval.confidenceLevel).toBe(0.90);
    expect(prediction.metadata.modelId).toBe('yatrika-probabilistic-eta-v4.1');
  });

  it('accounts for Western Ghats curvature sinuosity and monsoon rain slowdowns', () => {
    // 60 km winding ghat stretch (Charmadi or Agumbe) with heavy rain
    const ghatPrediction = TravelTimePredictor.predictDuration({
      baseDistanceKm: 60,
      isGhatSection: true,
      sinuosityFactor: 1.35,
      departureHour: 14,
      isWeekend: false,
      currentPrecipitationMm: 25,
    });

    expect(ghatPrediction.terrainSlowdownMinutes).toBeGreaterThan(0);
    // Standard deviation and spread should reflect high ghat uncertainty
    expect(ghatPrediction.interval.standardDeviation).toBeGreaterThan(15);
    expect(ghatPrediction.expectedDurationMinutes).toBeGreaterThan(120);
  });

  it('assesses weather disruption risks and ghat visibility accurately', () => {
    const calmWeather = WeatherRiskForecast.assessRisk({
      precipMm: 0,
      windKmh: 12,
      isGhatCorridor: false,
      timeOfDayHour: 10,
      month: 1,
    });
    expect(calmWeather.riskLevel).toBe('LOW');
    expect(calmWeather.disruptionProbability).toBeLessThan(0.15);
    expect(calmWeather.scenicVisibilityScore).toBeGreaterThan(80);

    const stormWeather = WeatherRiskForecast.assessRisk({
      precipMm: 65,
      windKmh: 60,
      elevationMeters: 1400,
      isGhatCorridor: true,
      timeOfDayHour: 19,
      month: 7, // Peak monsoon
    });
    expect(stormWeather.riskLevel).toBe('CRITICAL');
    expect(stormWeather.monsoonAdvisoryLevel).toBe('RED');
    expect(stormWeather.isGhatMistLikely).toBe(true);
    expect(stormWeather.scenicVisibilityScore).toBeLessThan(35);
  });

  it('forecasts seasonal destination demand and peak cultural temple rush', () => {
    // Temple on Sunday in peak festival season
    const sundayDate = new Date('2026-10-18T10:00:00Z'); // Sunday during Dasara month (October)
    const demand = DestinationDemandForecaster.forecastDemand(
      'poi-chamundeshwari-mysuru',
      'temple',
      sundayDate,
      'Old Mysuru'
    );

    expect(demand.crowdLevel).toBe('EXTREME_SURGE');
    expect(demand.isSpecialFestivalDay).toBe(true);
    expect(demand.festivalLabel).toContain('ದಸರಾ');
    expect(demand.estimatedDarshanWaitMinutes).toBeGreaterThan(90);
    expect(demand.recommendedTimeWindow).toContain('06:00 - 08:00');
  });

  it('calculates exponential moving averages and quantile bounds accurately', () => {
    const stream = [100, 110, 105, 120, 130];
    const ema = UncertaintyEstimator.exponentialMovingAverage(stream, 0.4);
    expect(ema).toBeGreaterThan(110);
    expect(ema).toBeLessThan(130);

    const interval = UncertaintyEstimator.calculateInterval(100, 10, 0.95);
    expect(interval.lowerBound).toBeLessThan(90);
    expect(interval.upperBound).toBeGreaterThan(110);
  });
});
