/**
 * @file src/mobility/localTransportRegistry.ts
 * @description Master registry of local transit providers, pre-paid auto booths, and district taxi unions.
 * Explicitly distinguishes regulated statutory rates from negotiated seasonal estimates.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface LocalTransportOption {
  id: string;
  transferType: 'prepaid_auto' | 'city_bus' | 'hill_jeep_4wd' | 'app_cab' | 'rental_scooter' | 'boat_ferry';
  hubType: 'railway_station' | 'bus_terminal' | 'airport' | 'town_center';
  hubName: string;
  servesDestinationName: string;
  distanceKm: number;
  durationMinutes: number;
  rateType: 'GOVERNMENT_REGULATED_METER' | 'FIXED_PREPAID_COUNTER' | 'NEGOTIATED_LOCAL_UNION' | 'FLAT_BUS_FARE';
  estimatedFareInr: {
    min: number;
    max: number;
    fareCalculationExplanation: string;
  };
  providerOrganization: string;
  counterLocation: string;
  contactHelpline?: string;
  operatingHours: string;
  tipForTraveler: string;
  tipForTravelerKannada: string;
}

export const KARNATAKA_LOCAL_TRANSFERS: LocalTransportOption[] = [
  // 1. Hosapete Station -> Hampi Bazaar (Auto)
  {
    id: 'transfer-hpt-to-hampi-auto',
    transferType: 'prepaid_auto',
    hubType: 'railway_station',
    hubName: 'Hosapete Junction (HPT)',
    servesDestinationName: 'Hampi Bazaar (Virupaksha Temple)',
    distanceKm: 13.0,
    durationMinutes: 25,
    rateType: 'FIXED_PREPAID_COUNTER',
    estimatedFareInr: {
      min: 200,
      max: 250,
      fareCalculationExplanation: 'Fixed standard counter rate sanctioned by Vijayanagara District Traffic Police.',
    },
    providerOrganization: 'Hosapete Railway Auto Drivers Welfare Union',
    counterLocation: 'Pre-paid booth directly outside Platform 1 main exit gate',
    operatingHours: '24 Hours (Matches train arrivals)',
    tipForTraveler: 'Always request a printed slip from the police booth outside Platform 1 to avoid overcharging.',
    tipForTravelerKannada: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ೧ ರ ಹೊರಗಿರುವ ಟ್ರಾಫಿಕ್ ಪೊಲೀಸ್ ಕೌಂಟರ್‌ನಲ್ಲಿ ಮುಂಗಡ ಚೀಟಿ ಪಡೆಯಿರಿ.',
  },

  // 2. Hosapete Station -> Hampi Bazaar (KSRTC City Bus)
  {
    id: 'transfer-hpt-to-hampi-bus',
    transferType: 'city_bus',
    hubType: 'railway_station',
    hubName: 'Hosapete Junction (HPT)',
    servesDestinationName: 'Hampi Bazaar',
    distanceKm: 13.0,
    durationMinutes: 30,
    rateType: 'FLAT_BUS_FARE',
    estimatedFareInr: {
      min: 20,
      max: 20,
      fareCalculationExplanation: 'Statutory KSRTC stage carriage fare. Free for women under Shakti Scheme.',
    },
    providerOrganization: 'KSRTC Hosapete Urban Depot',
    counterLocation: 'Bus bay at station entrance circle',
    operatingHours: '06:00 - 21:00 (Every 25 minutes)',
    tipForTraveler: 'Departs right from the station gate. Look for yellow/blue boards reading "ಹಂಪಿ (Hampi)".',
    tipForTravelerKannada: 'ನಿಲ್ದಾಣದ ಬಾಗಿಲಿನಿಂದಲೇ ಪ್ರತಿ ೨೫ ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ಹಂಪಿಗೆ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಬಸ್ ಹೊರಡುತ್ತದೆ.',
  },

  // 3. Hassan Junction -> Belur Temple (KSRTC Express)
  {
    id: 'transfer-has-to-belur-bus',
    transferType: 'city_bus',
    hubType: 'railway_station',
    hubName: 'Hassan Junction (HAS)',
    servesDestinationName: 'Chennakeshava Temple, Belur',
    distanceKm: 38.0,
    durationMinutes: 45,
    rateType: 'FLAT_BUS_FARE',
    estimatedFareInr: {
      min: 45,
      max: 45,
      fareCalculationExplanation: 'Official KSRTC Non-stop express tariff. Free for Karnataka domicile women with Shakti smart-card.',
    },
    providerOrganization: 'KSRTC Hassan Central Division',
    counterLocation: 'Hassan New Bus Stand (take ₹30 auto from railway station to bus stand)',
    operatingHours: '05:30 - 22:00 (Departures every 15 minutes)',
    tipForTraveler: 'Take an auto (₹30) from Hassan railway station to Hassan New Bus Stand for direct express buses to Belur.',
    tipForTravelerKannada: 'ರೈಲ್ವೆ ನಿಲ್ದಾಣದಿಂದ ಹೊಸ ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ ಆಟೋದಲ್ಲಿ ಬಂದು, ಪ್ರತಿ ೧೫ ನಿಮಿಷಕ್ಕಿರುವ ನಾನ್-ಸ್ಟಾಪ್ ಬೇಲೂರು ಬಸ್ ಹತ್ತಿ.',
  },

  // 4. Chikkamagaluru Town -> Mullayanagiri Peak (4WD Hill Jeep)
  {
    id: 'transfer-ckm-to-mullayanagiri-jeep',
    transferType: 'hill_jeep_4wd',
    hubType: 'town_center',
    hubName: 'Chikkamagaluru Town Stand',
    servesDestinationName: 'Mullayanagiri Peak Base',
    distanceKm: 20.0,
    durationMinutes: 45,
    rateType: 'NEGOTIATED_LOCAL_UNION',
    estimatedFareInr: {
      min: 1600,
      max: 2200,
      fareCalculationExplanation: 'Local 4x4 Jeep Union return package including 2 hours waiting time at peak and Sitalayanagiri.',
    },
    providerOrganization: 'Bababudan Hills 4WD Tourist Jeep Drivers Union',
    counterLocation: 'Kaimara Junction & Chikkamagaluru Bus Stand Jeep Bay',
    contactHelpline: '08262-234890',
    operatingHours: '05:30 - 17:00 (Uphill road closes at 17:00)',
    tipForTraveler: 'Mandatory 4WD during monsoon months. Shared jeeps available at Kaimara junction for ₹150-₹200 per seat.',
    tipForTravelerKannada: 'ಕೈಮಾರ ಜಂಕ್ಷನ್‌ನಲ್ಲಿ ಹಂಚಿಕೆ ಜೀಪುಗಳು ಪ್ರತಿ ಸೀಟಿಗೆ ₹೧೫೦-₹೨೦೦ ಕ್ಕೆ ಲಭ್ಯವಿರುತ್ತವೆ.',
  },

  // 5. Mysuru Junction -> Mysuru Palace (Pre-Paid Auto)
  {
    id: 'transfer-mys-to-palace-auto',
    transferType: 'prepaid_auto',
    hubType: 'railway_station',
    hubName: 'Mysuru Junction (MYS)',
    servesDestinationName: 'Mysuru Amba Vilas Palace',
    distanceKm: 2.2,
    durationMinutes: 8,
    rateType: 'FIXED_PREPAID_COUNTER',
    estimatedFareInr: {
      min: 40,
      max: 50,
      fareCalculationExplanation: 'Government regulated city meter minimum slab + ₹2 service charge.',
    },
    providerOrganization: 'Mysuru City Traffic Police Pre-Paid Counter',
    counterLocation: 'Platform 1 Portico Exit',
    operatingHours: '24 Hours',
    tipForTraveler: 'Use the pre-paid auto kiosk on Platform 1. Do not entertain unmetered private hawkers.',
    tipForTravelerKannada: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ೧ ರ ಪ್ರಿಪೇಯ್ಡ್ ಕೌಂಟರ್‌ನಲ್ಲಿ ಚೀಟಿ ಪಡೆದು ಪ್ರಯಾಣಿಸಿ.',
  },

  // 6. Badami Station -> Badami Cave Temples (Auto)
  {
    id: 'transfer-bdm-to-caves-auto',
    transferType: 'prepaid_auto',
    hubType: 'railway_station',
    hubName: 'Badami Railway Station (BDM)',
    servesDestinationName: 'Badami Cave Temples & Agastya Lake',
    distanceKm: 4.5,
    durationMinutes: 12,
    rateType: 'NEGOTIATED_LOCAL_UNION',
    estimatedFareInr: {
      min: 60,
      max: 80,
      fareCalculationExplanation: 'Standard local union fixed fare for tourist transfer to cave entrance.',
    },
    providerOrganization: 'Badami Taluk Auto Drivers Association',
    counterLocation: 'Station entrance circle',
    operatingHours: '06:00 - 21:00',
    tipForTraveler: 'Ask the driver to drop you directly at the ASI ticket counter at Cave 1.',
    tipForTravelerKannada: 'ಗುಹೆ ೧ ರ ಎಎಸ್‌ಐ ಟಿಕೆಟ್ ಕೌಂಟರ್ ಬಳಿ ಬಿಡುವಂತೆ ಚಾಲಕರಿಗೆ ತಿಳಿಸಿ.',
  },
];
