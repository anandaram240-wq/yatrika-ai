import React, { useState } from 'react';
import { GeneratedItinerary, ItineraryDay } from '../types';
import { speechService } from '../utils/speech';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Volume2, 
  Sparkles, 
  Printer, 
  AlertTriangle, 
  Utensils, 
  Play,
  RotateCcw
} from 'lucide-react';

interface ItineraryDashboardProps {
  itinerary: GeneratedItinerary;
  onModifyTrip: () => void;
  onOpenPrintModal: () => void;
  onViewOnMap: () => void;
}

export const ItineraryDashboard: React.FC<ItineraryDashboardProps> = ({
  itinerary,
  onModifyTrip,
  onOpenPrintModal,
  onViewOnMap,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);

  const activeDay: ItineraryDay = 
    itinerary.days.find(d => d.dayNumber === selectedDayNumber) || itinerary.days[0];

  const handlePlayPhrase = (phraseKannada: string, transliteration: string, phraseId: string) => {
    setPlayingPhraseId(phraseId);
    speechService.speak({
      kannadaText: phraseKannada,
      transliteration: transliteration,
      onEnd: () => setPlayingPhraseId(null),
      onError: () => setPlayingPhraseId(null),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP TRIP SUMMARY BANNER */}
      <div className="bg-linear-to-r from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/70 relative overflow-hidden">
        {/* Top Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-red-600 via-amber-400 to-amber-500"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-3xs font-extrabold uppercase tracking-wider">
                Personalized Itinerary
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-3xs font-black uppercase tracking-wider">
                {itinerary.inputs.budgetTier.toUpperCase()} TIER
              </span>
              <span className="text-xs text-amber-300 font-semibold">
                Generated {itinerary.createdTimestamp}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {itinerary.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-medium">
              Starting from <strong className="text-amber-300">{itinerary.inputs.startingCity.toUpperCase()}</strong> • Optimized for{' '}
              <strong className="text-white">{itinerary.inputs.travelStyle.toUpperCase()}</strong> pacing with verified driving routes and regional audio phrases.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            <button
              onClick={onViewOnMap}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>View Route Map</span>
            </button>

            <button
              onClick={onOpenPrintModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-stone-950 hover:bg-stone-100 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-900" />
              <span>Print / PDF Export</span>
            </button>

            <button
              onClick={onModifyTrip}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Re-plan</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Strip */}
        <div className="mt-8 pt-6 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
            <div className="text-xs text-stone-400 font-semibold">Total Duration</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {itinerary.summary.totalDays} Days
            </div>
            <div className="text-3xs text-amber-400">Complete Karnataka Trip</div>
          </div>

          <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
            <div className="text-xs text-stone-400 font-semibold">Total Distance</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
              ~{itinerary.summary.totalDistanceKm} km
            </div>
            <div className="text-3xs text-stone-400">Realistic Highway Routing</div>
          </div>

          <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
            <div className="text-xs text-stone-400 font-semibold">Estimated Budget</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
              ₹{itinerary.summary.totalBudgetEstimated.toLocaleString('en-IN')}
            </div>
            <div className="text-3xs text-stone-400">Stay + Food + Travel + Tickets</div>
          </div>

          <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
            <div className="text-xs text-stone-400 font-semibold">Karnataka Audio Phrases</div>
            <div className="text-xl sm:text-2xl font-black text-purple-400 mt-0.5">
              {itinerary.kannadaCompanionPhrases.length} Phrases
            </div>
            <div className="text-3xs text-stone-400">Native Web Voice Included</div>
          </div>
        </div>
      </div>

      {/* 2. SMART TRAVEL ADVISORY ALERTS */}
      {itinerary.smartAlerts.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-950">
                Karnataka Terrain & Cultural Advisory (Smart Engine Alerts):
              </h4>
              <ul className="space-y-1 text-xs text-stone-800">
                {itinerary.smartAlerts.map((alert, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. DAY SELECTOR TAB BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {itinerary.days.map((day) => {
          const isSelected = day.dayNumber === selectedDayNumber;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`px-5 py-3 rounded-2xl font-extrabold text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border-2 ${
                isSelected
                  ? 'bg-red-700 text-white border-red-800 shadow-md scale-[1.02]'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-amber-400 hover:bg-stone-50'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                isSelected ? 'bg-white text-red-800' : 'bg-stone-100 text-stone-700'
              }`}>
                {day.dayNumber}
              </span>
              <span>Day {day.dayNumber}: {day.dayTitle.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 4. ACTIVE DAY SHOWCASE */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-xl overflow-hidden">
        {/* Day Header Banner */}
        <div className="bg-stone-900 text-white p-5 sm:p-7 border-b border-stone-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-3xs uppercase font-extrabold tracking-wider text-amber-400 bg-stone-800 px-3 py-1 rounded-full">
                DAY {activeDay.dayNumber} OF {itinerary.summary.totalDays}
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-2 text-white">
                {activeDay.dayTitle}
              </h3>
              <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{activeDay.routeOverview}</span>
              </p>
            </div>

            {/* Daily Expense Summary Tag */}
            <div className="bg-stone-800/90 px-4 py-2.5 rounded-2xl border border-stone-700 text-right self-start md:self-center">
              <div className="text-3xs text-stone-400 uppercase font-bold">Estimated Day Budget</div>
              <div className="text-lg font-black text-emerald-400">
                ₹{activeDay.dayEstimatedCost.total.toLocaleString('en-IN')}
              </div>
              <div className="text-4xs text-stone-400">Stay: ₹{activeDay.dayEstimatedCost.stay} • Food: ₹{activeDay.dayEstimatedCost.food}</div>
            </div>
          </div>
        </div>

        {/* Day Timeline Slots */}
        <div className="p-5 sm:p-8 space-y-6">
          {activeDay.slots.map((slot, index) => {
            const dest = slot.destination;
            const phrase = slot.phraseToUse;
            const isPlaying = playingPhraseId === phrase.id;

            return (
              <div 
                key={index}
                className="bg-stone-50/70 rounded-2xl border border-stone-200 p-5 sm:p-6 hover:border-amber-300 hover:bg-stone-50 transition-all shadow-2xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Destination & Activity Details */}
                  <div className="space-y-3 flex-1">
                    {/* Time Slot Badge & Timing */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-3xs font-extrabold uppercase">
                        {slot.timeSlot.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        {slot.timeLabel}
                      </span>
                      {slot.travelDistanceKm > 0 && (
                        <span className="text-3xs text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded-md">
                          Transit: {slot.travelTimeFromPrev}
                        </span>
                      )}
                    </div>

                    {/* Destination Title & Kannada Script */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dest.imageEmoji}</span>
                        <h4 className="text-lg sm:text-xl font-black text-stone-950">
                          {dest.name}
                        </h4>
                      </div>
                      <div className="font-kannada text-xs font-bold text-red-700 mt-0.5">
                        {dest.nameKannada} ({dest.district} District)
                      </div>
                    </div>

                    {/* Activity Description */}
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                      {slot.activityDescription}
                    </p>

                    {/* Highlights & Insider Tip */}
                    <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5 text-2xs text-amber-900 uppercase">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Insider Travel Tip:</span>
                      </div>
                      <p className="text-stone-600 text-2xs leading-relaxed italic">
                        "{slot.insiderTip}"
                      </p>
                    </div>

                    {/* Entry Fee & Hours Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-2xs text-stone-500 pt-1">
                      <div>
                        Entry Fee: <strong className="text-stone-900">₹{dest.entryFee.indianAdult}</strong>
                        {dest.entryFee.parking ? ` + ₹${dest.entryFee.parking} parking` : ''}
                      </div>
                      <div>
                        Visiting Hours: <strong className="text-stone-900">{dest.timings}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: In-Context Kannada Audio Phrase Card */}
                  <div className="lg:w-80 bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-3xs font-extrabold uppercase tracking-wider text-red-800 bg-red-100 px-2 py-0.5 rounded-md">
                          🗣️ Useful Kannada Phrase
                        </span>
                        <span className="text-3xs text-stone-400 font-medium flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          Audio Ready
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-3xs font-bold text-stone-500 mb-1">
                          Situation: {phrase.situation}
                        </div>
                        <div className="font-kannada font-black text-lg text-stone-950 leading-snug">
                          {phrase.kannada}
                        </div>
                        <div className="text-xs font-bold text-red-700 mt-0.5">
                          /{phrase.transliteration}/
                        </div>
                        <div className="text-2xs text-stone-600 mt-1 italic">
                          "{phrase.englishMeaning}"
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => handlePlayPhrase(phrase.kannada, phrase.transliteration, phrase.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-500 text-stone-950 scale-105 shadow-md animate-pulse'
                            : 'bg-stone-900 hover:bg-stone-800 text-white'
                        }`}
                      >
                        <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-stone-950' : 'fill-white'}`} />
                        <span>{isPlaying ? 'Playing...' : 'Hear Pronunciation'}</span>
                      </button>

                      <span className="text-4xs text-stone-400">
                        Web Speech API
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 5. DAY FOOD HIGHLIGHT */}
          <div className="bg-amber-50/80 rounded-2xl border border-amber-300 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber-500 text-stone-950 rounded-xl shadow-xs">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xs uppercase font-extrabold tracking-wider text-amber-900">
                  Recommended Regional Lunch for Day {activeDay.dayNumber}
                </span>
                <h4 className="text-base font-black text-stone-950 mt-0.5">
                  {activeDay.lunchRecommendation.dishName}
                </h4>
                <p className="text-xs text-stone-700 mt-0.5">
                  Famous spot: <strong className="text-stone-900">{activeDay.lunchRecommendation.placeName}</strong>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs font-black text-stone-900">
                Approx ₹{activeDay.lunchRecommendation.approxPrice} / person
              </div>
              <div className="text-3xs text-emerald-700 font-bold">Authentic Local Flavour</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
