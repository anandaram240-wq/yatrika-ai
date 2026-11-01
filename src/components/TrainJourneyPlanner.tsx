/**
 * @file src/components/TrainJourneyPlanner.tsx
 * @description Station-to-station train search and last-mile railway planning workspace.
 * @theme Code. Create. Celebrate Kannada.
 */

import React, { useState } from 'react';
import { TrainSearchService, TrainSearchResult } from '../transit/railways/trainSearchService';

interface TrainJourneyPlannerProps {
  initialFrom?: string;
  initialTo?: string;
  onSelectTrain?: (trainResult: TrainSearchResult) => void;
  className?: string;
}

export const TrainJourneyPlanner: React.FC<TrainJourneyPlannerProps> = ({
  initialFrom = 'SBC',
  initialTo = 'HPT',
  onSelectTrain,
  className = '',
}) => {
  const [fromStation, setFromStation] = useState(initialFrom);
  const [toStation, setToStation] = useState(initialTo);
  const [journeyDate, setJourneyDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [copiedTrainNumber, setCopiedTrainNumber] = useState<string | null>(null);

  const handleCopyTrainDetails = (train: any) => {
    const text = `Train ${train.trainNumber}: ${train.trainName} | From: ${train.originCode} (${train.departureTime}) | To: ${train.destinationCode} (${train.arrivalTime}) | Date: ${journeyDate}`;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch (e) {
      // Graceful fallback
    }
    setCopiedTrainNumber(train.trainNumber);
    setTimeout(() => setCopiedTrainNumber(null), 2500);
  };

  const searchResponse = TrainSearchService.search({
    fromStationCodeOrCity: fromStation,
    toStationCodeOrCity: toStation,
  });

  return (
    <div className={`bg-[#FAF7F2] text-[#1A1714] rounded-2xl p-6 border border-[#E8DFD3] shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8DFD3] gap-2">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#2B4C3F] font-semibold">
            ದಕ್ಷಿಣ ಪಶ್ಚಿಮ ರೈಲ್ವೆ • South Western Railway (SWR)
          </span>
          <h2 className="font-serif text-2xl font-normal mt-0.5">
            ರೈಲು ಪ್ರಯಾಣ ಯೋಜನೆ • Train Journey Planner
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8DFD3] text-[#4A443C] font-mono">
            IRCTC • NTES Verified
          </span>
        </div>
      </div>

      {/* Distinction Pillars Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 p-3 bg-white rounded-xl border border-[#E8DFD3] text-xs">
        <div className="flex items-center gap-2 text-[#4A443C]">
          <span className="text-sm">📋</span>
          <div>
            <strong className="block text-[#1A1714]">ಅಧಿಕೃತ ವೇಳಾಪಟ್ಟಿ</strong>
            <span className="text-[11px] text-[#7A7369]">SWR Published Timetable</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#4A443C]">
          <span className="text-sm">🛰️</span>
          <div>
            <strong className="block text-[#1A1714]">ಲೈವ್ ಸ್ಟೇಟಸ್ ತನಿಖೆ</strong>
            <span className="text-[11px] text-[#7A7369]">NTES GPS Train Tracking</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#4A443C]">
          <span className="text-sm">🎫</span>
          <div>
            <strong className="block text-[#1A1714]">ಬುಕಿಂಗ್ ಸಂಪರ್ಕ</strong>
            <span className="text-[11px] text-[#7A7369]">Official IRCTC Portal</span>
          </div>
        </div>
      </div>

      {/* From / To / Date Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">ಪ್ರಾರಂಭದ ನಿಲ್ದಾಣ • From Station</label>
          <select
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#2B4C3F]"
          >
            <option value="SBC">SBC - KSR Bengaluru City (Majestic)</option>
            <option value="YPR">YPR - Yesvantpur Junction</option>
            <option value="HPT">HPT - Hosapete Junction (Hampi Gateway)</option>
            <option value="MYS">MYS - Mysuru Junction</option>
            <option value="BDM">BDM - Badami Railway Station</option>
            <option value="HAS">HAS - Hassan Junction (Belur / Halebidu)</option>
            <option value="MAJN">MAJN - Mangaluru Junction</option>
            <option value="UBL">UBL - SSS Hubballi Junction</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">ಗಮ್ಯಸ್ಥಾನ ನಿಲ್ದಾಣ • To Station / Destination</label>
          <select
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#2B4C3F]"
          >
            <option value="HPT">HPT - Hosapete Junction (Hampi Gateway)</option>
            <option value="SBC">SBC - KSR Bengaluru City</option>
            <option value="YPR">YPR - Yesvantpur Junction</option>
            <option value="BDM">BDM - Badami (Cave Temples)</option>
            <option value="HAS">HAS - Hassan Junction (Belur / Halebidu)</option>
            <option value="MAJN">MAJN - Mangaluru Junction (Western Ghats Vistadome)</option>
            <option value="MYS">MYS - Mysuru Junction (Vande Bharat)</option>
            <option value="UBL">UBL - SSS Hubballi Junction</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">ಪ್ರಯಾಣದ ದಿನಾಂಕ • Journey Date</label>
          <input
            type="date"
            value={journeyDate}
            onChange={(e) => setJourneyDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#2B4C3F]"
          />
        </div>
      </div>

      {/* Transfer Guide Notice if applicable */}
      {searchResponse.transferGuide && (
        <div className="p-3 mb-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-xs leading-relaxed">
          💡 {searchResponse.transferGuide}
        </div>
      )}

      {/* Train Results */}
      <div className="space-y-4">
        {searchResponse.directTrains.length === 0 ? (
          <div className="text-center py-8 text-[#7A7369] bg-white rounded-xl border border-[#E8DFD3]">
            <p className="font-serif">ಯಾವುದೇ ನೇರ ರೈಲು ಲಭ್ಯವಿಲ್ಲ (No direct trains found for this route)</p>
            <p className="text-xs mt-1">ಹತ್ತಿರದ ಪ್ರಮುಖ ಜಂಕ್ಷನ್ (ಉದಾ. ಬೆಂಗಳೂರು, ಮೈಸೂರು ಅಥವಾ ಹುಬ್ಬಳ್ಳಿ) ಪರೀಕ್ಷಿಸಿ.</p>
            <a
              href="https://www.irctc.co.in/nget/train-search"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-4 py-1.5 rounded-lg bg-[#2B4C3F] text-white text-xs font-medium"
            >
              IRCTC ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ
            </a>
          </div>
        ) : (
          searchResponse.directTrains.map(({ train, irctcBookingUrl, lastMileAdvice }) => (
            <div
              key={train.trainNumber}
              className="bg-white rounded-xl p-5 border border-[#E8DFD3] hover:border-[#D5C9B8] transition-all shadow-sm"
            >
              {/* Header: Number, Name, Type */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFEA] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#1A1714] text-white">
                    {train.trainNumber}
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-medium text-[#1A1714]">
                      {train.trainName}
                    </h3>
                    <span className="text-xs text-[#7A7369] font-kannada">
                      {train.trainNameKannada}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-[#EFF6FF] text-[#1E40AF] font-medium px-2 py-0.5 rounded border border-[#BFDBFE]">
                    {train.trainType === 'vande_bharat' ? '⚡ ವಂದೇ ಭಾರತ್' : train.trainType === 'vistadome_express' ? '🌄 ವಿಸ್ಟಾಡೋಮ್' : 'ಎಕ್ಸ್‌ಪ್ರೆಸ್'}
                  </span>
                  <span className="text-[11px] text-[#7A7369] font-mono">
                    {train.daysOfOperation.join(', ')}
                  </span>
                </div>
              </div>

              {/* Schedule Timing & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-3 py-1">
                <div>
                  <span className="text-[11px] text-[#7A7369] block">ಹೊರಡುವ ಸಮಯ • Departure</span>
                  <span className="text-xl font-mono font-bold text-[#1A1714]">{train.departureTime}</span>
                  <p className="text-xs text-[#4A443C]">{train.originName} ({train.originCode})</p>
                </div>

                <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-[#F4EFEA] py-1 md:py-0">
                  <span className="text-[11px] text-[#7A7369] font-mono font-medium">{train.durationLabel}</span>
                  <div className="w-28 h-0.5 bg-[#D5C9B8] relative my-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2B4C3F] absolute -top-0.5 right-0"></div>
                  </div>
                  <span className="text-[10px] text-[#7A7369]">ವರ್ಗಗಳು: {train.classesAvailable.join(', ')}</span>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-[11px] text-[#7A7369] block">ತಲುಪುವ ಸಮಯ • Arrival</span>
                  <span className="text-xl font-mono font-bold text-[#1A1714]">{train.arrivalTime}</span>
                  <p className="text-xs text-[#4A443C]">{train.destinationName} ({train.destinationCode})</p>
                </div>
              </div>

              {/* Scenic Highlight & Last Mile Transfer */}
              <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#F4EFEA] text-xs space-y-1.5 my-3">
                <p className="text-[#4A443C]">
                  🌟 <strong>ವಿಶೇಷತೆ:</strong> {train.scenicHighlights}
                </p>
                <p className="text-[#166534]">
                  🚖 <strong>ಕೊನೆಯ ಮೈಲಿ ಸಂಪರ್ಕ (Last Mile):</strong> {lastMileAdvice}
                </p>
              </div>

              {/* Fare & Booking CTAs */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F4EFEA]">
                <div className="text-xs text-[#4A443C]">
                  <span>ದರ ಶ್ರೇಣಿ: </span>
                  {train.fareGuide.acChairCar && <span className="font-semibold text-[#1A1714]">CC ₹{train.fareGuide.acChairCar} • </span>}
                  {train.fareGuide.sleeper && <span className="font-semibold text-[#1A1714]">SL ₹{train.fareGuide.sleeper} • </span>}
                  {train.fareGuide.vistadome && <span className="font-semibold text-[#1A1714]">EV ₹{train.fareGuide.vistadome} • </span>}
                  {train.fareGuide.ac3Tier && <span className="font-semibold text-[#1A1714]">3A ₹{train.fareGuide.ac3Tier}</span>}
                </div>

                <div className="flex items-center gap-2">
                  {onSelectTrain && (
                    <button
                      type="button"
                      onClick={() => onSelectTrain({ train, irctcBookingUrl, lastMileAdvice })}
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#D5C9B8] hover:bg-[#FAF7F2] transition-colors"
                    >
                      ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopyTrainDetails(train)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[#D5C9B8] hover:bg-[#FAF7F2] transition-colors text-[#4A443C]"
                    title="Copy train number, schedule and stations for IRCTC"
                  >
                    {copiedTrainNumber === train.trainNumber ? '✓ ಕಾಪಿ ಆಗಿದೆ! (Copied)' : '📋 ವಿವರ ಕಾಪಿ (Copy)'}
                  </button>
                  <a
                    href={train.ntesRunningStatusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs rounded-lg border border-[#D5C9B8] hover:bg-[#FAF7F2] transition-colors text-[#4A443C]"
                  >
                    ಲೈವ್ ಸ್ಟೇಟಸ್ (NTES)
                  </a>
                  <a
                    href={irctcBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 text-xs rounded-lg bg-[#2B4C3F] hover:bg-[#20392F] text-white font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>IRCTC ನಲ್ಲಿ ಬುಕ್ ಮಾಡಿ</span>
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
