/**
 * @file src/transit/buses/bookingHandoff.ts
 * @description Official booking handoff generator and disclaimers for Karnataka Bus Operators.
 * Never pretends YatriKa completed an external reservation; directs traveler to official portals.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface BookingHandoffPayload {
  operatorId: 'KSRTC' | 'BMTC' | 'NWKRTC' | 'KKRTC' | 'VRL';
  originCity: string;
  destinationCity: string;
  journeyDate: string;
  serviceNumber?: string;
  shaktiEligible: boolean;
  handoffUrl: string;
  instructionsKannada: string;
  instructionsEnglish: string;
  disclaimer: string;
}

export class BusBookingHandoff {
  public static createHandoff(
    operatorId: 'KSRTC' | 'BMTC' | 'NWKRTC' | 'KKRTC' | 'VRL',
    originCity: string,
    destinationCity: string,
    journeyDate: string = new Date().toISOString().split('T')[0],
    shaktiEligible: boolean = false
  ): BookingHandoffPayload {
    let handoffUrl = 'https://ksrtc.in/oprs-web/guest/home.do';
    let instructionsEnglish = 'You will be redirected to the official KSRTC Awatar portal. Please select your boarding point and seat number.';
    let instructionsKannada = 'ನಿಮ್ಮನ್ನು ಅಧಿಕೃತ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಅವತಾರ್ ಪೋರ್ಟಲ್‌ಗೆ ಕೊಂಡೊಯ್ಯಲಾಗುತ್ತದೆ. ದಯವಿಟ್ಟು ಬೋರ್ಡಿಂಗ್ ಪಾಯಿಂಟ್ ಮತ್ತು ಸೀಟ್ ಆಯ್ಕೆಮಾಡಿ.';

    if (operatorId === 'BMTC') {
      handoffUrl = 'https://mybmtc.karnataka.gov.in/';
      instructionsEnglish = 'BMTC city buses and Vayu Vajra airport passes can be purchased directly on the bus or via the official Namma BMTC app.';
      instructionsKannada = 'ಬಿಎಂಟಿಸಿ ನಗರ ಬಸ್ ಮತ್ತು ವಾಯು ವಜ್ರ ಟಿಕೆಟ್‌ಗಳನ್ನು ನೇರವಾಗಿ ಬಸ್ಸಿನಲ್ಲಿ ಅಥವಾ ನಮ್ಮ ಬಿಎಂಟಿಸಿ ಆ್ಯಪ್ ಮೂಲಕ ಪಡೆಯಬಹುದು.';
    } else if (operatorId === 'NWKRTC') {
      handoffUrl = 'https://nwkrtc.karnataka.gov.in/';
      instructionsEnglish = 'You will be redirected to the official NWKRTC reservation portal. Select origin, destination, and proceed with payment.';
      instructionsKannada = 'ನಿಮ್ಮನ್ನು ವಾಯವ್ಯ ಕರ್ನಾಟಕ ರಸ್ತೆ ಸಾರಿಗೆ ಸಂಸ್ಥೆಯ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಕೊಂಡೊಯ್ಯಲಾಗುತ್ತದೆ.';
    } else if (operatorId === 'KKRTC') {
      handoffUrl = 'https://kkrtc.karnataka.gov.in/';
      instructionsEnglish = 'You will be redirected to the official KKRTC portal for Kalyana Karnataka routes.';
      instructionsKannada = 'ನಿಮ್ಮನ್ನು ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ಸಾರಿಗೆ ನಿಗಮದ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಕೊಂಡೊಯ್ಯಲಾಗುತ್ತದೆ.';
    } else if (operatorId === 'VRL') {
      handoffUrl = 'https://www.vrlbus.in/';
      instructionsEnglish = 'You will be redirected to the verified VRL Travels reservation portal.';
      instructionsKannada = 'ವಿಆರ್‌ಎಲ್ ಟ್ರಾವೆಲ್ಸ್ ಅಧಿಕೃತ ಬುಕಿಂಗ್ ವೆಬ್‌ಸೈಟ್‌ಗೆ ತೆರಳುತ್ತಿದ್ದೀರಿ.';
    }

    if (shaktiEligible) {
      instructionsEnglish += ' [SHAKTI SCHEME: Karnataka resident women travel 100% FREE on Ordinary & Express services with Government Photo ID. No prior online reservation ticket needed for ordinary buses.]';
      instructionsKannada += ' [ಶಕ್ತಿ ಯೋಜನೆ: ಕರ್ನಾಟಕದ ಮಹಿಳೆಯರಿಗೆ ಸರ್ಕಾರಿ ಭಾವಚಿತ್ರ ಗುರುತಿನ ಚೀಟಿ ತೋರಿಸಿ ಉಚಿತ ಶೂನ್ಯ ದರದ ಟಿಕೆಟ್ ಲಭ್ಯ. ಸಾಮಾನ್ಯ ಬಸ್‌ಗಳಿಗೆ ಆನ್‌ಲೈನ್ ಟಿಕೆಟ್ ಅಗತ್ಯವಿಲ್ಲ.]';
    }

    return {
      operatorId,
      originCity,
      destinationCity,
      journeyDate,
      shaktiEligible,
      handoffUrl,
      instructionsKannada,
      instructionsEnglish,
      disclaimer: 'YatriKa AI does not handle payment processing or issue tickets directly. All bookings occur securely on the transport operator’s official website.',
    };
  }
}
