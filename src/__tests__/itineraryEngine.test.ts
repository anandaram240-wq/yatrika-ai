import { describe, it, expect } from 'vitest';
import { generateSmartItinerary } from '../utils/itineraryEngine';
import { DESTINATIONS } from '../data/destinations';
import { TRAVEL_PHRASES } from '../data/travelPhrases';
import { FOOD_TRAIL } from '../data/foodTrail';

describe('YatriKa AI (Problem Statement 06) Smart Itinerary Engine Verification Suite', () => {
  it('1. Verifies destination dataset integrity with non-empty entry fees and coordinates', () => {
    expect(DESTINATIONS.length).toBeGreaterThanOrEqual(13);
    DESTINATIONS.forEach((dest) => {
      expect(dest.id).toBeTruthy();
      expect(dest.name).toBeTruthy();
      expect(dest.nameKannada).toBeTruthy();
      expect(dest.district).toBeTruthy();
      expect(dest.lat).toBeGreaterThan(11.0);
      expect(dest.lat).toBeLessThan(19.0);
      expect(dest.lon).toBeGreaterThan(73.5);
      expect(dest.lon).toBeLessThan(79.0);
      expect(dest.entryFee.indianAdult).toBeGreaterThanOrEqual(0);
      expect(dest.timings).toBeTruthy();
      expect(dest.mustEatDishes.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('2. Verifies Kannada travel phrases coverage across all required tourist situations', () => {
    expect(TRAVEL_PHRASES.length).toBeGreaterThanOrEqual(20);
    const categories = new Set(TRAVEL_PHRASES.map(p => p.category));
    expect(categories.has('greeting')).toBe(true);
    expect(categories.has('transit')).toBe(true);
    expect(categories.has('food')).toBe(true);
    expect(categories.has('temple')).toBe(true);
    expect(categories.has('shopping')).toBe(true);
    expect(categories.has('emergency')).toBe(true);

    TRAVEL_PHRASES.forEach((phrase) => {
      expect(phrase.kannada).toBeTruthy();
      expect(phrase.transliteration).toBeTruthy();
      expect(phrase.englishMeaning).toBeTruthy();
      expect(phrase.audioAvailable).toBe(true);
    });
  });

  it('3. Verifies regional food trail covers all 6 cultural-geographical regions of Karnataka', () => {
    expect(FOOD_TRAIL.length).toBeGreaterThanOrEqual(10);
    const coveredRegions = new Set(FOOD_TRAIL.map(f => f.region));
    expect(coveredRegions.has('mysuru-mandya')).toBe(true);
    expect(coveredRegions.has('karavali')).toBe(true);
    expect(coveredRegions.has('malenadu')).toBe(true);
    expect(coveredRegions.has('uttara-karnataka')).toBe(true);
    expect(coveredRegions.has('kalyana-karnataka')).toBe(true);
    expect(coveredRegions.has('bengaluru-urban')).toBe(true);
  });

  it('4. Generates 3-day balanced itinerary with correct day count, slots, and distance', () => {
    const itinerary = generateSmartItinerary({
      startingCity: 'bengaluru',
      vibe: 'balanced',
      durationDays: 3,
      budgetTier: 'comfort',
      travelStyle: 'couple',
    });

    expect(itinerary.summary.totalDays).toBe(3);
    expect(itinerary.days.length).toBe(3);
    expect(itinerary.summary.totalDistanceKm).toBeGreaterThan(150);
    expect(itinerary.summary.totalBudgetEstimated).toBeGreaterThan(10000);

    // Each day has morning, afternoon, evening
    itinerary.days.forEach((day) => {
      expect(day.slots.length).toBe(3);
      expect(day.slots.some(s => s.timeSlot === 'morning')).toBe(true);
      expect(day.slots.some(s => s.timeSlot === 'afternoon')).toBe(true);
      expect(day.slots.some(s => s.timeSlot === 'evening')).toBe(true);
      expect(day.dayEstimatedCost.total).toBeGreaterThan(0);
      expect(day.lunchRecommendation.dishName).toBeTruthy();
      expect(day.lunchRecommendation.placeName).toBeTruthy();
    });
  });

  it('5. Enforces budget tier differentiation (backpacker vs comfort vs luxury)', () => {
    const backpacker = generateSmartItinerary({
      startingCity: 'bengaluru',
      vibe: 'coastal',
      durationDays: 3,
      budgetTier: 'backpacker',
      travelStyle: 'solo',
    });

    const luxury = generateSmartItinerary({
      startingCity: 'bengaluru',
      vibe: 'coastal',
      durationDays: 3,
      budgetTier: 'luxury',
      travelStyle: 'couple',
    });

    expect(luxury.summary.totalBudgetEstimated).toBeGreaterThan(backpacker.summary.totalBudgetEstimated * 3);
  });

  it('6. Verifies attached Kannada companion audio phrases and smart alerts in generated trip', () => {
    const itinerary = generateSmartItinerary({
      startingCity: 'bengaluru',
      vibe: 'heritage',
      durationDays: 3,
      budgetTier: 'comfort',
      travelStyle: 'friends',
    });

    expect(itinerary.kannadaCompanionPhrases.length).toBeGreaterThanOrEqual(3);
    expect(itinerary.smartAlerts.length).toBeGreaterThanOrEqual(1);
    expect(itinerary.smartAlerts.some(a => a.toLowerCase().includes('ghat'))).toBe(true);
  });
});
