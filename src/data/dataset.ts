import candidateData from './atlas-evidence-candidates.json';
import { AtlasDataset, AtlasEntry, ConceptCoverage, RegionMatrixSlotId, RegionId } from '../types';

export const ATLAS_DATASET: AtlasDataset = candidateData as AtlasDataset;

export const RECONCILED_METRICS = {
  conceptCount: ATLAS_DATASET.concept_coverage_summary.length, // 5
  entryCount: ATLAS_DATASET.entries.length,                   // 13 (Reconciled from Argon's reported 12)
  schemaVersion: ATLAS_DATASET.schema_version,                // 1.1.0
  datasetId: ATLAS_DATASET.dataset_id,
  licensePolicy: ATLAS_DATASET.license_policy,
  defaultEvidenceStatus: 'provisional' as const,              // All 13 entries are provisional pending physical locators
};

export const ATLAS_ENTRIES_BY_ID = new Map<string, AtlasEntry>(
  ATLAS_DATASET.entries.map((entry) => [entry.id, entry])
);

export const CONCEPTS: ConceptCoverage[] = ATLAS_DATASET.concept_coverage_summary;
export const ALL_ENTRIES: AtlasEntry[] = ATLAS_DATASET.entries;

export const REGION_SLOT_DEFINITIONS: Record<
  RegionMatrixSlotId,
  {
    id: RegionId;
    slotKey: RegionMatrixSlotId;
    name: string;
    kannadaName: string;
    description: string;
  }
> = {
  old_mysuru_southern: {
    id: 'mysuru-mandya',
    slotKey: 'old_mysuru_southern',
    name: 'Old Mysuru & Southern Karnataka',
    kannadaName: 'ಹಳೇ ಮೈಸೂರು - ಮಂಡ್ಯ ವಲಯ',
    description: 'Southern dialect cluster with historic courtly baseline in Mysuru and agrarian discourse in Mandya.',
  },
  kittur_karnataka: {
    id: 'uttara-karnataka',
    slotKey: 'kittur_karnataka',
    name: 'Kittur Karnataka (Northern Plains)',
    kannadaName: 'ಕಿತ್ತೂರು ಕರ್ನಾಟಕ ವಲಯ (ಧಾರವಾಡ-ಬೆಳಗಾವಿ)',
    description: 'Northern plain varieties (Dharwad, Hubballi, Belagavi) featuring contracted verbal stems and interrogatives.',
  },
  kalyana_karnataka: {
    id: 'kalyana-karnataka',
    slotKey: 'kalyana_karnataka',
    name: 'Kalyana Karnataka (Northeastern)',
    kannadaName: 'ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ವಲಯ (ಕಲಬುರ್ಗಿ-ಬೀದರ್)',
    description: 'Northeastern varieties marked by dative-progressive constructions (-likkatt-) and Deccan linguistic contact.',
  },
  karavali_coastal: {
    id: 'karavali',
    slotKey: 'karavali_coastal',
    name: 'Karavali & Coastal Karnataka',
    kannadaName: 'ಕರಾವಳಿ ಮತ್ತು ಕುಂದಾಪ್ರ ಕನ್ನಡ',
    description: 'Coastal varieties including Kundagannada and Havyaka, with vowel shortening and Halegannada verb reflexes.',
  },
  malnad: {
    id: 'malenadu',
    slotKey: 'malnad',
    name: 'Malnad Highland Zone',
    kannadaName: 'ಮಲೆನಾಡು ಘಟ್ಟ ಪ್ರದೇಶ',
    description: 'Highland transition zone (Shivamogga, Chikkamagaluru) sharing interrogative "enta" with coastal varieties.',
  },
  central_border_cluster: {
    id: 'bengaluru-urban',
    slotKey: 'central_border_cluster',
    name: 'Central & Urban Transition Cluster',
    kannadaName: 'ಮಧ್ಯ ಕರ್ನಾಟಕ ಮತ್ತು ರಾಜಧಾನಿ ವಲಯ',
    description: 'Central transitional districts and Bengaluru urban youth vernacular; evaluated as transition zone.',
  },
};

export function getEntryById(id: string | null): AtlasEntry | undefined {
  if (!id) return undefined;
  return ATLAS_ENTRIES_BY_ID.get(id);
}
