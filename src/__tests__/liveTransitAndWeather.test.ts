// src/__tests__/liveTransitAndWeather.test.ts
import { describe, it, expect } from 'vitest';
import {
  KARNATAKA_TRAIN_SCHEDULES,
  KSRTC_BUS_SERVICES,
  getTrainsForOrigin,
  getBusesForOrigin,
  getNextDeparture,
  isRunningToday,
} from '../services/liveTransitService';
import { WIKI_ARTICLE_MAP } from '../services/livePoiEnrichmentService';

describe('Real-Time Transit Intelligence Service', () => {
  it('contains verified Vande Bharat, Shatabdi, and Overnight sleeper trains', () => {
    expect(KARNATAKA_TRAIN_SCHEDULES.length).toBeGreaterThanOrEqual(6);

    const vandeBharat = KARNATAKA_TRAIN_SCHEDULES.find((t) => t.trainType === 'vande_bharat');
    expect(vandeBharat).toBeDefined();
    expect(vandeBharat?.trainName).toContain('Vande Bharat');
    expect(vandeBharat?.bookingUrl).toContain('irctc.co.in');

    const hampiExp = KARNATAKA_TRAIN_SCHEDULES.find((t) => t.id === 'hampi-exp-overnight');
    expect(hampiExp).toBeDefined();
    expect(hampiExp?.savesHotelNight).toBe(true);
    expect(hampiExp?.hotelSavingInr).toBeGreaterThanOrEqual(2000);
  });

  it('contains Vistadome panoramic train for Sakleshpur Ghats corridor', () => {
    const vistadome = KARNATAKA_TRAIN_SCHEDULES.find((t) => t.id === 'vistadome-sbc-mangaluru');
    expect(vistadome).toBeDefined();
    expect(vistadome?.specialHighlight).toContain('Western Ghat');
  });

  it('filters trains accurately by origin corridor', () => {
    const blrTrains = getTrainsForOrigin('origin-bengaluru');
    expect(blrTrains.length).toBeGreaterThan(0);
    expect(blrTrains.every((t) => t.corridorIds.includes('origin-bengaluru'))).toBe(true);

    const mysTrains = getTrainsForOrigin('origin-mysuru');
    expect(mysTrains.length).toBeGreaterThan(0);
    expect(mysTrains.every((t) => t.corridorIds.includes('origin-mysuru'))).toBe(true);
  });

  it('contains verified KSRTC fleet with Shakti Scheme free travel for women', () => {
    expect(KSRTC_BUS_SERVICES.length).toBeGreaterThanOrEqual(8);

    const shaktiBuses = KSRTC_BUS_SERVICES.filter((b) => b.shaktiFree);
    expect(shaktiBuses.length).toBeGreaterThanOrEqual(5);

    const airavat = KSRTC_BUS_SERVICES.find((b) => b.serviceType === 'airavat_club');
    expect(airavat).toBeDefined();
    expect(airavat?.amenities).toContain('GPS tracked');

    const ambari = KSRTC_BUS_SERVICES.find((b) => b.serviceType === 'ambari_utsav');
    expect(ambari).toBeDefined();
    expect(ambari?.amenities).toContain('Full flat sleeper berths');
  });

  it('filters KSRTC buses by origin city', () => {
    const blrBuses = getBusesForOrigin('origin-bengaluru');
    expect(blrBuses.length).toBeGreaterThan(0);
    expect(blrBuses.every((b) => b.corridorIds.includes('origin-bengaluru'))).toBe(true);
  });

  it('computes next departure cleanly from schedule array', () => {
    const departures = ['06:00', '12:00', '18:00', '23:30'];
    const next = getNextDeparture(departures);
    expect(typeof next).toBe('string');
    expect(next.length).toBeGreaterThan(0);
  });

  it('validates running today indicator', () => {
    expect(isRunningToday(['Daily'])).toBe(true);
  });
});

describe('Live Wikipedia Lore & Provenance Registry', () => {
  it('maps key UNESCO and heritage POIs to official Wikipedia article slugs', () => {
    expect(WIKI_ARTICLE_MAP['poi-mysuru-palace']).toBe('Mysore_Palace');
    expect(WIKI_ARTICLE_MAP['poi-hampi-vijayanagara']).toBe('Hampi');
    expect(WIKI_ARTICLE_MAP['poi-belur-chenn']).toBe('Chennakeshava_Temple,_Belur');
    expect(WIKI_ARTICLE_MAP['poi-chikka-mullayanagiri']).toBe('Mullayanagiri');
    expect(WIKI_ARTICLE_MAP['poi-badami-caves']).toBe('Badami_cave_temples');
  });
});
