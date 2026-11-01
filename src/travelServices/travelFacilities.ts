/**
 * @file src/travelServices/travelFacilities.ts
 * @description Essential tourist facilities, emergency contacts, EV chargers, and healthcare centres across Karnataka.
 * Sourced from Karnataka Tourism, NHAI highway amenities, and District Administrations.
 * @theme Code. Create. Celebrate Kannada.
 */

export type FacilityType =
  | 'ev_charging'
  | 'fuel_station'
  | 'hospital_emergency'
  | 'tourist_police'
  | 'tourist_info_centre'
  | 'forest_entry_office'
  | 'public_restroom';

export interface TravelFacility {
  id: string;
  name: string;
  nameKannada: string;
  facilityType: FacilityType;
  district: string;
  townOrHighway: string;
  coordinates: [number, number];
  address: string;
  operatingHours: string;
  emergencyContact?: string;
  isGovernmentRun: boolean;
  notes: string;
}

export const KARNATAKA_TRAVEL_FACILITIES: TravelFacility[] = [
  // 1. Bescom Fast EV Charging - Hassan NH-75 Expressway
  {
    id: 'fac-ev-hassan-nh75',
    name: 'Bescom Public EV Fast Charging Station (60kW CCS2)',
    nameKannada: 'ಬೆಸ್ಕಾಂ ಇವಿ ವೇಗದ ಚಾರ್ಜಿಂಗ್ ನಿಲ್ದಾಣ, ಹಾಸನ',
    facilityType: 'ev_charging',
    district: 'Hassan',
    townOrHighway: 'NH-75 Expressway (Bengaluru-Mangaluru Corridor)',
    coordinates: [76.0850, 12.9980],
    address: 'Near Hassan Toll Plaza, NH-75, Hassan 573201',
    operatingHours: '24 Hours',
    emergencyContact: '1912 (Bescom Helpline)',
    isGovernmentRun: true,
    notes: 'Dual gun 60kW DC fast charger; compatible with all Indian EV cars.',
  },

  // 2. Hassan Institute of Medical Sciences (HIMS) - District Hospital
  {
    id: 'fac-hosp-hassan-hims',
    name: 'Hassan Institute of Medical Sciences (HIMS) Government Hospital',
    nameKannada: 'ಹಾಸನ ವೈದ್ಯಕೀಯ ವಿಜ್ಞಾನಗಳ ಸಂಸ್ಥೆ (ಸರ್ಕಾರಿ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ)',
    facilityType: 'hospital_emergency',
    district: 'Hassan',
    townOrHighway: 'Hassan City',
    coordinates: [76.0980, 13.0040],
    address: 'Near BM Road, Hassan, Karnataka 573201',
    operatingHours: '24 Hours Emergency / Trauma Care',
    emergencyContact: '08172-231699 / 108',
    isGovernmentRun: true,
    notes: 'Primary 24x7 trauma care centre for Hassan, Belur, Halebidu, and Shiradi Ghat accidents.',
  },

  // 3. Hampi Tourist Police Assistance Booth
  {
    id: 'fac-police-hampi-tourist',
    name: 'Hampi Tourist Police & Assistance Desk',
    nameKannada: 'ಹಂಪಿ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಮತ್ತು ಸಹಾಯ ಕೇಂದ್ರ',
    facilityType: 'tourist_police',
    district: 'Vijayanagara',
    townOrHighway: 'Hampi Bazaar',
    coordinates: [76.4605, 15.3348],
    address: 'Opposite Virupaksha Temple Eastern Gopuram, Hampi 583239',
    operatingHours: '06:00 - 20:00 (Patrols 24 Hours)',
    emergencyContact: '112 / 08394-241244',
    isGovernmentRun: true,
    notes: 'Dedicated tourist protection personnel. Lost-and-found registry and emergency medical guidance.',
  },

  // 4. Chikkamagaluru Forest Range Office (Mullayanagiri & Bababudangiri)
  {
    id: 'fac-forest-ckm-range',
    name: 'Karnataka Forest Department - Chikkamagaluru Range Office',
    nameKannada: 'ಕರ್ನಾಟಕ ಅರಣ್ಯ ಇಲಾಖೆ - ಚಿಕ್ಕಮಗಳೂರು ವಲಯ ಕಚೇರಿ',
    facilityType: 'forest_entry_office',
    district: 'Chikkamagaluru',
    townOrHighway: 'Kaimara Junction',
    coordinates: [75.7620, 13.3450],
    address: 'Kaimara Checkpost, Mullayanagiri Hill Road, Chikkamagaluru 577101',
    operatingHours: '06:00 - 18:00',
    emergencyContact: '08262-230245',
    isGovernmentRun: true,
    notes: 'Mandatory vehicle checkpost; plastic verification and weather/landslide advisories.',
  },

  // 5. KSTDC Tourist Information Centre, Mysuru Railway Station
  {
    id: 'fac-info-mys-kstdc',
    name: 'KSTDC Official Tourist Information Centre',
    nameKannada: 'ಕೆಎಸ್‌ಟಿಡಿಸಿ ಅಧಿಕೃತ ಪ್ರವಾಸಿ ಮಾಹಿತಿ ಕೇಂದ್ರ',
    facilityType: 'tourist_info_centre',
    district: 'Mysuru',
    townOrHighway: 'Mysuru Junction Platform 1',
    coordinates: [76.6435, 12.3162],
    address: 'Platform 1 Portico, Mysuru Railway Station, Mysuru 570021',
    operatingHours: '07:00 - 21:00',
    emergencyContact: '0821-2423652',
    isGovernmentRun: true,
    notes: 'Free official maps, certified guide booking, and KSTDC sight-seeing tour bus tickets.',
  },
];

export class TravelFacilitiesService {
  public static getByDistrict(district: string): TravelFacility[] {
    const q = district.toLowerCase();
    return KARNATAKA_TRAVEL_FACILITIES.filter((f) => f.district.toLowerCase() === q);
  }

  public static getByType(type: FacilityType): TravelFacility[] {
    return KARNATAKA_TRAVEL_FACILITIES.filter((f) => f.facilityType === type);
  }

  public static getAll(): TravelFacility[] {
    return KARNATAKA_TRAVEL_FACILITIES;
  }
}
