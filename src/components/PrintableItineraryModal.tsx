import React from 'react';
import { GeneratedItinerary } from '../types';
import { Printer, X } from 'lucide-react';

interface PrintableItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: GeneratedItinerary;
}

export const PrintableItineraryModal: React.FC<PrintableItineraryModalProps> = ({
  isOpen,
  onClose,
  itinerary,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-auto p-6 sm:p-10 space-y-6 text-stone-900">
        {/* Controls (Hidden on print) */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-stone-900">
              Print / PDF Export Preview
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save to PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="space-y-8" id="printable-trip-document">
          {/* Document Header */}
          <div className="text-center pb-6 border-b-2 border-stone-800">
            <div className="text-xs uppercase font-extrabold tracking-widest text-red-700">
              YATRIKA AI • KARNATAKA CULTURAL TRAVEL PLANNER
            </div>
            <h1 className="text-3xl font-black mt-1 text-stone-950">
              {itinerary.title}
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Generated for {itinerary.inputs.travelStyle.toUpperCase()} • {itinerary.inputs.budgetTier.toUpperCase()} Tier • Starting from {itinerary.inputs.startingCity.toUpperCase()}
            </p>

            <div className="mt-4 inline-flex items-center gap-6 px-4 py-2 bg-stone-100 rounded-xl text-xs font-bold text-stone-800 border border-stone-300">
              <span>Duration: {itinerary.summary.totalDays} Days</span>
              <span>Total Distance: ~{itinerary.summary.totalDistanceKm} km</span>
              <span>Estimated Budget: ₹{itinerary.summary.totalBudgetEstimated.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Days Schedule */}
          <div className="space-y-6">
            {itinerary.days.map((day) => (
              <div key={day.dayNumber} className="border border-stone-300 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <h3 className="text-lg font-black text-stone-950">
                    Day {day.dayNumber}: {day.dayTitle}
                  </h3>
                  <span className="text-xs font-extrabold text-stone-600">
                    Route: ~{day.dayTravelDistanceKm} km • Day Cost: ₹{day.dayEstimatedCost.total.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-3">
                  {day.slots.map((slot, sIdx) => (
                    <div key={sIdx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-stone-900">
                        <span>{slot.timeSlot.toUpperCase()}: {slot.destination.name} ({slot.destination.nameKannada})</span>
                        <span className="text-stone-500 font-normal">{slot.timeLabel}</span>
                      </div>
                      <p className="text-stone-700">{slot.activityDescription}</p>
                      <div className="text-2xs text-stone-500 italic">
                        Tip: "{slot.insiderTip}" • Entry: ₹{slot.destination.entryFee.indianAdult}
                      </div>

                      {/* Attached phrase */}
                      <div className="pt-2 mt-1 border-t border-stone-200 flex items-center justify-between text-2xs">
                        <span className="font-bold text-red-800">
                          Kannada: {slot.phraseToUse.kannada} (/{slot.phraseToUse.transliteration}/)
                        </span>
                        <span className="text-stone-600">"{slot.phraseToUse.englishMeaning}"</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-950">
                  <strong>Lunch Recommendation:</strong> {day.lunchRecommendation.dishName} at {day.lunchRecommendation.placeName} (~₹{day.lunchRecommendation.approxPrice})
                </div>
              </div>
            ))}
          </div>

          {/* Useful Kannada Phrases Appendix */}
          <div className="border border-stone-300 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-black text-stone-950 uppercase tracking-wider">
              Essential Kannada Travel Audio Phrases for this Trip:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
              {itinerary.kannadaCompanionPhrases.map((phrase) => (
                <div key={phrase.id} className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="font-bold text-stone-900">{phrase.situation}:</div>
                  <div className="font-kannada font-extrabold text-xs text-red-800">{phrase.kannada}</div>
                  <div className="text-stone-600">/{phrase.transliteration}/ — "{phrase.englishMeaning}"</div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Footer */}
          <div className="text-center pt-4 border-t border-stone-200 text-3xs text-stone-500">
            YatriKa AI • Kannada Digital Innovation Hackathon 2026 • Problem Statement 06: AI Travel Planner for Karnataka
          </div>
        </div>
      </div>
    </div>
  );
};
