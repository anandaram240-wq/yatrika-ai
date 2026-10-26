import React, { useState } from 'react';
import { DESTINATIONS } from '../data/destinations';
import { Destination } from '../types';
import { Search, Compass, Sparkles, ArrowRight } from 'lucide-react';

interface DestinationExplorerProps {
  onSelectDestination?: (dest: Destination) => void;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  onSelectDestination,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'heritage', label: 'UNESCO & Heritage', icon: '🏛️' },
    { id: 'beach', label: 'Beaches & Coast', icon: '🏖️' },
    { id: 'hill-station', label: 'Coffee Hills', icon: '⛰️' },
    { id: 'waterfall', label: 'Waterfalls', icon: '🌊' },
    { id: 'temple', label: 'Temples & Mathas', icon: '🪔' },
    { id: 'wildlife', label: 'Wildlife Reserves', icon: '🐅' },
  ];

  const filteredDestinations = DESTINATIONS.filter((dest) => {
    const matchesCat = selectedCategory === 'all' || dest.category === selectedCategory;
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.nameKannada.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-teal-800 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-400/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-red-600 via-amber-400 to-amber-500"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-3xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Destination Database</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Explore 20+ Curated Karnataka Destinations
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl font-medium">
              Every site includes verified ASI & KSTDC entry fees, authentic visiting hours, distance from Bengaluru, and local culinary pairings.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-900/90 px-4 py-2 rounded-2xl border border-stone-800 text-xs self-start md:self-center">
            <Compass className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-stone-200">{DESTINATIONS.length} Documented Sites</span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, temple, beach, or district..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-2 ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-700 shadow-sm font-black'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-teal-300 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-2xl border-2 border-stone-200 hover:border-teal-400 hover:shadow-xl transition-all p-5 sm:p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                  {dest.category.toUpperCase()}
                </span>
                <span className="text-3xl">{dest.imageEmoji}</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-stone-950">
                  {dest.name}
                </h3>
                <p className="font-kannada text-xs font-bold text-red-700 mt-0.5">
                  {dest.nameKannada} ({dest.district} District)
                </p>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-normal">
                {dest.description}
              </p>

              {/* Highlights */}
              <div className="space-y-1">
                <div className="text-3xs uppercase font-extrabold text-stone-400">Key Highlights:</div>
                <ul className="space-y-1 text-2xs text-stone-700">
                  {dest.highlights.slice(0, 2).map((h, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visiting Details */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-2xs space-y-1 text-stone-600">
                <div className="flex items-center justify-between">
                  <span>Entry Ticket:</span>
                  <strong className="text-stone-900">₹{dest.entryFee.indianAdult}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Hours:</span>
                  <strong className="text-stone-900">{dest.timings.split(' (')[0]}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bengaluru Distance:</span>
                  <strong className="text-stone-900">~{dest.distanceFromBengaluruKm} km ({dest.drivingTimeFromBengaluruHours} hrs)</strong>
                </div>
              </div>
            </div>

            {/* Food pairing */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-2xs">
              <span className="text-stone-500 font-medium">
                Must Eat: <strong className="text-stone-800">{dest.mustEatDishes[0]}</strong>
              </span>

              {onSelectDestination && (
                <button
                  onClick={() => onSelectDestination(dest)}
                  className="flex items-center gap-1 text-teal-700 font-bold hover:underline cursor-pointer"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
