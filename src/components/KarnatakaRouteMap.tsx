import React, { useState } from 'react';
import { GeneratedItinerary, Destination } from '../types';
import { DESTINATIONS } from '../data/destinations';
import { Compass, Sparkles } from 'lucide-react';

interface KarnatakaRouteMapProps {
  itinerary: GeneratedItinerary;
  onSelectDestination?: (dest: Destination) => void;
}

export const KarnatakaRouteMap: React.FC<KarnatakaRouteMapProps> = ({
  itinerary,
  onSelectDestination,
}) => {
  const [hoveredDest, setHoveredDest] = useState<Destination | null>(null);

  // Collect all destinations in the active itinerary
  const itineraryDestinations = itinerary.days.flatMap(d => d.slots.map(s => s.destination));
  const uniqueItineraryDestIds = Array.from(new Set(itineraryDestinations.map(d => d.id)));

  // SVG Coordinate mapping for Karnataka tourist hubs (ViewBox: 520 x 710)
  const DEST_SVG_COORDINATES: Record<string, { x: number; y: number }> = {
    'dest-hampi': { x: 345, y: 220 },
    'dest-mysore-palace': { x: 275, y: 585 },
    'dest-coorg-madikeri': { x: 205, y: 530 },
    'dest-gokarna': { x: 135, y: 340 },
    'dest-jog-falls': { x: 195, y: 310 },
    'dest-murudeshwara': { x: 135, y: 390 },
    'dest-chikmagalur': { x: 225, y: 420 },
    'dest-belur-halebidu': { x: 250, y: 465 },
    'dest-kabini-nagarhole': { x: 250, y: 620 },
    'dest-badami': { x: 285, y: 155 },
    'dest-shivanasamudra': { x: 330, y: 570 },
    'dest-nandi-hills': { x: 410, y: 470 },
    'dest-udupi': { x: 140, y: 435 },
  };

  // Build route polyline points through the itinerary
  const routePoints = uniqueItineraryDestIds
    .map(id => DEST_SVG_COORDINATES[id])
    .filter(Boolean)
    .map(pt => `${pt.x},${pt.y}`)
    .join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-stone-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Top Banner Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-red-600 via-amber-400 to-amber-500"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-3xs uppercase font-extrabold tracking-wider text-amber-400">
                Visual Karnataka Route Tracker
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Active Itinerary Highway Route Map
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Glowing route line connects the stops of your {itinerary.summary.totalDays}-Day customized trip (~{itinerary.summary.totalDistanceKm} km)
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-800/80 px-4 py-2 rounded-2xl border border-stone-700 text-xs">
            <span className="text-stone-400">Stops in this route:</span>
            <span className="font-extrabold text-amber-300">{uniqueItineraryDestIds.length} Destinations</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Vector Map */}
          <div className="lg:col-span-7 flex justify-center relative select-none">
            {/* Compass */}
            <div className="absolute top-2 left-2 z-10 flex flex-col items-center bg-stone-950/80 px-2.5 py-1.5 rounded-xl border border-stone-700 text-3xs text-stone-300">
              <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="font-bold text-amber-300">ಉತ್ತರ (N)</span>
            </div>

            {/* Sea Label */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-3xs font-bold uppercase tracking-widest text-teal-400/50 pointer-events-none hidden sm:block">
              ~ ಅರಬ್ಬೀ ಸಮುದ್ರ (Arabian Sea) ~
            </div>

            <svg
              viewBox="0 0 520 710"
              className="w-full max-w-[440px] h-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
            >
              <defs>
                <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.9" />
                </filter>
              </defs>

              {/* Karnataka Regions Silhouette (Dark Elegant Backdrop) */}
              {/* North-East Kalyana */}
              <path
                d="M 320,30 C 340,20 355,30 365,55 C 385,80 415,110 425,160 C 435,200 440,240 420,270 C 405,290 395,310 380,325 C 360,340 330,330 310,310 C 300,270 295,240 290,190 C 285,140 295,100 305,65 Z"
                fill="#3f3f46"
                stroke="#52525b"
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* North-West Kittur */}
              <path
                d="M 215,95 C 245,65 285,60 305,65 C 295,100 285,140 290,190 C 295,240 300,270 310,310 C 280,325 240,320 205,305 C 185,295 170,275 165,245 C 160,205 165,170 180,140 C 195,115 205,105 215,95 Z"
                fill="#3f3f46"
                stroke="#52525b"
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Karavali Coast */}
              <path
                d="M 130,240 C 150,235 165,245 165,265 C 160,310 155,360 150,410 C 145,460 150,490 160,520 C 150,530 135,525 130,510 C 120,470 115,420 120,370 C 125,320 120,280 130,240 Z"
                fill="#134e4a"
                stroke="#2dd4bf"
                strokeWidth="1.5"
                opacity="0.7"
              />
              {/* Malenadu Western Ghats */}
              <path
                d="M 165,265 C 185,295 205,305 240,320 C 255,340 265,370 270,410 C 275,450 260,490 245,520 C 225,550 195,560 180,545 C 165,530 160,520 160,520 C 150,490 145,460 150,410 C 155,360 160,310 165,265 Z"
                fill="#14532d"
                stroke="#4ade80"
                strokeWidth="1.5"
                opacity="0.7"
              />
              {/* Old Mysuru */}
              <path
                d="M 240,320 C 280,325 310,310 330,330 C 345,350 350,380 345,420 C 340,460 335,500 340,540 C 345,580 330,620 310,650 C 290,670 260,675 240,650 C 215,620 205,580 220,550 C 245,520 260,490 270,410 C 265,370 255,340 240,320 Z"
                fill="#581c87"
                stroke="#c084fc"
                strokeWidth="1.5"
                opacity="0.7"
              />
              {/* Bengaluru Metropolitan */}
              <path
                d="M 330,330 C 360,340 380,325 400,340 C 430,360 455,395 465,440 C 475,490 460,535 435,565 C 405,595 375,590 355,570 C 340,540 335,500 345,420 C 350,380 345,350 330,330 Z"
                fill="#1e3a8a"
                stroke="#60a5fa"
                strokeWidth="1.5"
                opacity="0.7"
              />

              {/* Glowing Highway Route Polyline */}
              {routePoints && (
                <polyline
                  points={routePoints}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  strokeDasharray="6,4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#route-glow)"
                  className="animate-pulse"
                />
              )}

              {/* Destination Pins on Map */}
              {DESTINATIONS.map((dest) => {
                const coords = DEST_SVG_COORDINATES[dest.id];
                if (!coords) return null;
                const isPartOfRoute = uniqueItineraryDestIds.includes(dest.id);
                const isHovered = hoveredDest?.id === dest.id;

                return (
                  <g
                    key={dest.id}
                    className="cursor-pointer group"
                    onClick={() => onSelectDestination && onSelectDestination(dest)}
                    onMouseEnter={() => setHoveredDest(dest)}
                    onMouseLeave={() => setHoveredDest(null)}
                  >
                    {/* Pulsing ring for active stops */}
                    {isPartOfRoute && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="12"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="1.5"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Pin */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isPartOfRoute ? '7' : '4'}
                      fill={isPartOfRoute ? '#dc2626' : '#71717a'}
                      stroke={isPartOfRoute ? '#ffffff' : '#18181b'}
                      strokeWidth={isPartOfRoute ? '2' : '1'}
                      className="transition-transform group-hover:scale-125"
                    />

                    {/* Center Core */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isPartOfRoute ? '3' : '1.5'}
                      fill={isPartOfRoute ? '#fbbf24' : '#ffffff'}
                    />

                    {/* Pin Label */}
                    {(isPartOfRoute || isHovered) && (
                      <text
                        x={coords.x}
                        y={coords.y - 12}
                        textAnchor="middle"
                        fill={isHovered ? '#fbbf24' : '#ffffff'}
                        fontSize="9"
                        fontWeight="800"
                        className="font-kannada drop-shadow-[0_2px_4px_rgba(0,0,0,1)] pointer-events-none"
                      >
                        {dest.nameKannada.split(' (')[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right Column: Route Stops List & Selected Stop Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Highlighted Destination Card */}
            {hoveredDest ? (
              <div className="bg-stone-800 rounded-2xl p-5 border-2 border-amber-400 animate-in fade-in duration-150">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-amber-400">
                  Inspecting Stop:
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl">{hoveredDest.imageEmoji}</span>
                  <div>
                    <h4 className="text-base font-black text-white">{hoveredDest.name}</h4>
                    <p className="font-kannada text-xs text-amber-300 font-bold">{hoveredDest.nameKannada}</p>
                  </div>
                </div>

                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  {hoveredDest.description}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-700 grid grid-cols-2 gap-2 text-2xs text-stone-400">
                  <div>
                    Entry Fee: <strong className="text-white">₹{hoveredDest.entryFee.indianAdult}</strong>
                  </div>
                  <div>
                    Bengaluru Distance: <strong className="text-white">~{hoveredDest.distanceFromBengaluruKm} km</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Stops in this Highway Route:</span>
                </span>

                <div className="space-y-2 mt-3">
                  {uniqueItineraryDestIds.map((destId, i) => {
                    const d = DESTINATIONS.find(item => item.id === destId);
                    if (!d) return null;
                    return (
                      <div
                        key={d.id}
                        onMouseEnter={() => setHoveredDest(d)}
                        className="p-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-400 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-600 text-white font-extrabold text-2xs flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="font-bold text-xs text-white">{d.name.split(' (')[0]}</span>
                        </div>
                        <span className="font-kannada text-2xs text-amber-300 font-medium">
                          {d.district}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Route Highlights Note */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
              <strong className="block font-bold">Smart Highway Guidance:</strong>
              <p className="leading-relaxed text-3xs text-stone-300">
                Routes avoid backtracking by grouping contiguous districts (e.g. Mysuru → Kodagu or Udupi → Uttara Kannada) and account for realistic Karnataka hill-road driving speeds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
