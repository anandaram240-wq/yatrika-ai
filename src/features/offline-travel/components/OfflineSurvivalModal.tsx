/**
 * src/features/offline-travel/components/OfflineSurvivalModal.tsx
 * Interactive YatriKa Offline Survival Mode Modal.
 * Styled in the clean daylight glassmorphic design system.
 */

import React, { useState, useEffect } from 'react';
import { OfflineTripPack, StorageQuotaInfo } from '../domain/types';
import { offlineStorage } from '../storage/offlineStorageRepository';
import {
  createAndSaveOfflineTripPack,
  OFFICIAL_KARNATAKA_EMERGENCY_DIRECTORY,
  KANNAADA_SURVIVAL_PHRASES,
} from '../services/offlineTripPackService';
import { speechAdapterInstance } from '../../voice-agent/adapters/speechRecognitionAdapter';

interface OfflineSurvivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeItineraryStops: any[];
  userOrigin: any;
  circuitTitle: string;
  totalDistanceKm: number;
  routeCoordinates: [number, number][];
  budgetMetrics: {
    netTotal: number;
    lodging: number;
    fuel: number;
    tickets: number;
    food: number;
  };
}

export const OfflineSurvivalModal: React.FC<OfflineSurvivalModalProps> = ({
  isOpen,
  onClose,
  activeItineraryStops,
  userOrigin,
  circuitTitle,
  totalDistanceKm,
  routeCoordinates,
  budgetMetrics,
}) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'emergency' | 'phrases' | 'shakti'>('itinerary');
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [savedPack, setSavedPack] = useState<OfflineTripPack | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<StorageQuotaInfo | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const packId = `pack-${userOrigin.id}-${activeItineraryStops.map((s) => s.id).join('-').slice(0, 32)}`;
      offlineStorage.getTripPack(packId).then((pack) => {
        setSavedPack(pack);
      });
      offlineStorage.estimateStorageQuota().then((q) => setQuotaInfo(q));
    }
  }, [isOpen, userOrigin, activeItineraryStops]);

  if (!isOpen) return null;

  const handleDownloadPack = async () => {
    setIsDownloading(true);
    const packId = `pack-${userOrigin.id}-${activeItineraryStops.map((s) => s.id).join('-').slice(0, 32)}`;

    try {
      const pack = await createAndSaveOfflineTripPack({
        id: packId,
        circuitTitle,
        circuitTitleKannada: 'ಉಳಿಸಿದ ಆಫ್‌ಲೈನ್ ಪ್ರವಾಸ',
        origin: userOrigin,
        stops: activeItineraryStops,
        totalDistanceKm,
        routeCoordinates,
        netTotalInr: budgetMetrics.netTotal,
        lodgingInr: budgetMetrics.lodging,
        fuelInr: budgetMetrics.fuel,
        ticketsInr: budgetMetrics.tickets,
        foodInr: budgetMetrics.food,
      });

      setSavedPack(pack);
      const q = await offlineStorage.estimateStorageQuota();
      setQuotaInfo(q);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSpeakPhrase = (text: string) => {
    speechAdapterInstance.speakKannada(text);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.22)',
          border: '1.5px solid #e2e8f0',
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Connectivity Status */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isOnline
              ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)'
              : 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: isOnline ? '#059669' : '#ea580c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              {isOnline ? '🌐' : '📡'}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>YatriKa Offline Survival Mode</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: isOnline ? '#dcfce7' : '#ffedd5',
                    color: isOnline ? '#15803d' : '#c2410c',
                  }}
                >
                  {isOnline ? '🟢 Live Online' : '🟠 Offline Mode Active'}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b' }}>
                Zero-network navigation & safety for Western Ghats & remote heritage zones
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: '#f1f5f9',
              borderRadius: '50%',
              width: 30,
              height: 30,
              cursor: 'pointer',
              fontWeight: 700,
              color: '#475569',
            }}
          >
            ✕
          </button>
        </div>

        {/* Offline Pack Action Strip */}
        <div
          style={{
            padding: '12px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
              {savedPack ? '✓ Trip Survival Pack Cached' : '⚠️ Trip Not Saved for Offline Use'}
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              {savedPack
                ? `Size: ${(savedPack.sizeBytes / 1024).toFixed(1)} KB • Integrity: ${savedPack.checksum}`
                : 'Download route coordinates, emergency contacts, and Kannada survival cards.'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPack}
            disabled={isDownloading}
            style={{
              background: savedPack ? '#ecfdf5' : '#2563eb',
              color: savedPack ? '#047857' : '#ffffff',
              border: savedPack ? '1px solid #a7f3d0' : 'none',
              borderRadius: 10,
              padding: '7px 14px',
              fontSize: 12,
              fontWeight: 700,
              cursor: isDownloading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: savedPack ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.3)',
            }}
          >
            {isDownloading ? '⏳ Saving Pack...' : savedPack ? '✓ Update Offline Pack' : '💾 Save Trip Pack (Offline)'}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#ffffff', padding: '0 20px' }}>
          {[
            { id: 'itinerary', label: `🗺️ Stops (${activeItineraryStops.length})` },
            { id: 'emergency', label: '🚨 Emergency Directory' },
            { id: 'phrases', label: '🗣️ Kannada Survival' },
            { id: 'shakti', label: '🚌 Shakti Scheme Audit' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 14px',
                border: 'none',
                background: 'transparent',
                fontSize: 12.5,
                fontWeight: activeTab === tab.id ? 800 : 600,
                color: activeTab === tab.id ? '#2563eb' : '#64748b',
                borderBottom: activeTab === tab.id ? '2.5px solid #2563eb' : '2.5px solid transparent',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: 20, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* TAB 1: ITINERARY DETAILS */}
          {activeTab === 'itinerary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                📍 Origin: {userOrigin.name} ({userOrigin.nameKannada}) • Total Distance: {totalDistanceKm} km
              </div>

              {activeItineraryStops.map((stop, idx) => (
                <div
                  key={stop.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: '#ea580c',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{stop.name}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>
                        {stop.nameKannada} • {stop.timing || '09:00 AM – 06:00 PM'} • Fee: ₹{stop.entryFeeInr || 0}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb' }}>
                    {stop.coordinates[1].toFixed(3)}°N, {stop.coordinates[0].toFixed(3)}°E
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: EMERGENCY DIRECTORY */}
          {activeTab === 'emergency' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Hardware & Network Limitation Notice */}
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 12,
                  color: '#92400e',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 2 }}>
                  ⚠️ ಸಾಧನ & ನೆಟ್‌ವರ್ಕ್ ಮಿತಿ (Hardware & Cellular Network Limitations):
                </div>
                <div>
                  ದೂರವಾಣಿ ಕರೆಗಳು (112, 108, 1077) ನಿಮ್ಮ ಸಾಧನದ ಸಿಮ್ ಕಾರ್ಡ್ ಮತ್ತು ಸ್ಥಳೀಯ ಸೆಲ್ಯುಲಾರ್ ಟವರ್ ವ್ಯಾಪ್ತಿಯನ್ನು ಅವಲಂಬಿಸಿವೆ. ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಸಂಪೂರ್ಣ ನೆಟ್‌ವರ್ಕ್ ರಹಿತ ಕಣಿವೆಗಳಲ್ಲಿ ಧ್ವನಿ ಕರೆಗಳು ಸಂಪರ್ಕಗೊಳ್ಳದಿರಬಹುದು. ತುರ್ತು ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆಗಳು, ರಸ್ತೆ ನಕ್ಷೆ ಮತ್ತು ಉಳಿಸಿದ ಮಾರ್ಗದ ವಿವರಗಳು ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲದಿದ್ದರೂ ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.
                </div>
                <div style={{ fontSize: 11, color: '#b45309', marginTop: 4 }}>
                  Note: Emergency voice calls require an active SIM card and cellular network tower connection. In deep Western Ghats zero-connectivity dead-zones, voice calls will not connect. All offline route maps, destination records, and emergency contact details remain fully accessible on-device.
                </div>
              </div>

              <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.4 }}>
                Direct Karnataka emergency contacts verified by the Home and Health Departments. These numbers work on any active GSM network without mobile data.
              </div>

              {OFFICIAL_KARNATAKA_EMERGENCY_DIRECTORY.map((contact) => (
                <div
                  key={contact.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a' }}>{contact.title}</div>
                    <div style={{ fontSize: 11.5, color: '#c2410c', fontWeight: 600 }}>{contact.titleKannada}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      {contact.notes} • Hours: {contact.availableHours}
                    </div>
                  </div>

                  <a
                    href={`tel:${contact.phoneNumber.replace(/[^0-9]/g, '')}`}
                    style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      borderRadius: 10,
                      padding: '6px 14px',
                      fontWeight: 800,
                      fontSize: 13,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    📞 {contact.phoneNumber}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: KANNADA SURVIVAL PHRASES */}
          {activeTab === 'phrases' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {KANNAADA_SURVIVAL_PHRASES.map((phrase, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 6,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{phrase.kannada}</div>
                    <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, fontStyle: 'italic' }}>
                      "{phrase.phonetic}"
                    </div>
                    <div style={{ fontSize: 11.5, color: '#475569', marginTop: 2 }}>{phrase.english}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSpeakPhrase(phrase.kannada)}
                    style={{
                      alignSelf: 'flex-start',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    🔊 Play Spoken Audio
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SHAKTI SCHEME GUIDANCE */}
          {activeTab === 'shakti' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  background: '#fdf2f8',
                  border: '1px solid #fbcfe8',
                  borderRadius: 12,
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#9d174d' }}>
                  Govt. of Karnataka Shakti Scheme (Zero-Fare Bus Travel for Women)
                </div>
                <div style={{ fontSize: 11.5, color: '#701a75', marginTop: 2 }}>
                  Official Order Reference: <strong>No. TRAN 38 TEP 2023</strong> (Effective June 11, 2023)
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#059669', marginBottom: 4 }}>
                  ✓ 100% Free Travel Permitted In:
                </div>
                <ul style={{ fontSize: 12, color: '#334155', paddingLeft: 18, lineHeight: 1.6 }}>
                  <li>KSRTC Ordinary & Karnataka Sarige buses within state borders</li>
                  <li>NWKRTC City, Suburban & Rural Ordinary buses</li>
                  <li>KKRTC Pura Seva & Ordinary services across Kalyana Karnataka</li>
                  <li>BMTC Non-AC City Buses within Bengaluru Urban</li>
                </ul>
              </div>

              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
                  ✕ Paid / Exempted Services (Regular Fares Apply):
                </div>
                <ul style={{ fontSize: 12, color: '#334155', paddingLeft: 18, lineHeight: 1.6 }}>
                  <li>Airawat Club Class (Volvo Multi-Axle) & Ambari Dream Class (Sleepers)</li>
                  <li>Flybus (Bengaluru Airport to Mysuru/Madikeri express)</li>
                  <li>EV Power Plus Intercity Electric Buses</li>
                  <li>Interstate routes beyond Karnataka state boundary (e.g., Ooty, Goa, Tirupati)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: 11, color: '#64748b' }}>
            {quotaInfo && `IndexedDB Cache: ${(quotaInfo.usedBytes / 1024).toFixed(1)} KB used`}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 18px',
              borderRadius: 10,
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            ಮುಚ್ಚಿ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
