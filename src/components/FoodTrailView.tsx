import React, { useState } from 'react';
import { FOOD_TRAIL } from '../data/foodTrail';
import { Utensils, Sparkles, MapPin } from 'lucide-react';

export const FoodTrailView: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regionTabs = [
    { id: 'all', label: 'All Regions' },
    { id: 'mysuru-mandya', label: 'Old Mysuru' },
    { id: 'karavali', label: 'Coastal Karavali' },
    { id: 'malenadu', label: 'Coorg & Malnad' },
    { id: 'uttara-karnataka', label: 'North Karnataka' },
    { id: 'kalyana-karnataka', label: 'Kalyana Karnataka' },
    { id: 'bengaluru-urban', label: 'Bengaluru Heritage' },
  ];

  const filteredDishes = FOOD_TRAIL.filter(
    (dish) => selectedRegion === 'all' || dish.region === selectedRegion
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-orange-800 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-400/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-red-600 via-amber-400 to-amber-500"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-3xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Culinary Cultural Mapping</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Karnataka Regional Food Trail
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl font-medium">
              Every district in Karnataka has an unmistakable culinary identity. Discover signature regional delicacies, century-old legacy eateries, and average costs.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-900/90 px-4 py-2 rounded-2xl border border-stone-800 text-xs self-start md:self-center">
            <Utensils className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-stone-200">{FOOD_TRAIL.length} Iconic Specialities</span>
          </div>
        </div>
      </div>

      {/* Region Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {regionTabs.map((tab) => {
          const isSelected = selectedRegion === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedRegion(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-2 ${
                isSelected
                  ? 'bg-orange-600 text-white border-orange-700 shadow-sm font-black'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-orange-300 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-2xl border-2 border-stone-200 hover:border-orange-400 hover:shadow-lg transition-all p-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md">
                  {dish.regionName}
                </span>
                <span className="text-2xl">{dish.emoji}</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-stone-950">
                  {dish.name}
                </h3>
                <p className="font-kannada text-xs font-bold text-red-700 mt-0.5">
                  {dish.nameKannada}
                </p>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-normal">
                {dish.description}
              </p>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-2xs space-y-1">
                <div className="flex items-center gap-1 text-stone-500 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>Must-Visit Spot:</span>
                </div>
                <div className="font-extrabold text-stone-900">{dish.famousPlace}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                {dish.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-4xs font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-xs font-black text-emerald-700">
                {dish.avgPrice}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
