import React, { useState } from 'react';
import { TripInputs, TripVibe, BudgetTier, TravelStyle } from '../types';
import { X, Compass, Calendar, Wallet, Users, MapPin, Sparkles, Check } from 'lucide-react';

interface TripWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (inputs: TripInputs) => void;
  initialInputs?: TripInputs;
}

export const TripWizard: React.FC<TripWizardProps> = ({
  isOpen,
  onClose,
  onGenerate,
  initialInputs = {
    startingCity: 'bengaluru',
    vibe: 'balanced',
    durationDays: 3,
    budgetTier: 'comfort',
    travelStyle: 'couple',
  },
}) => {
  const [inputs, setInputs] = useState<TripInputs>(initialInputs);
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const handleStartGenerate = () => {
    onGenerate(inputs);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-2xl max-w-2xl w-full overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-red-800 via-stone-900 to-stone-950 text-white p-5 sm:p-6 relative border-b border-amber-500/40">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-3xs font-extrabold uppercase tracking-wider text-amber-300">
              YatriKa AI Trip Planner
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-1 text-white">
            Customize Your Karnataka Journey
          </h3>
          <p className="text-xs text-stone-300 mt-0.5">
            Step {activeStep} of 5: Personalize routes, budget tiers, and cultural experiences
          </p>

          {/* Progress Indicator */}
          <div className="grid grid-cols-5 gap-1.5 mt-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all ${
                  step <= activeStep ? 'bg-amber-400' : 'bg-stone-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[70vh] overflow-y-auto space-y-6">
          {/* STEP 1: Starting City */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-950 font-black text-sm">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Where is your starting point in Karnataka?</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'bengaluru', name: 'Bengaluru (ಬೆಂಗಳೂರು)', desc: 'Silicon City • Airport & Train Hub' },
                  { id: 'mysuru', name: 'Mysuru (ಮೈಸೂರು)', desc: 'Heritage Hub • Gateway to Coorg' },
                  { id: 'mangaluru', name: 'Mangaluru (ಮಂಗಳೂರು)', desc: 'Coastal Gateway • Port & Beaches' },
                  { id: 'hubballi', name: 'Hubballi (ಹುಬ್ಬಳ್ಳಿ)', desc: 'North Gateway • Near Hampi & Badami' },
                ].map((city) => {
                  const isSelected = inputs.startingCity === city.id;
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => setInputs({ ...inputs, startingCity: city.id as any })}
                      className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-50 text-red-950 shadow-sm font-bold'
                          : 'border-stone-200 bg-white hover:border-amber-400 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm">{city.name.split(' (')[0]}</span>
                        {isSelected && <Check className="w-4 h-4 text-red-600" />}
                      </div>
                      <span className="font-kannada text-2xs text-stone-600 block mt-0.5">
                        {city.name.split(' (')[1]?.replace(')', '')}
                      </span>
                      <span className="text-3xs text-stone-500 mt-1 block font-normal">{city.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Vibe */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-950 font-black text-sm">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>What kind of travel experience do you want?</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'balanced', label: 'Balanced Signature Mix', emoji: '🌟', desc: 'A taste of palaces, hills, and coastal flavors' },
                  { id: 'heritage', label: 'UNESCO & Royal Heritage', emoji: '🏛️', desc: 'Hampi ruins, Mysore Palace, Hoysala stone carvings' },
                  { id: 'coastal', label: 'Beaches & Cliff Shrines', emoji: '🏖️', desc: 'Gokarna Om beach, Murudeshwara, Udupi seafood' },
                  { id: 'coffee-hills', label: 'Coffee Hills & Rainforests', emoji: '⛰️', desc: 'Mullayanagiri, Coorg estates, waterfalls' },
                  { id: 'nature', label: 'Wildlife Safaris & Waterfalls', emoji: '🐅', desc: 'Kabini tiger reserve, Jog Falls, Kaveri cataracts' },
                ].map((vibeItem) => {
                  const isSelected = inputs.vibe === vibeItem.id;
                  return (
                    <button
                      key={vibeItem.id}
                      type="button"
                      onClick={() => setInputs({ ...inputs, vibe: vibeItem.id as TripVibe })}
                      className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-sm font-bold'
                          : 'border-stone-200 bg-white hover:border-amber-400 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{vibeItem.emoji}</span>
                        <div className="font-extrabold text-sm text-stone-950">{vibeItem.label}</div>
                      </div>
                      <p className="text-3xs text-stone-600 mt-1 pl-7">{vibeItem.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Duration */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-950 font-black text-sm">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>How many days do you have?</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { days: 1, label: '1 Day', note: 'Quick Daytrip' },
                  { days: 2, label: '2 Days', note: 'Weekend Break' },
                  { days: 3, label: '3 Days', note: 'Classic Circuit' },
                  { days: 5, label: '5 Days', note: 'Deep Explorer' },
                  { days: 7, label: '7 Days', note: 'Grand Odyssey' },
                ].map((dur) => {
                  const isSelected = inputs.durationDays === dur.days;
                  return (
                    <button
                      key={dur.days}
                      type="button"
                      onClick={() => setInputs({ ...inputs, durationDays: dur.days as any })}
                      className={`p-3.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50 text-teal-950 font-black shadow-sm'
                          : 'border-stone-200 bg-white hover:border-teal-400 text-stone-800'
                      }`}
                    >
                      <div className="text-lg font-black">{dur.label}</div>
                      <div className="text-3xs text-stone-500 mt-0.5">{dur.note}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Budget Tier */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-950 font-black text-sm">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>What is your budget tier per day?</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    tier: 'backpacker',
                    name: 'Backpacker / Student',
                    price: '₹1,000 – ₹2,000 / day',
                    desc: 'Hostels, local darshinis, KSRTC buses, self-guided audio exploration.',
                  },
                  {
                    tier: 'comfort',
                    name: 'Comfort / Mid-Range',
                    price: '₹4,500 – ₹8,000 / day',
                    desc: '3-star hotels, coffee homestays, AC cab, full meals & all entry fees.',
                  },
                  {
                    tier: 'luxury',
                    name: 'Luxury / Heritage Resort',
                    price: '₹15,000+ / day',
                    desc: 'Royal palaces, private safari jeeps, premium estate villas, fine dining.',
                  },
                ].map((b) => {
                  const isSelected = inputs.budgetTier === b.tier;
                  return (
                    <button
                      key={b.tier}
                      type="button"
                      onClick={() => setInputs({ ...inputs, budgetTier: b.tier as BudgetTier })}
                      className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm font-bold'
                          : 'border-stone-200 bg-white hover:border-emerald-400 text-stone-800'
                      }`}
                    >
                      <div className="font-extrabold text-sm">{b.name}</div>
                      <div className="text-xs font-black text-emerald-700 mt-1">{b.price}</div>
                      <p className="text-3xs text-stone-600 mt-2 leading-relaxed">{b.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Travel Style */}
          {activeStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-950 font-black text-sm">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Who is traveling with you?</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'solo', name: 'Solo Explorer', emoji: '🎒', desc: 'Flexible pacing, budget stays, photography' },
                  { id: 'couple', name: 'Couple Gateway', emoji: '💑', desc: 'Scenic sunsets, romantic viewpoints, quiet dinners' },
                  { id: 'family', name: 'Family with Kids', emoji: '👨‍👩‍👧', desc: 'Comfortable transport, kid-friendly safaris, easy steps' },
                  { id: 'friends', name: 'Friends Group', emoji: '🚗', desc: 'Road trips, active beach treks, late-night cafes' },
                ].map((style) => {
                  const isSelected = inputs.travelStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setInputs({ ...inputs, travelStyle: style.id as TravelStyle })}
                      className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 text-purple-950 shadow-sm font-bold'
                          : 'border-stone-200 bg-white hover:border-purple-400 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{style.emoji}</span>
                        <span className="font-extrabold text-sm">{style.name}</span>
                      </div>
                      <p className="text-3xs text-stone-600 mt-1 pl-7">{style.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-stone-50 p-4 sm:p-5 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Previous
          </button>

          {activeStep < 5 ? (
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Next Step →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartGenerate}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-red-700 to-amber-600 text-white text-xs sm:text-sm font-black shadow-lg hover:from-red-800 hover:to-amber-700 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate My Smart Itinerary</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
