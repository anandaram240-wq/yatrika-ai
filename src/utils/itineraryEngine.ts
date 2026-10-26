// YatriKa AI — Smart Karnataka Itinerary Generation Engine
// Implements deterministic, geographically optimized multi-day route planning with zero API latency

import { 
  TripInputs, 
  GeneratedItinerary, 
  ItineraryDay, 
  ItinerarySlot, 
  Destination, 
  BudgetTier, 
  TravelPhrase 
} from '../types';
import { DESTINATIONS } from '../data/destinations';
import { TRAVEL_PHRASES } from '../data/travelPhrases';
import { FOOD_TRAIL } from '../data/foodTrail';

const getDest = (id: string): Destination => 
  DESTINATIONS.find(d => d.id === id) || DESTINATIONS[0];

const getPhrase = (id: string): TravelPhrase => 
  TRAVEL_PHRASES.find(p => p.id === id) || TRAVEL_PHRASES[0];

// Budget multipliers per tier (per day costs in INR)
const BUDGET_RATES: Record<BudgetTier, { stay: number; food: number; transit: number }> = {
  backpacker: { stay: 750, food: 350, transit: 300 },
  comfort: { stay: 3200, food: 1100, transit: 1600 },
  luxury: { stay: 12500, food: 3200, transit: 4200 },
};

export function generateSmartItinerary(inputs: TripInputs): GeneratedItinerary {
  const { startingCity, vibe, durationDays, budgetTier } = inputs;
  const rates = BUDGET_RATES[budgetTier];

  const days: ItineraryDay[] = [];
  const smartAlerts: string[] = [];

  // Add realistic safety & travel warnings
  smartAlerts.push('Western Ghats Safety: Avoid driving mountain passes (Shiradi/Charmadi) after 6:30 PM due to dense fog and sharp hairpin curves.');
  if (vibe === 'coastal') {
    smartAlerts.push('Coastal Advisory: Swimming in the Arabian Sea is strictly regulated; follow red/green lifeguard flags at Malpe and Gokarna.');
  }
  if (vibe === 'heritage') {
    smartAlerts.push('Temple Etiquette: Traditional modest attire is mandatory inside active shrines; footwear must be deposited at temple counters.');
  }

  // Curate day-by-day plans based on duration and vibe
  if (durationDays === 1) {
    // 1-Day Trip
    if (vibe === 'coastal') {
      days.push(createCoastalDay1(rates));
    } else if (vibe === 'nature' || vibe === 'coffee-hills') {
      days.push(createNandiNatureDay(rates));
    } else {
      days.push(createMysoreDay1(rates));
    }
  } else if (durationDays === 2) {
    // 2-Day Weekend
    if (vibe === 'coastal') {
      days.push(createCoastalDay1(rates));
      days.push(createGokarnaDay(rates, 2));
    } else if (vibe === 'coffee-hills' || vibe === 'nature') {
      days.push(createChikmagalurDay(rates, 1));
      days.push(createBelurHalebiduDay(rates, 2));
    } else {
      days.push(createMysoreDay1(rates));
      days.push(createShivanasamudraDay(rates, 2));
    }
  } else if (durationDays === 3) {
    // 3-Day Classic Circuit
    if (vibe === 'coastal') {
      days.push(createCoastalDay1(rates));
      days.push(createMurudeshwaraDay(rates, 2));
      days.push(createGokarnaDay(rates, 3));
    } else if (vibe === 'heritage') {
      days.push(createHampiDay1(rates, 1));
      days.push(createHampiDay2(rates, 2));
      days.push(createBadamiDay(rates, 3));
    } else {
      // Royal Mysore & Coorg Hills
      days.push(createMysoreDay1(rates));
      days.push(createCoorgDay(rates, 2));
      days.push(createKabiniSafariDay(rates, 3));
    }
  } else if (durationDays === 5) {
    // 5-Day Grand Tour
    if (vibe === 'heritage') {
      days.push(createHampiDay1(rates, 1));
      days.push(createHampiDay2(rates, 2));
      days.push(createBadamiDay(rates, 3));
      days.push(createBelurHalebiduDay(rates, 4));
      days.push(createMysoreDay1(rates, 5));
    } else {
      days.push(createMysoreDay1(rates, 1));
      days.push(createCoorgDay(rates, 2));
      days.push(createChikmagalurDay(rates, 3));
      days.push(createCoastalDay1(rates, 4));
      days.push(createGokarnaDay(rates, 5));
    }
  } else {
    // 7-Day Complete Karnataka Odyssey
    days.push(createMysoreDay1(rates, 1));
    days.push(createCoorgDay(rates, 2));
    days.push(createChikmagalurDay(rates, 3));
    days.push(createCoastalDay1(rates, 4));
    days.push(createMurudeshwaraDay(rates, 5));
    days.push(createGokarnaDay(rates, 6));
    days.push(createJogFallsDay(rates, 7));
  }

  // Calculate totals
  const totalDistanceKm = days.reduce((acc, d) => acc + d.dayTravelDistanceKm, 0);
  const totalBudgetEstimated = days.reduce((acc, d) => acc + d.dayEstimatedCost.total, 0);

  // Group phrases from all slots
  const allPhrases: TravelPhrase[] = [];
  days.forEach(d => {
    d.slots.forEach(s => {
      if (!allPhrases.some(p => p.id === s.phraseToUse.id)) {
        allPhrases.push(s.phraseToUse);
      }
    });
  });

  const regionsCovered = Array.from(
    new Set(days.flatMap(d => d.slots.map(s => s.destination.region)))
  );

  const title = `${durationDays}-Day ${vibe.toUpperCase()} Itinerary from ${startingCity.toUpperCase()}`;

  return {
    tripId: `trip-${Date.now().toString(36)}`,
    title,
    inputs,
    summary: {
      totalDays: durationDays,
      totalDistanceKm,
      totalBudgetEstimated,
      budgetPerPerson: Math.round(totalBudgetEstimated),
      regionsCovered,
      destinationsCount: days.flatMap(d => d.slots).length,
    },
    days,
    smartAlerts,
    kannadaCompanionPhrases: allPhrases,
    suggestedFoodTrail: FOOD_TRAIL.filter(f => regionsCovered.includes(f.region)),
    createdTimestamp: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  };
}

// ----------------- DAY BUILDER FACTORIES -----------------

function createMysoreDay1(rates: { stay: number; food: number; transit: number }, dayNum = 1): ItineraryDay {
  const pPalace = getDest('dest-mysore-palace');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '09:30 AM – 12:30 PM',
      destination: pPalace,
      activityTitle: 'Explore the Grand Mysore Palace & Courtyards',
      activityDescription: 'Walk through the stained-glass Kalyana Mantapa, gilded Durbar Hall, and royal carriage pavilion.',
      travelTimeFromPrev: 'Start of Day',
      travelDistanceKm: 0,
      estimatedExpense: pPalace.entryFee.indianAdult,
      insiderTip: 'Deposit footwear at the designated free counter near the South Gate.',
      phraseToUse: getPhrase('ph-temple-04'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '01:00 PM – 03:00 PM',
      destination: pPalace,
      activityTitle: 'Royal Lunch & Devaraja Market Walk',
      activityDescription: 'Relish authentic Mylari Masala Dosa followed by fresh Mysore Pak at Guru Sweet Mart.',
      travelTimeFromPrev: '15 mins drive (3 km)',
      travelDistanceKm: 3,
      estimatedExpense: 180,
      insiderTip: 'Bargain gently for sandalwood crafts and raw Mysore silk stoles.',
      phraseToUse: getPhrase('ph-shop-01'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:30 PM – 07:30 PM',
      destination: pPalace,
      activityTitle: 'Chamundi Hills Sunset & Evening Illumination',
      activityDescription: 'Climb Chamundi Hills to visit the sacred shrine, then return for the 97,000-bulb palace illumination.',
      travelTimeFromPrev: '25 mins drive (12 km)',
      travelDistanceKm: 12,
      estimatedExpense: 30,
      insiderTip: 'Illumination takes place every Sunday and public holiday between 7:00 PM and 8:00 PM.',
      phraseToUse: getPhrase('ph-trans-01'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Royal Heritage & Silk Splendour of Mysuru',
    routeOverview: 'Bengaluru / Mysore Center → Amba Vilas Palace → Devaraja Market → Chamundi Hills',
    slots,
    dayTravelDistanceKm: 35,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Mylari Masala Dosa & Filter Coffee',
      placeName: 'Hotel Original Mylari (Nazarbad)',
      approxPrice: 90,
    },
  };
}

function createCoorgDay(rates: { stay: number; food: number; transit: number }, dayNum = 2): ItineraryDay {
  const coorg = getDest('dest-coorg-madikeri');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '08:30 AM – 11:30 AM',
      destination: coorg,
      activityTitle: 'Abbey Falls & Coffee Estate Walk',
      activityDescription: 'Trek down stone paths through private cardamom and coffee plantations to view cascading Abbey Falls.',
      travelTimeFromPrev: '1.5 hrs from Mysuru',
      travelDistanceKm: 85,
      estimatedExpense: coorg.entryFee.indianAdult,
      insiderTip: 'Swimming in the falls is prohibited; enjoy the spray from the suspension footbridge.',
      phraseToUse: getPhrase('ph-emerg-02'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '12:30 PM – 03:00 PM',
      destination: coorg,
      activityTitle: 'Traditional Kodava Cuisine Tasting',
      activityDescription: 'Feast on authentic Pandi Curry soured with wild Kachampuli fruit vinegar and steamed Kadambuttu.',
      travelTimeFromPrev: '20 mins drive (8 km)',
      travelDistanceKm: 8,
      estimatedExpense: 280,
      insiderTip: 'Ask for mild spice if sensitive to dark roasted black pepper.',
      phraseToUse: getPhrase('ph-food-02'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:30 PM – 07:00 PM',
      destination: coorg,
      activityTitle: 'Sunset at Raja’s Seat & Madikeri Fort',
      activityDescription: 'Watch the evening mist roll over the Western Ghats valleys from the former pavilion of Kodagu kings.',
      travelTimeFromPrev: '10 mins drive (3 km)',
      travelDistanceKm: 3,
      estimatedExpense: 15,
      insiderTip: 'Buy authentic Coorg wildflower honey and whole black peppercorns from local cooperative shops.',
      phraseToUse: getPhrase('ph-shop-02'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Misty Coffee Plantations & Kodava Heritage of Coorg',
    routeOverview: 'Mysuru → Kushalnagar → Madikeri → Abbey Falls → Raja’s Seat',
    slots,
    dayTravelDistanceKm: 96,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Authentic Pandi Curry & Kadambuttu',
      placeName: 'Coorg Cuisine (Stuart Hill, Madikeri)',
      approxPrice: 260,
    },
  };
}

function createCoastalDay1(rates: { stay: number; food: number; transit: number }, dayNum = 1): ItineraryDay {
  const udupi = getDest('dest-udupi');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '07:30 AM – 11:30 AM',
      destination: udupi,
      activityTitle: 'Udupi Sri Krishna Matha Darshan',
      activityDescription: 'View the sacred deity through the 9-hole silver Kanakana Kindi window and walk through Car Street.',
      travelTimeFromPrev: 'Start of Day',
      travelDistanceKm: 0,
      estimatedExpense: 0,
      insiderTip: 'Men must remove shirts before entering the inner sanctum as per local tradition.',
      phraseToUse: getPhrase('ph-temple-01'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '12:00 PM – 02:30 PM',
      destination: udupi,
      activityTitle: 'Community Anna Daana Feast & Goli Baje',
      activityDescription: 'Experience the world-renowned free vegetarian temple lunch served on fresh plantain leaves.',
      travelTimeFromPrev: 'Inside temple complex',
      travelDistanceKm: 1,
      estimatedExpense: 60,
      insiderTip: 'Sip legendary Udupi filter coffee at Mitra Samaj on Car Street right after.',
      phraseToUse: getPhrase('ph-greet-03'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '03:30 PM – 07:00 PM',
      destination: udupi,
      activityTitle: 'Malpe Beach & St. Mary’s Island Cruise',
      activityDescription: 'Take a 20-minute boat ride from Malpe beach to walk amidst prehistoric hexagonal basalt lava columns.',
      travelTimeFromPrev: '15 mins drive (6 km)',
      travelDistanceKm: 6,
      estimatedExpense: 300,
      insiderTip: 'Last return ferry departs St. Mary’s Island at 5:00 PM sharp.',
      phraseToUse: getPhrase('ph-food-04'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Spiritual Flavours & Basalt Islands of Coastal Udupi',
    routeOverview: 'Mangaluru / Udupi Center → Sri Krishna Matha → Malpe Beach → St. Mary’s Island',
    slots,
    dayTravelDistanceKm: 25,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Mitra Samaj Goli Baje & Udupi Thali',
      placeName: 'Mitra Samaj (Car Street, Udupi)',
      approxPrice: 120,
    },
  };
}

function createMurudeshwaraDay(rates: { stay: number; food: number; transit: number }, dayNum = 2): ItineraryDay {
  const murud = getDest('dest-murudeshwara');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '08:30 AM – 11:30 AM',
      destination: murud,
      activityTitle: 'Ascend the 20-Storey Raja Gopuram',
      activityDescription: 'Ride the high-speed glass elevator to the 18th floor for panoramic views over the 123-foot Shiva statue and Arabian Sea.',
      travelTimeFromPrev: '1.5 hrs drive along NH 66 from Udupi',
      travelDistanceKm: 105,
      estimatedExpense: 20,
      insiderTip: 'Visit the underground Bhukailasa cave museum portraying mythological legends.',
      phraseToUse: getPhrase('ph-temple-03'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '12:30 PM – 03:00 PM',
      destination: murud,
      activityTitle: 'Coastal Seafood & Kundapura Ghee Roast',
      activityDescription: 'Dine at seaside restaurants overhanging the waves; savour spicy Kundapura chicken or paneer ghee roast.',
      travelTimeFromPrev: '5 mins drive (2 km)',
      travelDistanceKm: 2,
      estimatedExpense: 280,
      insiderTip: 'Drink fresh tender coconut water sold fresh along the beach walkway.',
      phraseToUse: getPhrase('ph-food-01'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:00 PM – 07:00 PM',
      destination: murud,
      activityTitle: 'Murudeshwara Beach Sunset & Water Sports',
      activityDescription: 'Relax on the golden sandy coastline as fishing boats return under the glowing golden Shiva silhouette.',
      travelTimeFromPrev: 'Walk along promenade',
      travelDistanceKm: 1,
      estimatedExpense: 150,
      insiderTip: 'Water sports (speedboats, jet ski) operate between October and May only.',
      phraseToUse: getPhrase('ph-trans-02'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Colossal Shiva & Arabian Sea Cliffs at Murudeshwara',
    routeOverview: 'Udupi → Kundapura → Bhatkal → Murudeshwara Temple & Beach',
    slots,
    dayTravelDistanceKm: 115,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Kundapura Chicken/Mushroom Ghee Roast with Neer Dosa',
      placeName: 'Naveen Beach Restaurant',
      approxPrice: 280,
    },
  };
}

function createGokarnaDay(rates: { stay: number; food: number; transit: number }, dayNum = 3): ItineraryDay {
  const gokarna = getDest('dest-gokarna');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '07:00 AM – 10:30 AM',
      destination: gokarna,
      activityTitle: 'Mahabaleshwar Temple & Kudle Beach',
      activityDescription: 'Seek blessings at the sacred Atmalinga temple in Gokarna village, then head to Kudle Beach.',
      travelTimeFromPrev: '1 hr drive from Murudeshwara',
      travelDistanceKm: 78,
      estimatedExpense: 0,
      insiderTip: 'Temple dress code applies: dhoti for men and saree/salwar for women.',
      phraseToUse: getPhrase('ph-temple-01'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '11:30 AM – 03:00 PM',
      destination: gokarna,
      activityTitle: 'Om Beach Cliffside Walk & Beach Shack Lunch',
      activityDescription: 'Hike the scenic cliff trail connecting Kudle to Om Beach; relax at oceanfront shacks.',
      travelTimeFromPrev: '15 mins drive (4 km)',
      travelDistanceKm: 4,
      estimatedExpense: 250,
      insiderTip: 'The cliff hike takes 35 minutes; wear comfortable walking shoes.',
      phraseToUse: getPhrase('ph-food-04'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:00 PM – 07:30 PM',
      destination: gokarna,
      activityTitle: 'Half Moon & Paradise Beach Sunset Boat',
      activityDescription: 'Hire a local fishing boat to cruise past Half Moon Beach and witness the Arabian Sea sunset.',
      travelTimeFromPrev: 'Boat ride from Om Beach',
      travelDistanceKm: 5,
      estimatedExpense: 400,
      insiderTip: 'Bargain with boatmen in Kannada using friendly address terms.',
      phraseToUse: getPhrase('ph-shop-02'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Sacred Cliffs, Om Beach & Coastal Tranquility of Gokarna',
    routeOverview: 'Murudeshwara → Kumta → Gokarna Town → Kudle Beach → Om Beach',
    slots,
    dayTravelDistanceKm: 88,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Fresh Coastal Fish Thali & Tender Coconut',
      placeName: 'Namaste Cafe (Om Beach)',
      approxPrice: 220,
    },
  };
}

function createHampiDay1(rates: { stay: number; food: number; transit: number }, dayNum = 1): ItineraryDay {
  const hampi = getDest('dest-hampi');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '06:30 AM – 11:30 AM',
      destination: hampi,
      activityTitle: 'Vittala Temple Complex & Stone Chariot',
      activityDescription: 'Marvel at the iconic 16th-century Stone Chariot, musical granite pillars, and King’s Balance.',
      travelTimeFromPrev: 'Start of Day (Hospet / Hampi)',
      travelDistanceKm: 0,
      estimatedExpense: hampi.entryFee.indianAdult,
      insiderTip: 'Battery buggies (₹30) are available from the outer parking gate to the temple entrance.',
      phraseToUse: getPhrase('ph-temple-04'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '12:30 PM – 03:00 PM',
      destination: hampi,
      activityTitle: 'Tungabhadra Riverside Lunch & Coracle Ride',
      activityDescription: 'Savour North Karnataka Jolada Rotti meals, then cross the river in a traditional round woven coracle.',
      travelTimeFromPrev: '15 mins drive (5 km)',
      travelDistanceKm: 5,
      estimatedExpense: 200,
      insiderTip: 'Coracle rides cost ~₹150–250 per head; always wear the provided life jacket.',
      phraseToUse: getPhrase('ph-greet-02'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:30 PM – 07:00 PM',
      destination: hampi,
      activityTitle: 'Hemakuta Hill Sunset over Virupaksha Temple',
      activityDescription: 'Climb the gentle sloping boulder hill to watch the sun drop behind the 160-foot gopuram of Virupaksha Temple.',
      travelTimeFromPrev: '10 mins walk',
      travelDistanceKm: 2,
      estimatedExpense: 10,
      insiderTip: 'Hemakuta Hill is free entry and offers the most breathtaking panoramic photography spot in Hampi.',
      phraseToUse: getPhrase('ph-shop-01'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Vijayanagara Splendour & Stone Chariot of Hampi',
    routeOverview: 'Hospet → Kamalapura → Vittala Temple → Tungabhadra Ghats → Hemakuta Hill',
    slots,
    dayTravelDistanceKm: 25,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'North Karnataka Unlimited Jolada Rotti Meals',
      placeName: 'Mango Tree Restaurant (Near Virupaksha)',
      approxPrice: 180,
    },
  };
}

function createHampiDay2(rates: { stay: number; food: number; transit: number }, dayNum = 2): ItineraryDay {
  const hampi = getDest('dest-hampi');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '07:30 AM – 11:30 AM',
      destination: hampi,
      activityTitle: 'Zenana Enclosure, Lotus Mahal & Elephant Stables',
      activityDescription: 'Inspect Indo-Islamic pavilions, queen’s palace foundations, and eleven domed chambers for royal elephants.',
      travelTimeFromPrev: '10 mins drive (4 km)',
      travelDistanceKm: 4,
      estimatedExpense: 0, // covered by previous day's ticket
      insiderTip: 'Your Vittala Temple ticket is valid here on the same calendar day.',
      phraseToUse: getPhrase('ph-temple-02'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '12:30 PM – 03:00 PM',
      destination: hampi,
      activityTitle: 'Royal Enclosure & Underground Stepped Tank',
      activityDescription: 'Explore the geometric Pushkarani stepped well, Mahanavami Dibba victory platform, and aqueducts.',
      travelTimeFromPrev: '5 mins drive (2 km)',
      travelDistanceKm: 2,
      estimatedExpense: 120,
      insiderTip: 'Climb to the top of Mahanavami Dibba for 360-degree views across the royal valley.',
      phraseToUse: getPhrase('ph-food-05'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:00 PM – 07:30 PM',
      destination: hampi,
      activityTitle: 'Matanga Hill Sunset Trek or Sanapur Lake',
      activityDescription: 'Hike up Matanga Hill (highest point in Hampi) for the classic golden panorama across the boulder ruins.',
      travelTimeFromPrev: '15 mins drive (5 km)',
      travelDistanceKm: 5,
      estimatedExpense: 20,
      insiderTip: 'Carry a headlamp/torch as descending Matanga Hill after dusk is dark.',
      phraseToUse: getPhrase('ph-emerg-02'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Royal Enclosures & Breathtaking Boulder Sunsets',
    routeOverview: 'Kamalapura → Zenana Enclosure → Stepped Tank → Matanga Hill',
    slots,
    dayTravelDistanceKm: 20,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Shenga Holige & Mirchi Bajji with Chai',
      placeName: 'Hampi Bazaar Local Eateries',
      approxPrice: 110,
    },
  };
}

function createBadamiDay(rates: { stay: number; food: number; transit: number }, dayNum = 3): ItineraryDay {
  const badami = getDest('dest-badami');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '08:30 AM – 12:00 PM',
      destination: badami,
      activityTitle: 'Chalukya Rock-Cut Cave Temples 1 to 4',
      activityDescription: 'Climb red sandstone steps to view 6th-century rock carvings of 18-armed Nataraja, Varaha, and Mahavira.',
      travelTimeFromPrev: '2.5 hrs drive (140 km) from Hampi',
      travelDistanceKm: 140,
      estimatedExpense: badami.entryFee.indianAdult,
      insiderTip: 'Cave 3 is the largest and contains the finest sculptural reliefs.',
      phraseToUse: getPhrase('ph-temple-04'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '01:00 PM – 03:30 PM',
      destination: badami,
      activityTitle: 'Agastya Lake & Bhootanatha Temple Walk',
      activityDescription: 'Walk the shore of green Agastya Lake to the ancient stone shrine built directly into the water.',
      travelTimeFromPrev: '10 mins walk',
      travelDistanceKm: 2,
      estimatedExpense: 140,
      insiderTip: 'Sample Dharwad Pedha from sweet shops near Badami bus stand.',
      phraseToUse: getPhrase('ph-shop-01'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:00 PM – 06:30 PM',
      destination: badami,
      activityTitle: 'UNESCO Pattadakal World Heritage Complex',
      activityDescription: 'Visit the 10 temples illustrating the unique confluence of northern Nagara and southern Dravidian architecture.',
      travelTimeFromPrev: '25 mins drive (22 km)',
      travelDistanceKm: 22,
      estimatedExpense: 40,
      insiderTip: 'Pattadakal is only 22 km from Badami; do not skip this UNESCO treasure.',
      phraseToUse: getPhrase('ph-greet-02'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Red Sandstone Cliffs & Cradle of Temple Architecture',
    routeOverview: 'Hampi → Badami Town → Agastya Lake → Pattadakal',
    slots,
    dayTravelDistanceKm: 165,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Badami Jolada Rotti with Spicy Stuffed Brinjal (Ennegayi)',
      placeName: 'Hotel Mayura Chalukya (KSTDC Badami)',
      approxPrice: 150,
    },
  };
}

function createChikmagalurDay(rates: { stay: number; food: number; transit: number }, dayNum = 1): ItineraryDay {
  const chik = getDest('dest-chikmagalur');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '06:30 AM – 10:30 AM',
      destination: chik,
      activityTitle: 'Summit Trek to Mullayanagiri Peak',
      activityDescription: 'Climb Karnataka’s highest peak (1,930 m) for sweeping 360-degree vistas across Western Ghats cloud ridges.',
      travelTimeFromPrev: 'Start of Day',
      travelDistanceKm: 0,
      estimatedExpense: 50,
      insiderTip: 'Start early by 6:30 AM to catch the cloud blankets before mist burns off.',
      phraseToUse: getPhrase('ph-trans-03'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '12:00 PM – 03:00 PM',
      destination: chik,
      activityTitle: 'Baba Budan Giri & Coffee Estate Plantation Walk',
      activityDescription: 'Learn coffee processing in a working Arabica estate; sample fresh brew right at the source.',
      travelTimeFromPrev: '30 mins drive (15 km)',
      travelDistanceKm: 15,
      estimatedExpense: 200,
      insiderTip: 'Buy authentic estate-roasted filter coffee powder directly from local growers.',
      phraseToUse: getPhrase('ph-food-03'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:30 PM – 06:30 PM',
      destination: chik,
      activityTitle: 'Hirekolale Lake Sunset & Chill',
      activityDescription: 'Sit by the serene lake surrounded by coffee-covered hills reflecting in calm water.',
      travelTimeFromPrev: '20 mins drive (10 km)',
      travelDistanceKm: 10,
      estimatedExpense: 20,
      insiderTip: 'Street vendors sell roasted sweet corn and hot ginger tea at lake edge.',
      phraseToUse: getPhrase('ph-emerg-02'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Clouds, Coffee Estates & Summit Trails of Chikmagalur',
    routeOverview: 'Chikmagalur Town → Mullayanagiri Peak → Baba Budan Giri → Hirekolale Lake',
    slots,
    dayTravelDistanceKm: 55,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Malnad Akki Rotti with Coconut Chutney & Fresh Filter Coffee',
      placeName: 'Town Canteen (Chikmagalur)',
      approxPrice: 110,
    },
  };
}

function createBelurHalebiduDay(rates: { stay: number; food: number; transit: number }, dayNum = 2): ItineraryDay {
  const belur = getDest('dest-belur-halebidu');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '08:30 AM – 11:30 AM',
      destination: belur,
      activityTitle: 'Chennakeshava Temple Soapstone Carvings',
      activityDescription: 'Witness 12th-century bracket figures of Madanika dancers and star-shaped stone plinths.',
      travelTimeFromPrev: '45 mins drive from Chikmagalur (38 km)',
      travelDistanceKm: 38,
      estimatedExpense: 0,
      insiderTip: 'Hire an ASI certified guide (₹350) to decipher astronomical carvings on outer walls.',
      phraseToUse: getPhrase('ph-temple-02'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '12:30 PM – 03:00 PM',
      destination: belur,
      activityTitle: 'Hoysaleswara Temple at Halebidu',
      activityDescription: 'Explore the twin Shiva temple complex with 20,000+ intricate relief sculptures depicting epic wars.',
      travelTimeFromPrev: '25 mins drive (16 km)',
      travelDistanceKm: 16,
      estimatedExpense: 10,
      insiderTip: 'Visit the adjacent Archaeological Survey museum for preserved medieval bronzes.',
      phraseToUse: getPhrase('ph-greet-01'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:30 PM – 07:00 PM',
      destination: belur,
      activityTitle: 'Return Drive through Hassan Coconut Groves',
      activityDescription: 'Drive back towards Bengaluru via smooth 4-lane NH 75 with highway tiffin stops.',
      travelTimeFromPrev: 'Highway drive',
      travelDistanceKm: 110,
      estimatedExpense: 100,
      insiderTip: 'Stop at Bellur Cross for piping hot Thatte Idli with benne (butter).',
      phraseToUse: getPhrase('ph-food-01'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Soapstone Symphony: UNESCO Hoysala Temples of Belur & Halebidu',
    routeOverview: 'Chikmagalur → Belur Chennakeshava → Halebidu Hoysaleswara → NH 75',
    slots,
    dayTravelDistanceKm: 164,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Traditional Karnataka Banana Leaf Thali',
      placeName: 'Hotel Mayura Velapuri (Belur KSTDC)',
      approxPrice: 140,
    },
  };
}

function createKabiniSafariDay(rates: { stay: number; food: number; transit: number }, dayNum = 3): ItineraryDay {
  const kabini = getDest('dest-kabini-nagarhole');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '06:00 AM – 09:30 AM',
      destination: kabini,
      activityTitle: 'Dawn Wildlife Safari in Nagarhole Tiger Reserve',
      activityDescription: 'Embark on a guided forest safari tracking wild elephants, spotted deer, Indian bison, and leopards.',
      travelTimeFromPrev: '1.5 hrs from Madikeri / Mysuru',
      travelDistanceKm: 75,
      estimatedExpense: kabini.entryFee.indianAdult,
      insiderTip: 'Pre-book online on Karnataka Forest portal at least 3 weeks before travel.',
      phraseToUse: getPhrase('ph-emerg-01'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '12:00 PM – 03:00 PM',
      destination: kabini,
      activityTitle: 'Riverfront Lunch & Nature Walk',
      activityDescription: 'Relax at riverside lodges overlooking the calm backwaters of the Kabini reservoir.',
      travelTimeFromPrev: 'Inside sanctuary zone',
      travelDistanceKm: 5,
      estimatedExpense: 350,
      insiderTip: 'Watch for herds of wild elephants gathering at the riverbank in afternoon heat.',
      phraseToUse: getPhrase('ph-food-05'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:00 PM – 06:30 PM',
      destination: kabini,
      activityTitle: 'Coracle Boat Ride on Kabini Backwaters',
      activityDescription: 'Float quietly in a circular reed coracle as the sun sets behind Nilgiri hill silhouettes.',
      travelTimeFromPrev: 'Riverside dock',
      travelDistanceKm: 3,
      estimatedExpense: 200,
      insiderTip: 'Carry binoculars for incredible marsh bird-watching (osprey, kingfishers, egrets).',
      phraseToUse: getPhrase('ph-greet-01'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Jungle Safaris & Riverboat Twilight at Kabini',
    routeOverview: 'Madikeri / Mysuru → Hunsur → Kabini Backwaters → Nagarhole Gate',
    slots,
    dayTravelDistanceKm: 85,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Jungle Lodges Traditional Buffet Spread',
      placeName: 'Kabini River Lodge / Local Dhabas',
      approxPrice: 350,
    },
  };
}

function createShivanasamudraDay(rates: { stay: number; food: number; transit: number }, dayNum = 2): ItineraryDay {
  const shiv = getDest('dest-shivanasamudra');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '08:30 AM – 11:30 AM',
      destination: shiv,
      activityTitle: 'Gaganachukki Waterfall Viewpoint',
      activityDescription: 'Witness the roaring Western cataract of the Kaveri dropping 98 meters in thunderous spray.',
      travelTimeFromPrev: '1.5 hrs drive from Mysuru (65 km)',
      travelDistanceKm: 65,
      estimatedExpense: shiv.entryFee.indianAdult,
      insiderTip: 'Visit the 1902 hydroelectric power station monument nearby.',
      phraseToUse: getPhrase('ph-trans-02'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '12:30 PM – 03:00 PM',
      destination: shiv,
      activityTitle: 'Bharachukki Cascade & River Fish Fry Lunch',
      activityDescription: 'Drive 14 km around the island to Bharachukki falls; relish fresh local Kaveri fish fry.',
      travelTimeFromPrev: '20 mins drive (14 km)',
      travelDistanceKm: 14,
      estimatedExpense: 220,
      insiderTip: 'Do not attempt to enter the water; rock whirlpools are treacherous.',
      phraseToUse: getPhrase('ph-food-05'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:30 PM – 07:30 PM',
      destination: shiv,
      activityTitle: 'Maddur Vada Pitstop & Return to Bengaluru',
      activityDescription: 'Drive back along the expressway; stop at Maddur for legendary crispy Maddur Vada.',
      travelTimeFromPrev: 'Highway drive (85 km)',
      travelDistanceKm: 85,
      estimatedExpense: 60,
      insiderTip: 'Hot Maddur Vadas with coconut chutney are freshly fried every 10 minutes.',
      phraseToUse: getPhrase('ph-food-01'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Roaring Cataracts & Kaveri River Island at Shivanasamudra',
    routeOverview: 'Mysuru → Malavalli → Gaganachukki → Bharachukki → Maddur → Bengaluru',
    slots,
    dayTravelDistanceKm: 164,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Fresh Kaveri River Fish Fry with Steamed Rice',
      placeName: 'Riverfront Local Eateries (Bharachukki)',
      approxPrice: 180,
    },
  };
}

function createNandiNatureDay(rates: { stay: number; food: number; transit: number }): ItineraryDay {
  const nandi = getDest('dest-nandi-hills');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '05:30 AM – 09:30 AM',
      destination: nandi,
      activityTitle: 'Sunrise Above the Sea of Clouds',
      activityDescription: 'Watch dawn break over dense cloud inversions from Tipu’s Drop clifftop terrace.',
      travelTimeFromPrev: '1.5 hrs from Bengaluru (60 km)',
      travelDistanceKm: 60,
      estimatedExpense: nandi.entryFee.indianAdult,
      insiderTip: 'Arrive at the base toll gate by 5:15 AM to beat morning visitor traffic.',
      phraseToUse: getPhrase('ph-trans-01'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '10:30 AM – 01:30 PM',
      destination: nandi,
      activityTitle: 'Bhoga Nandeeshwara 1000-Year Temple',
      activityDescription: 'Visit the historic Dravidian temple at hill base with its magnificent stepped water tank.',
      travelTimeFromPrev: '15 mins drive (10 km)',
      travelDistanceKm: 10,
      estimatedExpense: 0,
      insiderTip: 'The stepped kalyani tank is one of the most serene architectural spots in Karnataka.',
      phraseToUse: getPhrase('ph-temple-01'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '02:30 PM – 05:00 PM',
      destination: nandi,
      activityTitle: 'Artisan Grape Vineyards & Return Drive',
      activityDescription: 'Tour Chikkaballapura grape orchards and enjoy vineyard cafe refreshments.',
      travelTimeFromPrev: '20 mins drive (15 km)',
      travelDistanceKm: 15,
      estimatedExpense: 150,
      insiderTip: 'Fresh grape juice and local guava are sold roadside along Devanahalli.',
      phraseToUse: getPhrase('ph-food-03'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: 1,
    dayTitle: 'Sunrise Inversions & 1,000-Year Temple Heritage at Nandi',
    routeOverview: 'Bengaluru → Devanahalli → Nandi Hills Summit → Bhoga Nandeeshwara',
    slots,
    dayTravelDistanceKm: 95,
    dayEstimatedCost: {
      stay: 0, // Day trip
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Hot Filter Coffee & Mirchi Bajji',
      placeName: 'KSTDC Mayura Pine Top (Nandi Summit)',
      approxPrice: 85,
    },
  };
}

function createJogFallsDay(rates: { stay: number; food: number; transit: number }, dayNum = 7): ItineraryDay {
  const jog = getDest('dest-jog-falls');
  const slots: ItinerarySlot[] = [
    {
      timeSlot: 'morning',
      timeLabel: '08:30 AM – 12:00 PM',
      destination: jog,
      activityTitle: 'Behold the Four Cataracts of Jog Falls',
      activityDescription: 'View Raja, Roarer, Rocket, and Rani plunges from the British bungalow cliff promenade.',
      travelTimeFromPrev: '2.5 hrs drive from coastal towns',
      travelDistanceKm: 95,
      estimatedExpense: jog.entryFee.indianAdult,
      insiderTip: 'Check reservoir water release dates for maximum flow volume.',
      phraseToUse: getPhrase('ph-trans-04'),
    },
    {
      timeSlot: 'afternoon',
      timeLabel: '01:00 PM – 03:30 PM',
      destination: jog,
      activityTitle: 'Rainforest Malnad Lunch & Viewpoint Walk',
      activityDescription: 'Relish steaming Malnad Akki Rotti with coconut chutney; walk the gorge rim trail.',
      travelTimeFromPrev: 'Walk around viewpoint',
      travelDistanceKm: 2,
      estimatedExpense: 140,
      insiderTip: 'The 1,400-step trek to gorge floor is accessible only when monsoon waters subside.',
      phraseToUse: getPhrase('ph-food-03'),
    },
    {
      timeSlot: 'evening',
      timeLabel: '04:30 PM – 07:30 PM',
      destination: jog,
      activityTitle: 'Twilight Light Show & Return Journey',
      activityDescription: 'Watch the evening laser lights illuminate the falling water sprays before onward travel.',
      travelTimeFromPrev: 'Evening return',
      travelDistanceKm: 50,
      estimatedExpense: 20,
      insiderTip: 'Carry a warm rain jacket as mist from the falls is cool and persistent.',
      phraseToUse: getPhrase('ph-emerg-01'),
    },
  ];

  const tickets = slots.reduce((acc, s) => acc + s.estimatedExpense, 0);

  return {
    dayNumber: dayNum,
    dayTitle: 'Thunderous Plunges & Western Ghats Rainforest at Jog',
    routeOverview: 'Coastal Coast / Shivamogga → Sagara → Jog Falls Gorge',
    slots,
    dayTravelDistanceKm: 147,
    dayEstimatedCost: {
      stay: rates.stay,
      food: rates.food,
      transport: rates.transit,
      tickets,
      total: rates.stay + rates.food + rates.transit + tickets,
    },
    lunchRecommendation: {
      dishName: 'Malnad Steamed Kadubu with Spiced Chutney',
      placeName: 'KSTDC Mayura Gerusoppa',
      approxPrice: 120,
    },
  };
}
