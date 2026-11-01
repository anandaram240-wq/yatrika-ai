/**
 * @file src/components/BusSearchWorkspace.tsx
 * @description Dedicated bus search interface covering KSRTC, BMTC, NWKRTC, KKRTC.
 * @theme Code. Create. Celebrate Kannada.
 */

import React, { useState } from 'react';
import { BusSearchService, BusSearchResultItem } from '../transit/buses/busSearchService';

interface BusSearchWorkspaceProps {
  initialOrigin?: string;
  initialDestination?: string;
  onSelectBus?: (busItem: BusSearchResultItem) => void;
  className?: string;
}

export const BusSearchWorkspace: React.FC<BusSearchWorkspaceProps> = ({
  initialOrigin = 'Bengaluru',
  initialDestination = 'Belur',
  onSelectBus,
  className = '',
}) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [journeyDate, setJourneyDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [operatorFilter, setOperatorFilter] = useState<string>('all');
  const [shaktiOnly, setShaktiOnly] = useState(false);
  const womenPassengers = 1;

  const searchResponse = BusSearchService.search({
    origin,
    destination,
    operatorId: operatorFilter,
    serviceClass: 'all',
    shaktiOnly,
    womenPassengersCount: womenPassengers,
  });

  return (
    <div className={`bg-[#FAF7F2] text-[#1A1714] rounded-2xl p-6 border border-[#E8DFD3] shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8DFD3] gap-2">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#A44A28] font-semibold">
            ರಾಜ್ಯ ಸಾರಿಗೆ ಮಾಹಿತಿ • State Bus Intelligence
          </span>
          <h2 className="font-serif text-2xl font-normal mt-0.5">
            ಕರ್ನಾಟಕ ಬಸ್ ಸಂಚಾರ • Bus Explorer
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8DFD3] text-[#4A443C] font-mono">
            KSRTC • BMTC • NWKRTC • KKRTC
          </span>
        </div>
      </div>

      {/* Distinction Pillars Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 p-3 bg-white rounded-xl border border-[#E8DFD3] text-xs">
        <div className="flex items-center gap-2 text-[#4A443C]">
          <span className="text-sm">📋</span>
          <div>
            <strong className="block text-[#1A1714]">ಪ್ರಕಟಿತ ವೇಳಾಪಟ್ಟಿ</strong>
            <span className="text-[11px] text-[#7A7369]">KSRTC Published Timetables</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#4A443C]">
          <span className="text-sm">🛰️</span>
          <div>
            <strong className="block text-[#1A1714]">ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್</strong>
            <span className="text-[11px] text-[#7A7369]">Mitra App / Depot Enquiry</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#4A443C]">
          <span className="text-sm">🎫</span>
          <div>
            <strong className="block text-[#1A1714]">ಅಧಿಕೃತ ಬುಕಿಂಗ್ ಹಸ್ತಾಂತರ</strong>
            <span className="text-[11px] text-[#7A7369]">KSRTC Awatar Portal</span>
          </div>
        </div>
      </div>

      {/* Search Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 my-5">
        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">ಪ್ರಾರಂಭ • Origin</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="e.g. Bengaluru, Mysuru, Hubballi"
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#A44A28]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">ಗಮ್ಯಸ್ಥಾನ • Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Belur, Hampi, Gokarna"
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#A44A28]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">ಪ್ರಯಾಣದ ದಿನಾಂಕ • Date</label>
          <input
            type="date"
            value={journeyDate}
            onChange={(e) => setJourneyDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#A44A28]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">ಸಾರಿಗೆ ನಿಗಮ • Operator</label>
          <select
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#A44A28]"
          >
            <option value="all">ಎಲ್ಲಾ ನಿಗಮಗಳು (All Operators)</option>
            <option value="KSRTC">KSRTC (ದಕ್ಷಿಣ ಕರ್ನಾಟಕ & ಘಾಟ್)</option>
            <option value="NWKRTC">NWKRTC (ವಾಯವ್ಯ ಕರ್ನಾಟಕ)</option>
            <option value="KKRTC">KKRTC (ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ)</option>
            <option value="BMTC">BMTC (ಬೆಂಗಳೂರು ವಿಮಾನ ನಿಲ್ದಾಣ)</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer bg-white border border-[#D5C9B8] rounded-xl px-3 py-2">
            <input
              type="checkbox"
              checked={shaktiOnly}
              onChange={(e) => setShaktiOnly(e.target.checked)}
              className="accent-[#A44A28] h-4 w-4 rounded"
            />
            <span className="text-xs font-medium text-[#1A1714]">
              ಶಕ್ತಿ ಯೋಜನೆ ಮಾತ್ರ (Shakti Free Only)
            </span>
          </label>
        </div>
      </div>

      {/* Fallback Notice if applicable */}
      {searchResponse.fallbackNotice && (
        <div className="p-3 mb-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs">
          ℹ️ {searchResponse.fallbackNotice}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#7A7369] mb-3">
        <span>ದೊರೆತ ವೇಳಾಪಟ್ಟಿಗಳು: <strong>{searchResponse.totalFound}</strong> (Official Published Timetables)</span>
        {searchResponse.shaktiSchemeAvailable && (
          <span className="text-[#166534] font-medium bg-[#DCFCE7] px-2 py-0.5 rounded">
            ✨ ಶಕ್ತಿ ಯೋಜನೆ ಲಭ್ಯ (Shakti Scheme Applicable)
          </span>
        )}
      </div>

      {/* Bus Schedule Cards */}
      <div className="space-y-3">
        {searchResponse.results.length === 0 ? (
          <div className="text-center py-8 text-[#7A7369] bg-white rounded-xl border border-[#E8DFD3]">
            <p className="font-serif">ಯಾವುದೇ ವೇಳಾಪಟ್ಟಿ ಕಂಡುಬಂದಿಲ್ಲ (No services found)</p>
            <p className="text-xs mt-1">ಸ್ಥಳದ ಹೆಸರನ್ನು ಪರೀಕ್ಷಿಸಿ ಅಥವಾ ಅಧಿಕೃತ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ.</p>
            <a
              href="https://ksrtc.in/oprs-web/guest/home.do"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-4 py-1.5 rounded-lg bg-[#A44A28] text-white text-xs font-medium"
            >
              KSRTC.in ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ತೆರಳಿ
            </a>
          </div>
        ) : (
          searchResponse.results.map(({ schedule, operator, handoff, shaktiSavingsInr }) => (
            <div
              key={schedule.id}
              className="bg-white rounded-xl p-4 border border-[#E8DFD3] hover:border-[#D5C9B8] transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFEA] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2B4C3F] text-white">
                    {schedule.operatorId}
                  </span>
                  <h3 className="font-serif text-base font-medium text-[#1A1714]">
                    {schedule.serviceName}
                  </h3>
                  {schedule.serviceNumber && (
                    <span className="text-[11px] font-mono text-[#7A7369]">
                      #{schedule.serviceNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {schedule.shaktiFree && (
                    <span className="text-[11px] bg-[#DCFCE7] text-[#166534] font-semibold px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                      ಶಕ್ತಿ: ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ (Free)
                    </span>
                  )}
                  {schedule.isAc && (
                    <span className="text-[11px] bg-[#EFF6FF] text-[#1E40AF] px-2 py-0.5 rounded">
                      AC
                    </span>
                  )}
                  {schedule.hasSleeperBerth && (
                    <span className="text-[11px] bg-[#F5F3FF] text-[#5B21B6] px-2 py-0.5 rounded">
                      ಸ್ಲೀಪರ್ (Sleeper)
                    </span>
                  )}
                </div>
              </div>

              {/* Timing & Stations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-3 py-1">
                <div>
                  <span className="text-[11px] text-[#7A7369] block">ಹೊರಡುವ ಸಮಯ • Departure</span>
                  <span className="text-lg font-mono font-semibold text-[#1A1714]">{schedule.departureTime}</span>
                  <p className="text-xs text-[#4A443C] truncate">{schedule.originTerminal}</p>
                </div>

                <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-[#F4EFEA] py-1 md:py-0">
                  <span className="text-[11px] text-[#7A7369] font-mono">{schedule.durationLabel}</span>
                  <div className="w-24 h-0.5 bg-[#D5C9B8] relative my-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A44A28] absolute -top-0.5 right-0"></div>
                  </div>
                  <span className="text-[10px] text-[#7A7369]">{schedule.distanceKm} km (NH ಕಾರಿಡಾರ್)</span>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-[11px] text-[#7A7369] block">ತಲುಪುವ ಸಮಯ • Arrival</span>
                  <span className="text-lg font-mono font-semibold text-[#1A1714]">{schedule.arrivalTime}</span>
                  <p className="text-xs text-[#4A443C] truncate">{schedule.destinationTerminal}</p>
                </div>
              </div>

              {/* Route Highlight & Stops */}
              <div className="text-xs text-[#4A443C] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#F4EFEA] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>📍 <strong>ನಿಲುಗಡೆಗಳು:</strong> {schedule.intermediateStops.join(' ➔ ')}</span>
                <span className="text-[#7A7369] text-[11px] shrink-0">{schedule.depotContact}</span>
              </div>

              {/* Footer: Fare & Official Booking CTA */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F4EFEA]">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-serif font-semibold text-[#1A1714]">₹{schedule.fareInr}</span>
                    <span className="text-xs text-[#7A7369]">/ ವ್ಯಕ್ತಿಗೆ (General Fare)</span>
                  </div>
                  {shaktiSavingsInr > 0 && (
                    <span className="text-[11px] text-[#166534] block">
                      ✓ ಶಕ್ತಿ ಯೋಜನೆಯಡಿ ₹{shaktiSavingsInr} ಉಳಿತಾಯ (Zero fare for women)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onSelectBus && (
                    <button
                      type="button"
                      onClick={() => onSelectBus({ schedule, operator, handoff, shaktiSavingsInr })}
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#D5C9B8] hover:bg-[#FAF7F2] transition-colors"
                    >
                      ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip)
                    </button>
                  )}
                  {schedule.operatorId === 'BMTC' && handoff.playStoreUrl && (
                    <a
                      href={handoff.playStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#D5C9B8] hover:bg-[#FAF7F2] transition-colors text-[#4A443C]"
                      title="Download official Namma BMTC 2.0 Android app for live bus tracking"
                    >
                      📲 ನಮ್ಮ BMTC ಆ್ಯಪ್
                    </a>
                  )}
                  <a
                    href={handoff.handoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 text-xs rounded-lg bg-[#A44A28] hover:bg-[#8B3E22] text-white font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on {schedule.operatorId}</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
