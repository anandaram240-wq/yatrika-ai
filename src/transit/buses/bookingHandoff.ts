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
  playStoreUrl?: string;
  appStoreUrl?: string;
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
    let playStoreUrl: string | undefined = 'https://play.google.com/store/apps/details?id=com.ksrtc.awatar';
    let appStoreUrl: string | undefined = undefined;
    let instructionsEnglish = 'You will be redirected to the official KSRTC Awatar portal. Please select your boarding point and seat number.';
    let instructionsKannada = 'ನಿಮ್ಮನ್ನು ಅಧಿಕೃತ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಅವತಾರ್ ಪೋರ್ಟಲ್‌ಗೆ ಕೊಂಡೊಯ್ಯಲಾಗುತ್ತದೆ. ದಯವಿಟ್ಟು ಬೋರ್ಡಿಂಗ್ ಪಾಯಿಂಟ್ ಮತ್ತು ಸೀಟ್ ಆಯ್ಕೆಮಾಡಿ.';

    if (operatorId === 'BMTC') {
      handoffUrl = 'https://mybmtc.karnataka.gov.in/';
      playStoreUrl = 'https://play.google.com/store/apps/details?id=com.bmtc.bmtcavls.two';
      appStoreUrl = 'https://apps.apple.com/in/app/namma-bmtc-2-0/id6808674938';
      instructionsEnglish = 'BMTC live tracking and timetable planning is provided exclusively via the official Namma BMTC 2.0 app. Tickets and airport Vayu Vajra passes are purchased on-bus.';
      instructionsKannada = 'ಬಿಎಂಟಿಸಿ ಲೈವ್ ಬಸ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ವೇಳಾಪಟ್ಟಿಗಾಗಿ ಅಧಿಕೃತ ನಮ್ಮ ಬಿಎಂಟಿಸಿ ೨.೦ ಆ್ಯಪ್ ಬಳಸಿ. ಟಿಕೆಟ್‌ಗಳನ್ನು ಬಸ್ಸಿನಲ್ಲಿ ಖರೀದಿಸಬಹುದು.';
    } else if (operatorId === 'NWKRTC') {
      handoffUrl = 'https://nwkrtc.karnataka.gov.in/';
      playStoreUrl = 'https://play.google.com/store/apps/details?id=com.ksrtc.awatar';
      instructionsEnglish = 'NWKRTC long-distance seat bookings are integrated with the centralized KSRTC AWATAR portal.';
      instructionsKannada = 'ವಾಯವ್ಯ ಕರ್ನಾಟಕ ರಸ್ತೆ ಸಾರಿಗೆ ಸಂಸ್ಥೆಯ ಮುಂಗಡ ಆಸನ ಕಾಯ್ದಿರಿಸುವಿಕೆ ಅಧಿಕೃತ ಅವತಾರ್ ಪೋರ್ಟಲ್ ಮೂಲಕ ನಡೆಯುತ್ತದೆ.';
    } else if (operatorId === 'KKRTC') {
      // Passenger portal link (not employee portal)
      handoffUrl = 'https://kkrtc.karnataka.gov.in/english';
      playStoreUrl = 'https://play.google.com/store/apps/details?id=com.ksrtc.awatar';
      instructionsEnglish = 'Official KKRTC passenger portal. Online inter-city seat reservations are processed through KSRTC AWATAR.';
      instructionsKannada = 'ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ಸಾರಿಗೆ ನಿಗಮದ ಅಧಿಕೃತ ಪ್ರಯಾಣಿಕರ ಪೋರ್ಟಲ್. ಮುಂಗಡ ಆಸನ ಬುಕಿಂಗ್ ಅವತಾರ್ ವ್ಯವಸ್ಥೆಯಡಿ ಲಭ್ಯವಿದೆ.';
    } else if (operatorId === 'VRL') {
      handoffUrl = 'https://www.vrlbus.in/';
      playStoreUrl = 'https://play.google.com/store/apps/details?id=com.vrlgroup';
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
      playStoreUrl,
      appStoreUrl,
      instructionsKannada,
      instructionsEnglish,
      disclaimer: 'YatriKa AI does not handle payment processing or issue tickets directly. All bookings occur securely on the transport operator’s official website.',
    };
  }
}
