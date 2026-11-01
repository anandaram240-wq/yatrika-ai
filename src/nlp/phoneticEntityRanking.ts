/**
 * @file src/nlp/phoneticEntityRanking.ts
 * @description Phonetic similarity and transliteration-tolerant entity matcher for Kannada place names.
 * Handles historical epigraphic variants (e.g. Beluru / Velapura) and Kannada script transliteration noise.
 * @theme Code. Create. Celebrate Kannada.
 */

export class PhoneticEntityRanking {
  /**
   * Levenshtein edit distance between two strings.
   */
  public static levenshtein(a: string, b: string): number {
    const an = a.toLowerCase().trim();
    const bn = b.toLowerCase().trim();
    const matrix: number[][] = [];

    for (let i = 0; i <= bn.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= an.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= bn.length; i++) {
      for (let j = 1; j <= an.length; j++) {
        if (bn.charAt(i - 1) === an.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[bn.length][an.length];
  }

  /**
   * Normalized similarity score between 0.0 and 1.0.
   * Performs whole-string and word-level token alignment for multi-word place names.
   */
  public static similarityScore(query: string, candidate: string): number {
    const qNorm = query.toLowerCase().replace(/[^a-z0-9\u0C80-\u0CFF\s]/g, '').trim();
    const cNorm = candidate.toLowerCase().replace(/[^a-z0-9\u0C80-\u0CFF\s]/g, '').trim();

    if (qNorm === cNorm) return 1.0;
    if (cNorm.includes(qNorm) || qNorm.includes(cNorm)) return 0.88;

    const qClean = qNorm.replace(/\s+/g, '');
    const cClean = cNorm.replace(/\s+/g, '');
    const maxLen = Math.max(qClean.length, cClean.length);
    const wholeScore = maxLen === 0 ? 1.0 : Math.max(0, 1 - this.levenshtein(qClean, cClean) / maxLen);

    // Token-level cross-comparison
    const qTokens = qNorm.split(/\s+/).filter((t) => t.length > 2);
    const cTokens = cNorm.split(/\s+/).filter((t) => t.length > 2);

    let maxTokenScore = 0;
    for (const qt of qTokens) {
      for (const ct of cTokens) {
        if (qt === ct) {
          maxTokenScore = Math.max(maxTokenScore, 1.0);
        } else if (ct.includes(qt) || qt.includes(ct)) {
          maxTokenScore = Math.max(maxTokenScore, 0.88);
        } else {
          const tMax = Math.max(qt.length, ct.length);
          const tScore = 1 - this.levenshtein(qt, ct) / tMax;
          maxTokenScore = Math.max(maxTokenScore, tScore);
        }
      }
    }

    return Math.max(wholeScore, maxTokenScore);
  }

  /**
   * Rank a list of candidate POI names against a search query.
   */
  public static rankCandidates<T extends { name: string; nameKannada?: string }>(
    query: string,
    candidates: T[],
    topK: number = 3
  ): Array<{ item: T; score: number }> {
    const scored = candidates.map((item) => {
      const scoreEn = this.similarityScore(query, item.name);
      const scoreKn = item.nameKannada ? this.similarityScore(query, item.nameKannada) : 0;
      return {
        item,
        score: Math.round(Math.max(scoreEn, scoreKn) * 100) / 100,
      };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}
