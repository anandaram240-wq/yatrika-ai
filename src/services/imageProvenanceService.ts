/**
 * @file src/services/imageProvenanceService.ts
 * @description Image verification, license compliance, and responsive media resolver.
 * @theme Code. Create. Celebrate Kannada.
 */

import { VERIFIED_KARNATAKA_MEDIA_COLLECTION, VerifiedPhotoRecord } from '../data/media/karnatakaPhotoRegistry';

export interface ImageProvenanceAudit {
  photoId: string;
  hasFileLevelLicense: boolean;
  hasPhotographerAttribution: boolean;
  isAiGenerated: boolean;
  isApprovedForDisplay: boolean;
  citationBadge: string;
}

export class ImageProvenanceService {
  public static getPhotoForDestination(poiId: string): VerifiedPhotoRecord | null {
    return VERIFIED_KARNATAKA_MEDIA_COLLECTION[poiId] || null;
  }

  public static auditPhoto(record: VerifiedPhotoRecord): ImageProvenanceAudit {
    const hasLicense = Boolean(record.license && record.license.length > 3);
    const hasAttribution = Boolean(record.attribution && record.attribution.length > 5);
    const isAi = (record.isAiGenerated as unknown as boolean) === true;
    const isApproved = hasLicense && hasAttribution && !isAi && record.exactLandmarkVerified;

    return {
      photoId: record.photoId,
      hasFileLevelLicense: hasLicense,
      hasPhotographerAttribution: hasAttribution,
      isAiGenerated: isAi,
      isApprovedForDisplay: isApproved,
      citationBadge: `${record.attribution} • ${record.license}`,
    };
  }

  public static generateSrcSet(baseImageUrl: string): string {
    if (!baseImageUrl.includes('unsplash.com')) {
      return baseImageUrl;
    }
    const cleanUrl = baseImageUrl.split('?')[0];
    return `${cleanUrl}?auto=format&fit=crop&w=480&q=75 480w, ${cleanUrl}?auto=format&fit=crop&w=800&q=80 800w, ${cleanUrl}?auto=format&fit=crop&w=1200&q=85 1200w, ${cleanUrl}?auto=format&fit=crop&w=1600&q=85 1600w`;
  }
}
