import React, { useState } from 'react';
import { RegionId } from '../types';
import { REGIONS } from '../data/regions';
import { Compass, Sparkles, MapPin } from 'lucide-react';

interface KarnatakaMapSvgProps {
  selectedRegionId: RegionId;
  onSelectRegion: (regionId: RegionId) => void;
}

interface CityPin {
  id: string;
  nameKannada: string;
  nameEnglish: string;
  regionId: RegionId;
  x: number;
  y: number;
  isCapital?: boolean;
}

const CITIES: CityPin[] = [
  { id: 'bidar', nameKannada: 'ಬೀದರ್', nameEnglish: 'Bidar', regionId: 'kalyana-karnataka', x: 335, y: 50 },
  { id: 'kalaburagi', nameKannada: 'ಕಲಬುರಗಿ', nameEnglish: 'Kalaburagi', regionId: 'kalyana-karnataka', x: 360, y: 130 },
  { id: 'belagavi', nameKannada: 'ಬೆಳಗಾವಿ', nameEnglish: 'Belagavi', regionId: 'uttara-karnataka', x: 195, y: 170 },
  { id: 'dharwad', nameKannada: 'ಧಾರವಾಡ-ಹುಬ್ಬಳ್ಳಿ', nameEnglish: 'Dharwad-Hubballi', regionId: 'uttara-karnataka', x: 235, y: 235 },
  { id: 'raichur', nameKannada: 'ರಾಯಚೂರು', nameEnglish: 'Raichur', regionId: 'kalyana-karnataka', x: 395, y: 225 },
  { id: 'ballari', nameKannada: 'ಬಳ್ಳಾರಿ', nameEnglish: 'Ballari', regionId: 'kalyana-karnataka', x: 360, y: 295 },
  { id: 'karwar', nameKannada: 'ಕಾರವಾರ', nameEnglish: 'Karwar', regionId: 'karavali', x: 140, y: 260 },
  { id: 'kundapura', nameKannada: 'ಕುಂದಾಪುರ', nameEnglish: 'Kundapura', regionId: 'karavali', x: 135, y: 390 },
  { id: 'shivamogga', nameKannada: 'ಶಿವಮೊಗ್ಗ', nameEnglish: 'Shivamogga', regionId: 'malenadu', x: 215, y: 345 },
  { id: 'udupi', nameKannada: 'ಉಡುಪಿ', nameEnglish: 'Udupi', regionId: 'karavali', x: 140, y: 435 },
  { id: 'chikkamagaluru', nameKannada: 'ಚಿಕ್ಕಮಗಳೂರು', nameEnglish: 'Chikkamagaluru', regionId: 'malenadu', x: 225, y: 420 },
  { id: 'mangaluru', nameKannada: 'ಮಂಗಳೂರು', nameEnglish: 'Mangaluru', regionId: 'karavali', x: 155, y: 495 },
  { id: 'madikeri', nameKannada: 'ಮಡಿಕೇರಿ', nameEnglish: 'Madikeri (Kodagu)', regionId: 'malenadu', x: 205, y: 530 },
  { id: 'mysuru', nameKannada: 'ಮೈಸೂರು', nameEnglish: 'Mysuru', regionId: 'mysuru-mandya', x: 275, y: 585 },
  { id: 'mandya', nameKannada: 'ಮಂಡ್ಯ', nameEnglish: 'Mandya', regionId: 'mysuru-mandya', x: 310, y: 545 },
  { id: 'bengaluru', nameKannada: 'ಬೆಂಗಳೂರು', nameEnglish: 'Bengaluru', regionId: 'bengaluru-urban', x: 395, y: 510, isCapital: true },
  { id: 'kolar', nameKannada: 'ಕೋಲಾರ', nameEnglish: 'Kolar', regionId: 'bengaluru-urban', x: 445, y: 490 },
];

export const KarnatakaMapSvg: React.FC<KarnatakaMapSvgProps> = ({
  selectedRegionId,
  onSelectRegion,
}) => {
  const [hoveredRegionId, setHoveredRegionId] = useState<RegionId | null>(null);
  const [hoveredCity, setHoveredCity] = useState<CityPin | null>(null);

  const activeRegion = REGIONS.find(r => r.id === (hoveredRegionId || selectedRegionId)) || REGIONS[0];

  return (
    <div className="relative w-full bg-linear-to-b from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-stone-700 text-white overflow-hidden">
      {/* Decorative Traditional Kannada Accent Border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-red-600 via-amber-500 to-amber-400"></div>

      {/* Header Info Banner above the map */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Interactive Dialect Map of Karnataka (ಕರ್ನಾಟಕ ನಕ್ಷೆ)
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
            Select Any Region or City to Listen & Explore
          </h3>
        </div>

        {/* Quick Legend Pill */}
        <div className="flex items-center gap-2 bg-stone-800/90 px-3 py-1.5 rounded-xl border border-stone-700 text-xs">
          <span className="text-stone-400">Current Zone:</span>
          <span className="font-bold text-amber-300 font-kannada">
            {activeRegion.name.split(' (')[0]} ({activeRegion.kannadaName.split(' (')[0]})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Map Container (7 cols on large screens) */}
        <div className="lg:col-span-7 flex justify-center items-center relative select-none">
          {/* Compass Rose */}
          <div className="absolute top-2 left-2 z-10 flex flex-col items-center bg-stone-950/70 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-stone-700 text-3xs text-stone-300">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="font-bold text-amber-300">ಉ (N)</span>
            <span className="text-4xs text-stone-400">ಉತ್ತರ</span>
          </div>

          {/* Arabian Sea Label */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-3xs font-semibold uppercase tracking-widest text-teal-400/60 pointer-events-none hidden sm:block">
            ~ ಅರಬ್ಬೀ ಸಮುದ್ರ (Arabian Sea) ~
          </div>

          {/* Main Karnataka SVG Map */}
          <svg
            viewBox="0 0 520 710"
            className="w-full max-w-[440px] h-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
          >
            <defs>
              {/* Gradients for Karnataka Regions */}
              <linearGradient id="grad-uttara" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="grad-kalyana" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
              <linearGradient id="grad-karavali" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#115e59" />
              </linearGradient>
              <linearGradient id="grad-malnad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
              <linearGradient id="grad-mysuru" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#5b21b6" />
              </linearGradient>
              <linearGradient id="grad-bengaluru" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>

              {/* Active Region Glow Filter */}
              <filter id="active-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Surrounding Geography Hints */}
            <g className="text-stone-600 font-sans text-3xs select-none pointer-events-none fill-stone-600">
              <text x="210" y="50">ಮಹಾರಾಷ್ಟ್ರ (MAHARASHTRA)</text>
              <text x="420" y="80">ತೆಲಂಗಾಣ (TELANGANA)</text>
              <text x="450" y="320">ಆಂಧ್ರ (ANDHRA)</text>
              <text x="360" y="695">ತಮಿಳುನಾಡು (TAMIL NADU)</text>
              <text x="140" y="620">ಕೇರಳ (KERALA)</text>
            </g>

            {/* REGION 1: KALYANA KARNATAKA (North-East: Bidar, Kalaburagi, Yadgir, Raichur, Koppal, Ballari) */}
            <path
              id="path-kalyana-karnataka"
              d="M 320,30 
                 C 340,20 355,30 365,55 
                 C 385,80 415,110 425,160 
                 C 435,200 440,240 420,270 
                 C 405,290 395,310 380,325 
                 C 360,340 330,330 310,310 
                 C 300,270 295,240 290,190 
                 C 285,140 295,100 305,65 
                 Z"
              fill={selectedRegionId === 'kalyana-karnataka' ? 'url(#grad-kalyana)' : (hoveredRegionId === 'kalyana-karnataka' ? '#ea580c' : '#c2410c')}
              fillOpacity={selectedRegionId === 'kalyana-karnataka' ? '1' : '0.82'}
              stroke={selectedRegionId === 'kalyana-karnataka' ? '#fbbf24' : '#ffffff'}
              strokeWidth={selectedRegionId === 'kalyana-karnataka' ? '3' : '1.5'}
              filter={selectedRegionId === 'kalyana-karnataka' ? 'url(#active-glow)' : undefined}
              className="cursor-pointer transition-all duration-200 hover:fill-orange-500 hover:opacity-100"
              onClick={() => onSelectRegion('kalyana-karnataka')}
              onMouseEnter={() => setHoveredRegionId('kalyana-karnataka')}
              onMouseLeave={() => setHoveredRegionId(null)}
            />

            {/* REGION 2: UTTARA KARNATAKA / KITTUR (North-West: Belagavi, Dharwad, Bagalkote, Vijayapura, Gadag, Haveri) */}
            <path
              id="path-uttara-karnataka"
              d="M 215,95 
                 C 245,65 285,60 305,65 
                 C 295,100 285,140 290,190 
                 C 295,240 300,270 310,310 
                 C 280,325 240,320 205,305 
                 C 185,295 170,275 165,245 
                 C 160,205 165,170 180,140 
                 C 195,115 205,105 215,95 
                 Z"
              fill={selectedRegionId === 'uttara-karnataka' ? 'url(#grad-uttara)' : (hoveredRegionId === 'uttara-karnataka' ? '#dc2626' : '#991b1b')}
              fillOpacity={selectedRegionId === 'uttara-karnataka' ? '1' : '0.82'}
              stroke={selectedRegionId === 'uttara-karnataka' ? '#fbbf24' : '#ffffff'}
              strokeWidth={selectedRegionId === 'uttara-karnataka' ? '3' : '1.5'}
              filter={selectedRegionId === 'uttara-karnataka' ? 'url(#active-glow)' : undefined}
              className="cursor-pointer transition-all duration-200 hover:fill-red-500 hover:opacity-100"
              onClick={() => onSelectRegion('uttara-karnataka')}
              onMouseEnter={() => setHoveredRegionId('uttara-karnataka')}
              onMouseLeave={() => setHoveredRegionId(null)}
            />

            {/* REGION 3: KARAVALI & COASTAL (West Coast strip: Karwar, Kumta, Kundapura, Udupi, Mangaluru) */}
            <path
              id="path-karavali"
              d="M 130,240 
                 C 150,235 165,245 165,265 
                 C 160,310 155,360 150,410 
                 C 145,460 150,490 160,520 
                 C 150,530 135,525 130,510 
                 C 120,470 115,420 120,370 
                 C 125,320 120,280 130,240 
                 Z"
              fill={selectedRegionId === 'karavali' ? 'url(#grad-karavali)' : (hoveredRegionId === 'karavali' ? '#0d9488' : '#115e59')}
              fillOpacity={selectedRegionId === 'karavali' ? '1' : '0.82'}
              stroke={selectedRegionId === 'karavali' ? '#fbbf24' : '#ffffff'}
              strokeWidth={selectedRegionId === 'karavali' ? '3' : '1.5'}
              filter={selectedRegionId === 'karavali' ? 'url(#active-glow)' : undefined}
              className="cursor-pointer transition-all duration-200 hover:fill-teal-500 hover:opacity-100"
              onClick={() => onSelectRegion('karavali')}
              onMouseEnter={() => setHoveredRegionId('karavali')}
              onMouseLeave={() => setHoveredRegionId(null)}
            />

            {/* REGION 4: MALNAD & WESTERN GHATS (Rainforest Hills: Shivamogga, Chikkamagaluru, Hassan, Kodagu) */}
            <path
              id="path-malenadu"
              d="M 165,265 
                 C 185,295 205,305 240,320 
                 C 255,340 265,370 270,410 
                 C 275,450 260,490 245,520 
                 C 225,550 195,560 180,545 
                 C 165,530 160,520 160,520 
                 C 150,490 145,460 150,410 
                 C 155,360 160,310 165,265 
                 Z"
              fill={selectedRegionId === 'malenadu' ? 'url(#grad-malnad)' : (hoveredRegionId === 'malenadu' ? '#16a34a' : '#166534')}
              fillOpacity={selectedRegionId === 'malenadu' ? '1' : '0.82'}
              stroke={selectedRegionId === 'malenadu' ? '#fbbf24' : '#ffffff'}
              strokeWidth={selectedRegionId === 'malenadu' ? '3' : '1.5'}
              filter={selectedRegionId === 'malenadu' ? 'url(#active-glow)' : undefined}
              className="cursor-pointer transition-all duration-200 hover:fill-emerald-500 hover:opacity-100"
              onClick={() => onSelectRegion('malenadu')}
              onMouseEnter={() => setHoveredRegionId('malenadu')}
              onMouseLeave={() => setHoveredRegionId(null)}
            />

            {/* REGION 5: OLD MYSURU (Southern Heritage: Mysuru, Mandya, Chamarajanagar, Ramanagara, Tumakuru) */}
            <path
              id="path-mysuru-mandya"
              d="M 240,320 
                 C 280,325 310,310 330,330 
                 C 345,350 350,380 345,420 
                 C 340,460 335,500 340,540 
                 C 345,580 330,620 310,650 
                 C 290,670 260,675 240,650 
                 C 215,620 205,580 220,550 
                 C 245,520 260,490 270,410 
                 C 265,370 255,340 240,320 
                 Z"
              fill={selectedRegionId === 'mysuru-mandya' ? 'url(#grad-mysuru)' : (hoveredRegionId === 'mysuru-mandya' ? '#8b5cf6' : '#5b21b6')}
              fillOpacity={selectedRegionId === 'mysuru-mandya' ? '1' : '0.82'}
              stroke={selectedRegionId === 'mysuru-mandya' ? '#fbbf24' : '#ffffff'}
              strokeWidth={selectedRegionId === 'mysuru-mandya' ? '3' : '1.5'}
              filter={selectedRegionId === 'mysuru-mandya' ? 'url(#active-glow)' : undefined}
              className="cursor-pointer transition-all duration-200 hover:fill-purple-500 hover:opacity-100"
              onClick={() => onSelectRegion('mysuru-mandya')}
              onMouseEnter={() => setHoveredRegionId('mysuru-mandya')}
              onMouseLeave={() => setHoveredRegionId(null)}
            />

            {/* REGION 6: BENGALURU URBAN & RURAL (Metropolitan & Eastern Plateau: Bengaluru, Kolar, Chikkaballapura) */}
            <path
              id="path-bengaluru-urban"
              d="M 330,330 
                 C 360,340 380,325 400,340 
                 C 430,360 455,395 465,440 
                 C 475,490 460,535 435,565 
                 C 405,595 375,590 355,570 
                 C 340,540 335,500 345,420 
                 C 350,380 345,350 330,330 
                 Z"
              fill={selectedRegionId === 'bengaluru-urban' ? 'url(#grad-bengaluru)' : (hoveredRegionId === 'bengaluru-urban' ? '#2563eb' : '#1e40af')}
              fillOpacity={selectedRegionId === 'bengaluru-urban' ? '1' : '0.82'}
              stroke={selectedRegionId === 'bengaluru-urban' ? '#fbbf24' : '#ffffff'}
              strokeWidth={selectedRegionId === 'bengaluru-urban' ? '3' : '1.5'}
              filter={selectedRegionId === 'bengaluru-urban' ? 'url(#active-glow)' : undefined}
              className="cursor-pointer transition-all duration-200 hover:fill-blue-500 hover:opacity-100"
              onClick={() => onSelectRegion('bengaluru-urban')}
              onMouseEnter={() => setHoveredRegionId('bengaluru-urban')}
              onMouseLeave={() => setHoveredRegionId(null)}
            />

            {/* REGION LABELS ON MAP */}
            <g className="font-kannada font-black text-xs select-none pointer-events-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {/* Uttara Karnataka */}
              <text x="235" y="195" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800">
                ಉತ್ತರ ಕರ್ನಾಟಕ
              </text>
              <text x="235" y="210" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="600">
                (Kittur Zone)
              </text>

              {/* Kalyana Karnataka */}
              <text x="365" y="180" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800">
                ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ
              </text>
              <text x="365" y="195" textAnchor="middle" fill="#fed7aa" fontSize="9" fontWeight="600">
                (Hyderabad-Kar)
              </text>

              {/* Karavali */}
              <text x="105" y="360" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" transform="rotate(-90, 105, 360)">
                ಕರಾವಳಿ (Coastal)
              </text>

              {/* Malnad */}
              <text x="210" y="440" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="800">
                ಮಲೆನಾಡು
              </text>
              <text x="210" y="453" textAnchor="middle" fill="#bbf7d0" fontSize="9" fontWeight="600">
                (Malnad)
              </text>

              {/* Mysuru */}
              <text x="280" y="520" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800">
                ಹಳೆ ಮೈಸೂರು
              </text>
              <text x="280" y="533" textAnchor="middle" fill="#e9d5ff" fontSize="9" fontWeight="600">
                (Old Mysuru)
              </text>

              {/* Bengaluru */}
              <text x="400" y="470" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800">
                ಬೆಂಗಳೂರು
              </text>
              <text x="400" y="483" textAnchor="middle" fill="#bfdbfe" fontSize="9" fontWeight="600">
                (Bengaluru)
              </text>
            </g>

            {/* CITY PINPOINTS */}
            <g>
              {CITIES.map((city) => {
                const isSelected = city.regionId === selectedRegionId;
                const isHovered = hoveredCity?.id === city.id;
                return (
                  <g
                    key={city.id}
                    className="cursor-pointer group"
                    onClick={() => onSelectRegion(city.regionId)}
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    {/* Pulsing ring for capital / major hubs */}
                    {city.isCapital && (
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r="10"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="1.5"
                        className="animate-ping"
                      />
                    )}
                    {/* Outer marker */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={city.isCapital ? '5.5' : (isSelected ? '4.5' : '3.5')}
                      fill={city.isCapital ? '#fbbf24' : (isSelected ? '#fef08a' : '#ffffff')}
                      stroke="#1c1917"
                      strokeWidth="1.5"
                      className="transition-transform group-hover:scale-125"
                    />
                    {/* City label on hover or if capital */}
                    {(isHovered || city.isCapital || city.id === 'dharwad' || city.id === 'mangaluru' || city.id === 'mysuru') && (
                      <text
                        x={city.x}
                        y={city.y - 8}
                        textAnchor="middle"
                        fill={isHovered ? '#fbbf24' : '#ffffff'}
                        fontSize="8.5"
                        fontWeight="700"
                        className="font-kannada drop-shadow-[0_1px_3px_rgba(0,0,0,1)] pointer-events-none"
                      >
                        {city.nameKannada}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Right 5 Cols: Quick Region Selector Cards & Instructions */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800">
            <span className="text-3xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Click a Zone on the Map or Below:</span>
            </span>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {REGIONS.map((region) => {
                const isSelected = region.id === selectedRegionId;
                return (
                  <button
                    key={region.id}
                    onClick={() => onSelectRegion(region.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 font-black border-amber-300 shadow-md scale-[1.02]'
                        : 'bg-stone-800/80 text-stone-200 border-stone-700 hover:border-amber-400 hover:bg-stone-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-3xs uppercase font-extrabold ${isSelected ? 'text-stone-900' : 'text-stone-400'}`}>
                          {region.slotKey.replace('_', ' ')}
                        </span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping"></span>}
                      </div>
                      <div className="text-xs font-black mt-0.5 line-clamp-1">
                        {region.name.split(' (')[0]}
                      </div>
                    </div>
                    <div className={`font-kannada text-2xs mt-1 font-bold ${isSelected ? 'text-stone-900' : 'text-amber-400'}`}>
                      {region.kannadaName.split(' (')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Tip Banner */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Tip:</strong> Click on any zone to reveal its iconic local greeting, speech cadence, and play real audio pronunciation below!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};