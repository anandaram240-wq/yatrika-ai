/**
 * @file src/transit/railways/trainStatusService.ts
 * @description Train live status policy and NTES enquiry link generator.
 * @theme Code. Create. Celebrate Kannada.
 */

export class TrainStatusService {
  public static getNtesLiveStatusUrl(trainNumber: string, dateIso: string = new Date().toISOString().split('T')[0]): string {
    const cleanNo = trainNumber.split('/')[0].trim();
    return `https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=${cleanNo}&date=${dateIso}`;
  }

  public static getIrctcBookingUrl(_trainNumber: string, fromCode: string, toCode: string): string {
    return `https://www.irctc.co.in/nget/train-search?src=${fromCode}&dst=${toCode}`;
  }

  public static getPolicyNotice(): string {
    return 'Indian Railways does not provide an unrestricted public real-time seat availability API. YatriKa directs users directly to the official IRCTC e-ticketing portal for live berth charts and booking.';
  }
}
