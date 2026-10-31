import { describe, expect, it } from "vitest";
import { parseKannadaTripRequest, type PlaceRecord } from "../services/kannadaVoiceEngine";

const places: PlaceRecord[] = [
  { id: "blr", name: "ಬೆಂಗಳೂರು", aliases: ["Bengaluru"] },
  { id: "ckm", name: "ಚಿಕ್ಕಮಗಳೂರು", aliases: ["Chikkamagaluru"] },
  { id: "mys", name: "ಮೈಸೂರು", aliases: ["Mysuru"] },
  { id: "has", name: "ಹಾಸನ", aliases: ["Hassan"] },
];

describe("parseKannadaTripRequest", () => {
  it("resolves an inflected origin and destination", () => {
    const result = parseKannadaTripRequest("ಬೆಂಗಳೂರಿನಿಂದ ಚಿಕ್ಕಮಗಳೂರಿಗೆ ಹೋಗಬೇಕು", places);
    expect(result.origin?.place.id).toBe("blr");
    expect(result.destination?.place.id).toBe("ckm");
  });

  it("resolves a via stop expressed with ಮೂಲಕ", () => {
    const result = parseKannadaTripRequest("ಬೆಂಗಳೂರಿನಿಂದ ಹಾಸನದ ಮೂಲಕ ಮೈಸೂರಿಗೆ ಹೋಗಬೇಕು", places);
    expect(result.origin?.place.id).toBe("blr");
    expect(result.destination?.place.id).toBe("mys");
    expect(result.via.map((item) => item.place.id)).toContain("has");
  });

  it("does not invent an origin or destination from unmarked names", () => {
    const result = parseKannadaTripRequest("ಬೆಂಗಳೂರು ಮೈಸೂರು", places);
    expect(result.origin).toBeUndefined();
    expect(result.destination).toBeUndefined();
    expect(result.needsConfirmation).toBe(true);
  });

  it("returns unresolved words for confirmation", () => {
    const result = parseKannadaTripRequest("ಬೆಂಗಳೂರಿನಿಂದ ಚಿಕ್ಕಮಗಳೂರಿಗೆ ಗುಪ್ತಸ್ಥಳಕ್ಕೆ ಹೋಗಬೇಕು", places);
    expect(result.unresolvedTokens).toContain("ಗುಪ್ತಸ್ಥಳಕ್ಕೆ");
    expect(result.needsConfirmation).toBe(true);
  });

  it("normalizes decomposed Unicode consistently", () => {
    const composed = parseKannadaTripRequest("ಬೆಂಗಳೂರಿನಿಂದ ಚಿಕ್ಕಮಗಳೂರಿಗೆ", places);
    const decomposed = parseKannadaTripRequest("ಬೆಂಗಳೂರಿನಿಂದ ಚಿಕ್ಕಮಗಳೂರಿಗೆ".normalize("NFD"), places);
    expect(composed.origin?.place.id).toBe(decomposed.origin?.place.id);
    expect(composed.destination?.place.id).toBe(decomposed.destination?.place.id);
  });
});
