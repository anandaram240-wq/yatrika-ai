/**
 * @file src/components/StayDiscoveryWorkspace.tsx
 * @description Dedicated stay & homestay explorer for YatriKa AI V8.
 * Features verified KSTDC Mayura properties, JLR lodges, and government-registered homestays.
 * @theme Code. Create. Celebrate Kannada.
 */

import React, { useState } from 'react';
import { AccommodationRegistryV8, ComprehensiveAccommodation } from '../stays/accommodationRegistry';
import { getStayVerificationMeta } from '../stays/accommodationVerification';
import { StayBookingHandoffService } from '../stays/bookingHandoff';

interface StayDiscoveryWorkspaceProps {
  initialDestination?: string;
  onSelectStay?: (stay: ComprehensiveAccommodation) => void;
  className?: string;
}

export const StayDiscoveryWorkspace: React.FC<StayDiscoveryWorkspaceProps> = ({
  initialDestination = '',
  onSelectStay,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialDestination);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [governmentOnly, setGovernmentOnly] = useState(false);

  const registry = AccommodationRegistryV8.getInstance();
  const stays = registry.search({
    destinationOrDistrict: searchQuery,
    category: categoryFilter,
    governmentRunOnly: governmentOnly,
  });

  return (
    <div className={`bg-[#FAF7F2] text-[#1A1714] rounded-2xl p-6 border border-[#E8DFD3] shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8DFD3] gap-2">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#A44A28] font-semibold">
            ನೋಂದಾಯಿತ ತಂಗುದಾಣಗಳು • Verified Accommodations
          </span>
          <h2 className="font-serif text-2xl font-normal mt-0.5">
            ಹೋಟೆಲ್ & ಹೋಮ್‌ಸ್ಟೇ ಅನ್ವೇಷಣೆ • Stay Explorer
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8DFD3] text-[#4A443C] font-mono">
            KSTDC Mayura • JLR • District Registered
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">ಸ್ಥಳ ಅಥವಾ ಜಿಲ್ಲೆ • Destination / District</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Belur, Hampi, Chikkamagaluru, Gokarna"
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#A44A28]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">ವರ್ಗ • Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#A44A28]"
          >
            <option value="all">ಎಲ್ಲಾ ವರ್ಗಗಳು (All Categories)</option>
            <option value="kstdc_mayura">KSTDC ಹೋಟೆಲ್ ಮಯೂರ ಶ್ರೇಣಿ</option>
            <option value="jungle_lodges">ಜಂಗಲ್ ಲಾಡ್ಜಸ್ & ರೆಸಾರ್ಟ್ಸ್ (JLR)</option>
            <option value="registered_homestay">ಜಿಲ್ಲಾ ನೋಂದಾಯಿತ ಹೋಮ್‌ಸ್ಟೇಗಳು</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer bg-white border border-[#D5C9B8] rounded-xl px-3 py-2">
            <input
              type="checkbox"
              checked={governmentOnly}
              onChange={(e) => setGovernmentOnly(e.target.checked)}
              className="accent-[#A44A28] h-4 w-4 rounded"
            />
            <span className="text-xs font-medium text-[#1A1714]">
              ಸರ್ಕಾರಿ ಒಡೆತನ ಮಾತ್ರ (KSTDC / JLR Only)
            </span>
          </label>
        </div>
      </div>

      {/* Results Count & Verified Notice */}
      <div className="flex items-center justify-between text-xs text-[#7A7369] mb-3">
        <span>ದೃಢೀಕೃತ ಆಸ್ತಿಗಳು: <strong>{stays.length}</strong></span>
        <span className="text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded font-medium">
          ✓ ನೈಜ ದರಗಳು ಹಾಗೂ ನೋಂದಣಿ ಐಡಿ ದೃಢೀಕೃತ
        </span>
      </div>

      {/* Stays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stays.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-[#7A7369] bg-white rounded-xl border border-[#E8DFD3]">
            <p className="font-serif">ಯಾವುದೇ ದೃಢೀಕೃತ ತಂಗುದಾಣ ಕಂಡುಬಂದಿಲ್ಲ (No verified stays found)</p>
            <p className="text-xs mt-1">ಬೇರೆ ಜಿಲ್ಲೆಯ ಹೆಸರನ್ನು ಪರೀಕ್ಷಿಸಿ ಅಥವಾ KSTDC ಪೋರ್ಟಲ್ ವೀಕ್ಷಿಸಿ.</p>
          </div>
        ) : (
          stays.map((stay) => {
            const vMeta = getStayVerificationMeta(stay.verificationStatus);
            const handoff = StayBookingHandoffService.createHandoff(stay);

            return (
              <div
                key={stay.id}
                className="bg-white rounded-xl overflow-hidden border border-[#E8DFD3] hover:border-[#D5C9B8] transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative h-44 w-full bg-[#1A1714]">
                    <img
                      src={stay.photoUrl}
                      alt={stay.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm"
                        style={{ backgroundColor: vMeta.badgeBg, color: vMeta.badgeText, border: `1px solid ${vMeta.badgeBorder}` }}
                      >
                        {vMeta.label}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-white">
                      📍 {stay.servesDestinationName} ({stay.distanceToDestinationKm} km)
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div>
                      <h3 className="font-serif text-lg font-medium text-[#1A1714]">
                        {stay.name}
                      </h3>
                      <p className="text-xs text-[#7A7369] font-kannada">
                        {stay.nameKannada}
                      </p>
                    </div>

                    <p className="text-xs text-[#4A443C] line-clamp-2 leading-relaxed">
                      {stay.description}
                    </p>

                    {/* Registration ID & Location */}
                    <div className="text-[11px] text-[#7A7369] bg-[#FAF7F2] p-2 rounded-lg border border-[#F4EFEA] space-y-0.5">
                      {stay.governmentRegistrationId && (
                        <p><strong>ನೋಂದಣಿ ಐಡಿ (Govt Reg ID):</strong> <span className="font-mono text-[#1A1714]">{stay.governmentRegistrationId}</span></p>
                      )}
                      <p><strong>ವಿಳಾಸ:</strong> {stay.address}</p>
                      <p><strong>ಸೌಲಭ್ಯಗಳು:</strong> {stay.amenities.slice(0, 3).join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* Footer: Price & Direct Booking */}
                <div className="p-4 pt-3 border-t border-[#F4EFEA] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#7A7369] block">ದರ ಶ್ರೇಣಿ (Tariff)</span>
                    <span className="text-base font-serif font-semibold text-[#1A1714]">
                      ₹{stay.priceRangeInr.min} - ₹{stay.priceRangeInr.max}
                    </span>
                    <span className="text-[10px] text-[#7A7369] block">/ ರಾತ್ರಿ (Night)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onSelectStay && (
                      <button
                        type="button"
                        onClick={() => onSelectStay(stay)}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-[#D5C9B8] hover:bg-[#FAF7F2] transition-colors"
                      >
                        + ಸೇರಿಸಿ
                      </button>
                    )}
                    <a
                      href={handoff.officialBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 text-xs rounded-lg bg-[#A44A28] hover:bg-[#8B3E22] text-white font-medium transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>ಬುಕಿಂಗ್ ಸಂಪರ್ಕ</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
