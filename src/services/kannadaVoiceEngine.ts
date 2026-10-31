/**
 * Deterministic Kannada trip-intent parser for YatriKa AI.
 *
 * This is a dictionary-backed baseline, not a speech recognizer or a general
 * Kannada morphological analyzer. Supply verified place aliases from the
 * application's destination registry. Ambiguous or unmatched words are
 * returned for confirmation instead of being guessed.
 */

export type PlaceRecord = {
  id: string;
  name: string;
  aliases?: string[];
  district?: string;
  region?: string;
};

export type PlaceRole = "origin" | "destination" | "via" | "context";

export type ResolvedPlace = {
  place: PlaceRecord;
  role: PlaceRole;
  matchedText: string;
  matchedAlias: string;
  suffix?: string;
};

export type KannadaTripIntent = {
  rawText: string;
  normalizedText: string;
  origin?: ResolvedPlace;
  destination?: ResolvedPlace;
  via: ResolvedPlace[];
  contexts: ResolvedPlace[];
  unresolvedTokens: string[];
  confidence: number;
  needsConfirmation: boolean;
  messages: string[];
};

type SuffixRule = {
  suffix: string;
  role: PlaceRole;
  /** Remove the suffix before looking up the dictionary alias. */
  strip: boolean;
  /** Optional phonological material restored after suffix removal. */
  restore?: string;
};

// Longest suffixes must be tested first to avoid partial matches.
const SUFFIX_RULES: SuffixRule[] = [
  { suffix: "ಮುಖಾಂತರ", role: "via", strip: true },
  { suffix: "ಮೂಲಕ", role: "via", strip: true },
  { suffix: "ರಿನಿಂದ", role: "origin", strip: true, restore: "ರು" },
  { suffix: "ನಿಂದ", role: "origin", strip: true },
  { suffix: "ರಿಂದ", role: "origin", strip: true },
  { suffix: "ಯಿಂದ", role: "origin", strip: true },
  { suffix: "ದಿಂದ", role: "origin", strip: true },
  { suffix: "ಇಂದ", role: "origin", strip: true },
  { suffix: "ರಿಗೆ", role: "destination", strip: true, restore: "ರು" },
  { suffix: "ಕ್ಕೆ", role: "destination", strip: true },
  { suffix: "ಇಗೆ", role: "destination", strip: true },
  { suffix: "ಗೆ", role: "destination", strip: true },
  { suffix: "ನಲ್ಲಿ", role: "context", strip: true },
  { suffix: "ಅಲ್ಲಿ", role: "context", strip: true },
  { suffix: "ದಲ್ಲಿ", role: "context", strip: true },
  { suffix: "ಯಲ್ಲಿ", role: "context", strip: true },
];

const VIA_CONNECTORS = new Set(["ಮೂಲಕ", "ಮುಖಾಂತರ"]);

/** Normalize Kannada text without transliterating or discarding Kannada letters. */
export function normalizeKannadaText(value: string): string {
  return value
    .normalize("NFC")
    .toLocaleLowerCase("kn-IN")
    .replace(/[.,!?;:()[\]{}"'“”‘’]/gu, " ")
    .replace(/[\u200B-\u200D\uFEFF]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function normalizeAlias(value: string): string {
  return normalizeKannadaText(value);
}

function buildAliasIndex(places: PlaceRecord[]): Map<string, PlaceRecord[]> {
  const index = new Map<string, PlaceRecord[]>();
  for (const place of places) {
    const aliases = [place.name, ...(place.aliases ?? [])];
    for (const rawAlias of aliases) {
      const alias = normalizeAlias(rawAlias);
      if (!alias) continue;
      const list = index.get(alias) ?? [];
      if (!list.some((item) => item.id === place.id)) list.push(place);
      index.set(alias, list);
    }
  }
  return index;
}

function resolveAlias(
  text: string,
  index: Map<string, PlaceRecord[]>,
): { places: PlaceRecord[]; alias: string } | undefined {
  const key = normalizeAlias(text);
  const places = index.get(key);
  if (!places?.length) return undefined;
  return { places, alias: key };
}

function stripTrailingSuffix(token: string): { stem: string; rule: SuffixRule } | undefined {
  for (const rule of SUFFIX_RULES) {
    if (!token.endsWith(rule.suffix)) continue;
    const stem = token.slice(0, -rule.suffix.length) + (rule.restore ?? "");
    if (stem.length > 0) return { stem, rule };
  }
  return undefined;
}

function makeResolved(
  place: PlaceRecord,
  role: PlaceRole,
  matchedText: string,
  matchedAlias: string,
  suffix?: string,
): ResolvedPlace {
  return { place, role, matchedText, matchedAlias, ...(suffix ? { suffix } : {}) };
}

/**
 * Parse the source, destination, via stops and locative context from a Kannada
 * utterance. Multi-word exact aliases are matched before individual tokens.
 */
export function parseKannadaTripRequest(
  rawText: string,
  places: PlaceRecord[],
): KannadaTripIntent {
  const normalizedText = normalizeKannadaText(rawText);
  const tokens = normalizedText.split(" ").filter(Boolean);
  const index = buildAliasIndex(places);
  const usedTokenIndexes = new Set<number>();
  const unresolvedTokens: string[] = [];
  const messages: string[] = [];
  const found: ResolvedPlace[] = [];

  // Match multi-word aliases first, e.g. "ಮಂಗಳೂರು ನಗರ" if present in registry.
  const sortedAliases = [...index.keys()].sort((a, b) => b.length - a.length);
  for (let i = 0; i < tokens.length; i += 1) {
    if (usedTokenIndexes.has(i)) continue;
    for (const alias of sortedAliases) {
      const aliasTokens = alias.split(" ").filter(Boolean);
      if (aliasTokens.length < 2 || i + aliasTokens.length > tokens.length) continue;
      const phraseTokens = tokens.slice(i, i + aliasTokens.length);
      let candidate = phraseTokens.join(" ");
      let phraseRole: PlaceRole = "context";
      let phraseSuffix: string | undefined;
      if (candidate !== alias) {
        const inflectedFinalToken = stripTrailingSuffix(phraseTokens[phraseTokens.length - 1]);
        if (!inflectedFinalToken) continue;
        phraseTokens[phraseTokens.length - 1] = inflectedFinalToken.stem;
        candidate = phraseTokens.join(" ");
        if (candidate !== alias) continue;
        phraseRole = inflectedFinalToken.rule.role;
        phraseSuffix = inflectedFinalToken.rule.suffix;
      }
      const placesForAlias = index.get(alias) ?? [];
      if (placesForAlias.length > 1) {
        messages.push(`The place name "${tokens.slice(i, i + aliasTokens.length).join(" ")}" matches more than one registry entry.`);
      } else {
        found.push(makeResolved(
          placesForAlias[0],
          phraseRole,
          tokens.slice(i, i + aliasTokens.length).join(" "),
          alias,
          phraseSuffix,
        ));
      }
      for (let j = 0; j < aliasTokens.length; j += 1) usedTokenIndexes.add(i + j);
      break;
    }
  }

  for (let i = 0; i < tokens.length; i += 1) {
    if (usedTokenIndexes.has(i)) continue;
    const token = tokens[i];

    // Explicit "Xದ ಮೂಲಕ" / "X ಮೂಲಕ" corridor patterns.
    const next = tokens[i + 1];
    if (next && VIA_CONNECTORS.has(next)) {
      const stem = token.endsWith("ದ") ? token.slice(0, -1) : token;
      const resolved = resolveAlias(stem, index);
      if (resolved?.places.length === 1) {
        found.push(makeResolved(resolved.places[0], "via", token + " " + next, resolved.alias, "ಮೂಲಕ"));
        usedTokenIndexes.add(i);
        usedTokenIndexes.add(i + 1);
        continue;
      }
      if (resolved && resolved.places.length > 1) {
        messages.push(`The via stop "${token}" is ambiguous in the destination registry.`);
        usedTokenIndexes.add(i);
        usedTokenIndexes.add(i + 1);
        continue;
      }
    }

    const exact = resolveAlias(token, index);
    if (exact?.places.length === 1) {
      // An unmarked place name is context only. Do not infer origin/destination.
      found.push(makeResolved(exact.places[0], "context", token, exact.alias));
      continue;
    }
    if (exact && exact.places.length > 1) {
      messages.push(`The place "${token}" matches multiple registry entries.`);
      continue;
    }

    const suffixed = stripTrailingSuffix(token);
    if (suffixed) {
      const resolved = resolveAlias(suffixed.stem, index);
      if (resolved?.places.length === 1) {
        found.push(makeResolved(
          resolved.places[0],
          suffixed.rule.role,
          token,
          resolved.alias,
          suffixed.rule.suffix,
        ));
        continue;
      }
      if (resolved && resolved.places.length > 1) {
        messages.push(`The inflected place "${token}" matches multiple registry entries.`);
        continue;
      }
    }

    // Ignore common request words; retain other unmatched tokens for review.
    const commonWords = new Set([
      "ಹೋಗಿ", "ಹೋಗಬೇಕು", "ನೋಡಬೇಕು", "ನೋಡ್ಬೇಕು", "ಬೇಕು", "ಮತ್ತು", "ನಂತರ",
      "ಇಂದ", "ನಿಂದ", "ಗೆ", "ಕ್ಕೆ", "ನಲ್ಲಿ", "ಅಲ್ಲಿ", "ಮೂಲಕ", "ಮುಖಾಂತರ",
      "ಪ್ರಯಾಣ", "ಮಾಡಿ", "ಮಾಡಬೇಕು", "ಒಂದು", "ದಿನ", "ದಿನಗಳ", "ಬಗ್ಗೆ",
    ]);
    if (!commonWords.has(token) && !/^\d+$/u.test(token)) unresolvedTokens.push(token);
  }

  const byRole = (role: PlaceRole) => found.filter((item) => item.role === role);
  const origins = byRole("origin");
  const destinations = byRole("destination");
  const via = byRole("via");
  const contexts = [...byRole("context")];

  // Promote one unmarked final place only when there is an explicit origin.
  // This remains conservative and requires confirmation.
  if (destinations.length === 0 && origins.length === 1 && contexts.length > 0) {
    const lastContext = contexts[contexts.length - 1];
    const idx = contexts.indexOf(lastContext);
    contexts.splice(idx, 1);
    destinations.push({ ...lastContext, role: "destination" });
    messages.push("Destination inferred from an unmarked place name; confirm before using the itinerary.");
  }

  if (origins.length > 1) messages.push("More than one origin was detected. Please confirm the starting point.");
  if (destinations.length > 1) messages.push("More than one destination was detected. Please confirm the destination.");
  if (origins.length === 0) messages.push("No explicit trip origin was found.");
  if (destinations.length === 0) messages.push("No explicit trip destination was found.");
  if (unresolvedTokens.length) messages.push("Some words could not be matched to the place registry.");

  const matchedCount = found.length;
  const ambiguityPenalty = messages.length * 0.12;
  const unresolvedPenalty = Math.min(0.35, unresolvedTokens.length * 0.05);
  const confidence = Math.max(0, Math.min(1,
    (matchedCount ? 0.45 + Math.min(0.45, matchedCount * 0.12) : 0.1)
    - ambiguityPenalty - unresolvedPenalty,
  ));

  return {
    rawText,
    normalizedText,
    ...(origins.length === 1 ? { origin: origins[0] } : {}),
    ...(destinations.length === 1 ? { destination: destinations[0] } : {}),
    via,
    contexts,
    unresolvedTokens: [...new Set(unresolvedTokens)],
    confidence,
    needsConfirmation: origins.length !== 1 || destinations.length !== 1 || messages.length > 0,
    messages,
  };
}

/** Convert parser output into a small, UI-friendly planning summary. */
export function analyzeKannadaSpeechToPlan(
  transcript: string,
  places: PlaceRecord[],
): KannadaTripIntent {
  return parseKannadaTripRequest(transcript, places);
}
