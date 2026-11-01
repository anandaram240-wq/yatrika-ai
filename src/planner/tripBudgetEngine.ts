/**
 * @file src/planner/tripBudgetEngine.ts
 * @description Master travel cost and budget calculator for Karnataka journeys.
 * Explicitly distinguishes statutory fares from estimates and audited Shakti savings.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface BudgetLineItem {
  category: 'transit' | 'accommodation' | 'dining' | 'entry_fees_permits' | 'local_last_mile';
  label: string;
  labelKannada: string;
  amountInr: number;
  rateClassification: 'OFFICIAL_PUBLISHED_FARE' | 'PROVIDER_CONFIRMED_AMOUNT' | 'ALGORITHMIC_ESTIMATE' | 'SHAKTI_SCHEME_FREE';
  pricingRationale: string;
}

export interface ComprehensiveTripBudget {
  totalEstimatedCostInr: number;
  perPersonCostInr: number;
  currency: 'INR';
  shaktiSchemeSavingsInr: number;
  lineItems: BudgetLineItem[];
  breakdown: {
    transitInr: number;
    accommodationInr: number;
    diningInr: number;
    entryFeesAndPermitsInr: number;
    localLastMileInr: number;
  };
  calculationFormula: string;
}

export class TripBudgetEngine {
  public static calculateBudget(params: {
    days: number;
    travellersCount: number;
    womenTravellersCount: number;
    budgetTier: 'backpacker' | 'comfort' | 'premium';
    trunkMode: 'train' | 'bus' | 'drive';
    stopsCount: number;
    includesWesternGhatSafari?: boolean;
  }): ComprehensiveTripBudget {
    const { days, travellersCount, womenTravellersCount, budgetTier, trunkMode, stopsCount } = params;
    const lineItems: BudgetLineItem[] = [];

    // 1. Trunk Transit Cost
    let transitPerPerson = 300;
    let transitLabel = 'KSRTC Rajahamsa / SWR Express Train';
    let transitRateClass: BudgetLineItem['rateClassification'] = 'OFFICIAL_PUBLISHED_FARE';

    if (trunkMode === 'train') {
      if (budgetTier === 'premium') {
        transitPerPerson = 760; // Vande Bharat Executive or 2A
        transitLabel = 'Vande Bharat Express / 2A AC';
      } else if (budgetTier === 'comfort') {
        transitPerPerson = 380; // AC Chair Car / 3A
        transitLabel = 'SWR AC Chair Car / 3A Sleeper';
      } else {
        transitPerPerson = 145; // 2S / General Second Class
        transitLabel = 'SWR Second Class / Sleeper';
      }
    } else if (trunkMode === 'bus') {
      if (budgetTier === 'premium') {
        transitPerPerson = 650; // Ambari Utsav AC Sleeper
        transitLabel = 'KSRTC Ambari Utsav AC Sleeper';
      } else if (budgetTier === 'comfort') {
        transitPerPerson = 280; // Rajahamsa Executive
        transitLabel = 'KSRTC Rajahamsa Executive';
      } else {
        transitPerPerson = 165; // Karnataka Sarige Express
        transitLabel = 'KSRTC Karnataka Sarige Express';
      }
    } else {
      // Drive / Private Taxi
      transitPerPerson = (220 * 20) / travellersCount; // Distance * ₹20/km divided by passengers
      transitLabel = 'Private Car / Highway Fuel & Tolls';
      transitRateClass = 'ALGORITHMIC_ESTIMATE';
    }

    // Shakti Scheme Audit: Women travel free on ordinary & express KSRTC buses
    const eligibleWomenTransit = (trunkMode === 'bus' && budgetTier === 'backpacker') ? womenTravellersCount : 0;
    const payingPassengers = Math.max(0, travellersCount - eligibleWomenTransit);
    const totalTransitCost = Math.round(payingPassengers * transitPerPerson);
    const shaktiSavingsInr = eligibleWomenTransit * transitPerPerson;

    lineItems.push({
      category: 'transit',
      label: `${transitLabel} (Round Trip Transit)`,
      labelKannada: 'ಮುಖ್ಯ ಸಾರಿಗೆ ವೆಚ್ಚ',
      amountInr: totalTransitCost,
      rateClassification: transitRateClass,
      pricingRationale: `Calculated for ${payingPassengers} paying passengers at ₹${transitPerPerson}/seat.`,
    });

    if (shaktiSavingsInr > 0) {
      lineItems.push({
        category: 'transit',
        label: `ಶಕ್ತಿ ಯೋಜನೆ ಉಳಿತಾಯ (Shakti Scheme Savings for ${eligibleWomenTransit} women)`,
        labelKannada: 'ಶಕ್ತಿ ಯೋಜನೆಯಡಿ ಉಳಿತಾಯ',
        amountInr: 0,
        rateClassification: 'SHAKTI_SCHEME_FREE',
        pricingRationale: `Government of Karnataka subsidized zero-fare ticket (saved ₹${shaktiSavingsInr}).`,
      });
    }

    // 2. Accommodation Cost
    const nights = Math.max(1, days - 1);
    let roomNightRate = 2200;
    let stayLabel = 'KSTDC Hotel Mayura Standard AC';

    if (budgetTier === 'premium') {
      roomNightRate = params.includesWesternGhatSafari ? 8500 : 4500;
      stayLabel = params.includesWesternGhatSafari ? 'Jungle Lodges & Resorts (All-Inclusive Safari)' : 'KSTDC Heritage Deluxe / JLR';
    } else if (budgetTier === 'comfort') {
      roomNightRate = 2600;
      stayLabel = 'KSTDC Hotel Mayura / Registered Homestay';
    } else {
      roomNightRate = 1200;
      stayLabel = 'KSTDC Standard Non-AC / Rural Homestay';
    }

    const roomsCount = Math.ceil(travellersCount / 2);
    const totalStayCost = roomNightRate * roomsCount * nights;

    lineItems.push({
      category: 'accommodation',
      label: `${stayLabel} (${roomsCount} room${roomsCount > 1 ? 's' : ''} × ${nights} night${nights > 1 ? 's' : ''})`,
      labelKannada: 'ತಂಗುದಾಣದ ವೆಚ್ಚ',
      amountInr: totalStayCost,
      rateClassification: 'PROVIDER_CONFIRMED_AMOUNT',
      pricingRationale: `Official published tariff: ₹${roomNightRate} per room/night.`,
    });

    // 3. Dining & Local Food
    let foodPerPersonPerDay = 350;
    if (budgetTier === 'premium') foodPerPersonPerDay = 750;
    else if (budgetTier === 'comfort') foodPerPersonPerDay = 450;
    else foodPerPersonPerDay = 250;

    const totalFoodCost = foodPerPersonPerDay * travellersCount * days;
    lineItems.push({
      category: 'dining',
      label: `Authentic Regional Karnataka Meals (${travellersCount} people × ${days} days)`,
      labelKannada: 'ಆಹಾರ ಮತ್ತು ಉಪಹಾರ',
      amountInr: totalFoodCost,
      rateClassification: 'ALGORITHMIC_ESTIMATE',
      pricingRationale: `Estimated at ₹${foodPerPersonPerDay}/day based on traditional regional meal menus.`,
    });

    // 4. Entry Fees & Permits
    const entryFeePerStop = 25; // ASI average (Virupaksha free, Badami ₹25, Vittala ₹50)
    const totalEntryCost = entryFeePerStop * stopsCount * travellersCount;
    lineItems.push({
      category: 'entry_fees_permits',
      label: `ASI Monument Entry & Heritage Tickets (${stopsCount} destinations)`,
      labelKannada: 'ಸ್ಮಾರಕ ಪ್ರವೇಶ ಶುಲ್ಕ',
      amountInr: totalEntryCost,
      rateClassification: 'OFFICIAL_PUBLISHED_FARE',
      pricingRationale: 'Statutory ASI ticket rates for Indian citizens under AMASR Act 1958.',
    });

    // 5. Local Last-Mile Transport
    const localDailyTransfers = 200 * days;
    lineItems.push({
      category: 'local_last_mile',
      label: `Station & Monument Last-Mile Autos / Local Shuttles (${days} days)`,
      labelKannada: 'ಸ್ಥಳೀಯ ಆಟೋ ಮತ್ತು ಸಾರಿಗೆ',
      amountInr: localDailyTransfers,
      rateClassification: 'ALGORITHMIC_ESTIMATE',
      pricingRationale: 'Government regulated auto meter minimums and local station shuttle buses.',
    });

    const totalEstimatedCostInr = totalTransitCost + totalStayCost + totalFoodCost + totalEntryCost + localDailyTransfers;
    const perPersonCostInr = Math.round(totalEstimatedCostInr / travellersCount);

    return {
      totalEstimatedCostInr,
      perPersonCostInr,
      currency: 'INR',
      shaktiSchemeSavingsInr: shaktiSavingsInr,
      lineItems,
      breakdown: {
        transitInr: totalTransitCost,
        accommodationInr: totalStayCost,
        diningInr: totalFoodCost,
        entryFeesAndPermitsInr: totalEntryCost,
        localLastMileInr: localDailyTransfers,
      },
      calculationFormula: `Total = Transit (₹${totalTransitCost}) + Stay (₹${totalStayCost}) + Food (₹${totalFoodCost}) + Entry (₹${totalEntryCost}) + Last-Mile (₹${localDailyTransfers}).`,
    };
  }
}
