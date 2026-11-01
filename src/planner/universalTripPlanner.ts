/**
 * @file src/planner/universalTripPlanner.ts
 * @description Universal Karnataka Trip Planner uniting Destinations, Transport, Stays, Food, and Budget.
 * @theme Code. Create. Celebrate Kannada.
 */

import { DestinationRegistryV8, ComprehensiveDestination } from '../data/destinations/destinationRegistry';
import { BusSearchService, BusSearchResultItem } from '../transit/buses/busSearchService';
import { TrainSearchService, TrainSearchResult } from '../transit/railways/trainSearchService';
import { AccommodationRegistryV8, ComprehensiveAccommodation } from '../stays/accommodationRegistry';
import { VERIFIED_KARNATAKA_RESTAURANTS, KarnatakaDiningRecord } from '../dining/restaurantRegistry';
import { LastMilePlanner } from '../mobility/lastMilePlanner';
import { IntermodalJourneyPlan } from '../mobility/interchangeGraph';
import { TripBudgetEngine, ComprehensiveTripBudget } from './tripBudgetEngine';

export interface UniversalTripRequest {
  origin: string;
  destinationQuery: string;
  days: number;
  travellers: number;
  womenTravellers?: number;
  budgetTier?: 'backpacker' | 'comfort' | 'premium';
  preferredTrunkMode?: 'train' | 'bus' | 'drive';
}

export interface UniversalTripBundle {
  request: UniversalTripRequest;
  resolvedDestination: ComprehensiveDestination;
  intermodalJourney: IntermodalJourneyPlan;
  availableBuses: BusSearchResultItem[];
  availableTrains: TrainSearchResult[];
  recommendedStays: ComprehensiveAccommodation[];
  recommendedDining: KarnatakaDiningRecord[];
  budget: ComprehensiveTripBudget;
  dailyItinerary: {
    day: number;
    title: string;
    titleKannada: string;
    morningActivity: string;
    afternoonActivity: string;
    eveningActivity: string;
    mealsSuggestion: string;
    stayRecommendation: string;
  }[];
}

export class UniversalTripPlanner {
  private static destinationRegistry = DestinationRegistryV8.getInstance();
  private static stayRegistry = AccommodationRegistryV8.getInstance();

  public static plan(req: UniversalTripRequest): UniversalTripBundle {
    const origin = req.origin || 'Bengaluru';
    const destQ = req.destinationQuery || 'Hampi';
    const days = req.days || 3;
    const travellers = req.travellers || 2;
    const womenCount = req.womenTravellers ?? 1;
    const tier = req.budgetTier || 'comfort';
    const trunkMode = req.preferredTrunkMode || 'train';

    // 1. Resolve Destination
    const allDestinations = this.destinationRegistry.getAll();
    const resolvedDestination =
      allDestinations.find((d) =>
        d.name.toLowerCase().includes(destQ.toLowerCase()) ||
        d.district.toLowerCase().includes(destQ.toLowerCase()) ||
        d.alternateNames.some((alt) => alt.toLowerCase().includes(destQ.toLowerCase()))
      ) || allDestinations[0]; // Defaults to Hampi or Belur

    // 2. Solve Intermodal Journey
    const intermodalJourney = LastMilePlanner.planJourney(
      origin,
      resolvedDestination.name,
      trunkMode === 'drive' ? 'bus' : trunkMode
    );

    // 3. Search Relevant Buses
    const busSearch = BusSearchService.search({
      origin,
      destination: resolvedDestination.townOrVillage || resolvedDestination.district,
      passengers: travellers,
      womenPassengersCount: womenCount,
    });

    // 4. Search Relevant Trains
    const trainSearch = TrainSearchService.search({
      fromStationCodeOrCity: origin,
      toStationCodeOrCity: resolvedDestination.transitConnectivity.railwayStationCode || resolvedDestination.district,
    });

    // 5. Find Recommended Stays
    const recommendedStays = this.stayRegistry.search({
      destinationOrDistrict: resolvedDestination.district,
    });

    // 6. Find Dining Recommendations
    const recommendedDining = VERIFIED_KARNATAKA_RESTAURANTS.filter(
      (r) =>
        r.district.toLowerCase() === resolvedDestination.district.toLowerCase() ||
        r.servesDestinationId === resolvedDestination.id
    );

    // 7. Compute Financial Budget Breakdown
    const budget = TripBudgetEngine.calculateBudget({
      days,
      travellersCount: travellers,
      womenTravellersCount: womenCount,
      budgetTier: tier,
      trunkMode,
      stopsCount: 1 + resolvedDestination.nearbyDestinationIds.length,
      includesWesternGhatSafari: resolvedDestination.category === 'wildlife_sanctuaries',
    });

    // 8. Generate Feasible Day-by-Day Timeline
    const dailyItinerary = [];
    for (let day = 1; day <= days; day++) {
      if (day === 1) {
        dailyItinerary.push({
          day: 1,
          title: `Day 1: Arrival & Exploring ${resolvedDestination.name}`,
          titleKannada: `ದಿನ ೧: ಆಗಮನ ಮತ್ತು ${resolvedDestination.nameKannada} ವೀಕ್ಷಣೆ`,
          morningActivity: `Arrive via ${trunkMode} at ${resolvedDestination.transitConnectivity.nearestRailwayStation || 'Bus Stand'}; check in at hotel.`,
          afternoonActivity: `Visit ${resolvedDestination.name} with certified local ASI guide.`,
          eveningActivity: 'Sunset viewpoint walk and riverside heritage exploration.',
          mealsSuggestion: recommendedDining[0] ? `Lunch at ${recommendedDining[0].name}` : 'Traditional South Indian Thali',
          stayRecommendation: recommendedStays[0] ? recommendedStays[0].name : 'KSTDC Hotel Mayura',
        });
      } else if (day === days) {
        dailyItinerary.push({
          day,
          title: `Day ${day}: Cultural Souvenirs & Return Journey`,
          titleKannada: `ದಿನ ${day}: ಸ್ಮರಣಿಕೆ ಖರೀದಿ ಹಾಗೂ ಹಿಂತಿರುಗುವ ಪ್ರಯಾಣ`,
          morningActivity: 'Early morning photography and regional market visit.',
          afternoonActivity: 'Check out; lunch at local heritage dining hall.',
          eveningActivity: `Board return ${trunkMode} back to ${origin}.`,
          mealsSuggestion: 'Authentic local snacks and filter coffee',
          stayRecommendation: 'Return transit',
        });
      } else {
        dailyItinerary.push({
          day,
          title: `Day ${day}: Deep Heritage & Regional Circuits`,
          titleKannada: `ದಿನ ${day}: ಸುತ್ತಮುತ್ತಲಿನ ಪಾರಂಪರಿಕ ತಾಣಗಳ ದರ್ಶನ`,
          morningActivity: 'Explore secondary circuit monuments and archaeological museum.',
          afternoonActivity: 'Country trail walk and village craft interaction.',
          eveningActivity: 'Evening temple aarti or scenic lake promenade.',
          mealsSuggestion: 'Local cuisine tasting (Jolada Rotti / Akki Rotti feast)',
          stayRecommendation: recommendedStays[0] ? recommendedStays[0].name : 'KSTDC Hotel Mayura',
        });
      }
    }

    return {
      request: req,
      resolvedDestination,
      intermodalJourney,
      availableBuses: busSearch.results,
      availableTrains: trainSearch.directTrains,
      recommendedStays,
      recommendedDining,
      budget,
      dailyItinerary,
    };
  }
}
