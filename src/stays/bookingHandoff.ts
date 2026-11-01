/**
 * @file src/stays/bookingHandoff.ts
 * @description Official booking and enquiry handoff generator for Karnataka Accommodations.
 * Connects directly to KSTDC, Jungle Lodges (JLR), or verified property hosts.
 * @theme Code. Create. Celebrate Kannada.
 */

import { ComprehensiveAccommodation } from './accommodationRegistry';

export interface StayBookingHandoff {
  stayId: string;
  propertyName: string;
  officialBookingUrl: string;
  directPhone: string;
  bookingChannelType: 'OFFICIAL_GOVERNMENT_PORTAL' | 'DIRECT_HOMESTAY_HOST' | 'OFFICIAL_JLR_PORTAL';
  noticeEnglish: string;
  noticeKannada: string;
  disclaimer: string;
}

export class StayBookingHandoffService {
  public static createHandoff(stay: ComprehensiveAccommodation): StayBookingHandoff {
    let bookingChannelType: StayBookingHandoff['bookingChannelType'] = 'DIRECT_HOMESTAY_HOST';
    let noticeEnglish = `Contact property directly at ${stay.contactPhone} to confirm dates and room availability.`;
    let noticeKannada = `ಕೊಠಡಿ ಲಭ್ಯತೆ ಮತ್ತು ದಿನಾಂಕಗಳನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಆಸ್ತಿಯನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ: ${stay.contactPhone}.`;

    if (stay.category === 'kstdc_mayura') {
      bookingChannelType = 'OFFICIAL_GOVERNMENT_PORTAL';
      noticeEnglish = 'Book securely on the official Karnataka State Tourism Development Corporation (KSTDC) portal.';
      noticeKannada = 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪ್ರವಾಸೋದ್ಯಮ ಅಭಿವೃದ್ಧಿ ನಿಗಮದ (KSTDC) ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಬುಕ್ ಮಾಡಿ.';
    } else if (stay.category === 'jungle_lodges') {
      bookingChannelType = 'OFFICIAL_JLR_PORTAL';
      noticeEnglish = 'Official Jungle Lodges & Resorts portal includes wildlife safari slots and forest permits.';
      noticeKannada = 'ಜಂಗಲ್ ಲಾಡ್ಜಸ್ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ವನ್ಯಜೀವಿ ಸಫಾರಿ ಮತ್ತು ಅರಣ್ಯ ಪ್ರವೇಶ ಪರವಾನಗಿಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.';
    }

    return {
      stayId: stay.id,
      propertyName: stay.name,
      officialBookingUrl: stay.officialBookingUrl,
      directPhone: stay.contactPhone,
      bookingChannelType,
      noticeEnglish,
      noticeKannada,
      disclaimer: 'YatriKa AI does not mark up room tariffs or process payments. All reservations occur directly with the property or official government tourism corporation.',
    };
  }
}
