/**
 * @file src/transit/buses/busOperatorRegistry.ts
 * @description Master registry of Karnataka's 4 State Road Transport Corporations & licensed operators.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface BusOperatorRecord {
  operatorId: string;
  name: string;
  nameKannada: string;
  shortCode: string;
  isStateCorporation: boolean;
  headquarters: string;
  helpline: string;
  officialBookingUrl: string;
  shaktiSchemeApplicable: boolean;
  serviceDivisions: string[];
  vehicleClasses: string[];
}

export const KARNATAKA_BUS_OPERATORS: Record<string, BusOperatorRecord> = {
  KSRTC: {
    operatorId: 'KSRTC',
    name: 'Karnataka State Road Transport Corporation',
    nameKannada: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ರಸ್ತೆ ಸಾರಿಗೆ ನಿಗಮ',
    shortCode: 'KSRTC',
    isStateCorporation: true,
    headquarters: 'Transport House, Shanthinagar, Bengaluru - 560027',
    helpline: '080-26252625 / 7760990034',
    officialBookingUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
    shaktiSchemeApplicable: true,
    serviceDivisions: ['Bengaluru Central', 'Mysuru Urban & Rural', 'Hassan', 'Chikkamagaluru', 'Mangaluru', 'Davanagere', 'Shivamogga', 'Tumakuru'],
    vehicleClasses: ['Airavat Club Class (Multi-Axle AC)', 'Ambari Utsav (Premium AC Sleeper)', 'Rajahamsa (Executive 2+2)', 'Karnataka Sarige (Express)', 'EV Power Plus (Intercity Electric)'],
  },
  BMTC: {
    operatorId: 'BMTC',
    name: 'Bengaluru Metropolitan Transport Corporation',
    nameKannada: 'ಬೆಂಗಳೂರು ಮಹಾನಗರ ಸಾರಿಗೆ ಸಂಸ್ಥೆ',
    shortCode: 'BMTC',
    isStateCorporation: true,
    headquarters: 'BMTC Central Offices, Shanthinagar, Bengaluru - 560027',
    helpline: '080-22483777',
    officialBookingUrl: 'https://mybmtc.karnataka.gov.in/',
    shaktiSchemeApplicable: true,
    serviceDivisions: ['Bengaluru Urban Metropolitan Area', 'KIA Airport Corridor', 'Electronic City / Whitefield Corridors'],
    vehicleClasses: ['Vayu Vajra (Airport AC Volvo)', 'Vajra (City AC)', 'Ordinary City Bus', 'Metro Feeder (MF Series)'],
  },
  NWKRTC: {
    operatorId: 'NWKRTC',
    name: 'North Western Karnataka Road Transport Corporation',
    nameKannada: 'ವಾಯವ್ಯ ಕರ್ನಾಟಕ ರಸ್ತೆ ಸಾರಿಗೆ ಸಂಸ್ಥೆ',
    shortCode: 'NWKRTC',
    isStateCorporation: true,
    headquarters: 'Central Office, Gokul Road, Hubballi - 580030',
    helpline: '0836-2237511',
    officialBookingUrl: 'https://nwkrtc.karnataka.gov.in/',
    shaktiSchemeApplicable: true,
    serviceDivisions: ['Hubballi-Dharwad', 'Belagavi', 'Uttara Kannada', 'Vijayapura', 'Bagalkote', 'Gadag'],
    vehicleClasses: ['Airavat AC', 'Rajahamsa', 'NWKRTC Sarige', 'Sagara Sarige (Coastal Coastal Line)', 'Suvarna Sarige'],
  },
  KKRTC: {
    operatorId: 'KKRTC',
    name: 'Kalyana Karnataka Road Transport Corporation',
    nameKannada: 'ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ರಸ್ತೆ ಸಾರಿಗೆ ನಿಗಮ',
    shortCode: 'KKRTC',
    isStateCorporation: true,
    headquarters: 'Sarige Sadana, Main Road, Kalaburagi - 585102',
    helpline: '08472-227640',
    officialBookingUrl: 'https://kkrtc.karnataka.gov.in/',
    shaktiSchemeApplicable: true,
    serviceDivisions: ['Kalaburagi', 'Bidar', 'Raichur', 'Koppal', 'Yadgir', 'Ballari', 'Vijayanagara (Hosapete)'],
    vehicleClasses: ['Kalyana Ratha (AC Sleeper)', 'Rajahamsa', 'KKRTC Sarige Express', 'Nagara Sarige'],
  },
  VRL: {
    operatorId: 'VRL',
    name: 'VRL Travels (Licensed Private Operator)',
    nameKannada: 'ವಿಆರ್‌ಎಲ್ ಟ್ರಾವೆಲ್ಸ್ (ಪರವಾನಗಿ ಪಡೆದ ಖಾಸಗಿ ಸಾರಿಗೆ)',
    shortCode: 'VRL',
    isStateCorporation: false,
    headquarters: 'Giriraj Annexe, Circuit House Road, Hubballi - 580029',
    helpline: '0836-2307300',
    officialBookingUrl: 'https://www.vrlbus.in/',
    shaktiSchemeApplicable: false, // Private operator - Shakti scheme not valid
    serviceDivisions: ['Pan-Karnataka Intercity Trunk Corridors'],
    vehicleClasses: ['I-Shift Multi-Axle Volvo AC', 'AC Sleeper'],
  },
};

export function getBusOperator(operatorId: string): BusOperatorRecord {
  return KARNATAKA_BUS_OPERATORS[operatorId] ?? KARNATAKA_BUS_OPERATORS.KSRTC;
}
