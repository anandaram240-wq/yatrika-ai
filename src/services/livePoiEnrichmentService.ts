// src/services/livePoiEnrichmentService.ts
// Wikipedia REST API enrichment for Karnataka POIs (free, no key, CORS-open)
// https://en.wikipedia.org/api/rest_v1/

export interface WikiEnrichment {
  title: string;
  extract: string;       // 2-3 sentence summary
  thumbnailUrl?: string; // Wikimedia thumbnail if available
  wikiUrl: string;
  lastModified?: string;
}

/** Wikipedia article slugs for key Karnataka POIs */
export const WIKI_ARTICLE_MAP: Record<string, string> = {
  'poi-mysuru-palace':       'Mysore_Palace',
  'poi-hampi-vijayanagara':  'Hampi',
  'poi-belur-chenn':         'Chennakeshava_Temple,_Belur',
  'poi-halebidu':            'Hoysaleswara_Temple',
  'poi-chikka-mullayanagiri':'Mullayanagiri',
  'poi-coorg-madikeri':      'Madikeri',
  'poi-kabini-reservoir':    'Kabini_reservoir',
  'poi-nagarhole-np':        'Nagarhole_National_Park',
  'poi-jog-falls':           'Jog_Falls',
  'poi-badami-caves':        'Badami_cave_temples',
  'poi-pattadakal':          'Pattadakal',
  'poi-aihole':              'Aihole',
  'poi-shravanabelagola':    'Shravanabelagola',
  'poi-gokarna':             'Gokarna,_Karnataka',
  'poi-udupi-krishna':       'Sri_Krishna_Matha,_Udupi',
  'poi-dharmasthala':        'Dharmasthala',
  'poi-bababudangiri':       'Baba_Budangiri',
  'poi-kudremukh':           'Kudremukh',
  'poi-bandipur':            'Bandipur_National_Park',
  'poi-dubare-elephant':     'Dubare_Elephant_Camp',
  'poi-dandeli-kali':        'Dandeli',
  'poi-bijapur-ibrahim':     'Gol_Gumbaz',
  'poi-badami-town':         'Badami',
  'poi-chitradurga':         'Chitradurga_Fort',
  'poi-melukote':            'Melukote',
  'poi-sringeri':            'Sringeri',
  'poi-yana-rocks':          'Yana,_Karnataka',
  'poi-agumbe':              'Agumbe',
  'poi-sakleshpur':          'Sakleshpur',
  'poi-mangaluru-city':      'Mangaluru',
  'poi-hassan-city':         'Hassan,_Karnataka',
  'poi-hubballi-city':       'Hubballi',
};

const ENRICH_CACHE = new Map<string, { data: WikiEnrichment; expiresAt: number }>();
const ENRICH_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function fetchWikiEnrichment(poiId: string): Promise<WikiEnrichment | null> {
  const cached = ENRICH_CACHE.get(poiId);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const articleSlug = WIKI_ARTICLE_MAP[poiId];
  if (!articleSlug) return null;

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(articleSlug)}`,
      {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (!res.ok) return null;
    const json = await res.json();

    const enrichment: WikiEnrichment = {
      title: json.displaytitle || json.title,
      extract: json.extract || '',
      thumbnailUrl: json.thumbnail?.source,
      wikiUrl: json.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${articleSlug}`,
      lastModified: json.timestamp,
    };

    ENRICH_CACHE.set(poiId, { data: enrichment, expiresAt: Date.now() + ENRICH_TTL_MS });
    return enrichment;
  } catch {
    return null;
  }
}
