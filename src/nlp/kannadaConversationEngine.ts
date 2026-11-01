/**
 * @file src/nlp/kannadaConversationEngine.ts
 * @description Contextual Multi-Turn Kannada Conversational Intelligence Engine for YatriKa AI.
 * @theme Code. Create. Celebrate Kannada.
 */

import { ContextMemory, ConversationalTripContext } from './contextMemory';
import { EntityResolver } from './entityResolver';
import { DialectAdapter, DialectClassification } from './dialectAdapter';
import { parseKannadaTripRequest, PlaceRecord } from '../services/kannadaVoiceEngine';
import { KARNATAKA_POIS, KARNATAKA_GATEWAY_ORIGINS, UserOriginOption } from '../data/karnatakaTravelRegistry';
import { KarnatakaPOI } from '../types/nammatrip';

export interface ConversationalResponse {
  replyTextKannada: string;
  dialectDetected: DialectClassification;
  updatedContext: ConversationalTripContext;
  suggestedAction?: 'update_itinerary' | 'ask_clarification' | 'confirm_detour';
  confidenceScore: number;
}

export class KannadaConversationEngine {
  private memory: ContextMemory;
  private placeRecords: PlaceRecord[];

  constructor() {
    this.memory = new ContextMemory();
    const originRecords: PlaceRecord[] = KARNATAKA_GATEWAY_ORIGINS.map((orig: UserOriginOption) => ({
      id: orig.id,
      name: orig.nameKannada,
      aliases: [orig.name, orig.name.split('(')[0].trim()],
    }));
    const poiRecords: PlaceRecord[] = KARNATAKA_POIS.map((poi: KarnatakaPOI) => {
      const extraAliases: string[] = [poi.name, poi.district];
      if (poi.nameKannada.includes('ಹಂಪಿ')) extraAliases.push('ಹಂಪಿ');
      if (poi.nameKannada.includes('ಬಾದಾಮಿ')) extraAliases.push('ಬಾದಾಮಿ');
      if (poi.nameKannada.includes('ಬೇಲೂರು')) extraAliases.push('ಬೇಲೂರು');
      return {
        id: poi.id,
        name: poi.nameKannada,
        aliases: extraAliases,
        district: poi.district,
        region: poi.macroRegion,
      };
    });
    this.placeRecords = [...originRecords, ...poiRecords];
  }

  public getContext(): ConversationalTripContext {
    return this.memory.getContext();
  }

  public resetConversation() {
    this.memory.reset();
  }

  /**
   * Processes a user turn and produces an explainable, contextual response.
   */
  public processUserMessage(rawMessage: string): ConversationalResponse {
    const dialect = DialectAdapter.classifyDialect(rawMessage);
    const normalizedText = dialect.normalizedKannadaText;

    this.memory.addTurn('user', rawMessage);

    // 1. Check for User Corrections (e.g. "X ಅಲ್ಲ, Y" or "no, change budget to Z")
    if (normalizedText.includes('ಅಲ್ಲ') || normalizedText.includes('ಬೇಡ') || normalizedText.toLowerCase().includes('not')) {
      const correctionResult = this.handleCorrection(normalizedText);
      if (correctionResult) {
        this.memory.addTurn('assistant', correctionResult.reply);
        return {
          replyTextKannada: correctionResult.reply,
          dialectDetected: dialect,
          updatedContext: this.memory.getContext(),
          suggestedAction: 'update_itinerary',
          confidenceScore: 0.94,
        };
      }
    }

    // 2. Check for intermediate additions (e.g. "ದಾರಿಯಲ್ಲಿ ಬರುವ ಸ್ಥಳಗಳನ್ನೂ ಸೇರಿಸು" or "add stops on the way")
    if (
      normalizedText.includes('ದಾರಿಯಲ್ಲಿ') ||
      normalizedText.includes('ಮಾರ್ಗದಲ್ಲಿ') ||
      normalizedText.includes('ದಾರೀಲಿ') ||
      normalizedText.includes('on the way')
    ) {
      const intermediateReply =
        'ಖಂಡಿತ, ನಿಮ್ಮ ಪ್ರಯಾಣದ ಸಮಯ ಮತ್ತು ಆಸಕ್ತಿಗೆ ಅನುಗುಣವಾಗಿ ಮಾರ್ಗದಲ್ಲಿರುವ ಸೂಕ್ತ ತಾಣಗಳನ್ನು (ಉದಾ: ಹಾಸನ, ಬೇಲೂರು) ಸೇರಿಸುತ್ತಿದ್ದೇನೆ.';
      this.memory.addViaStop({ id: 'poi-belur-halebidu', nameKannada: 'ಬೇಲೂರು ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ', nameEnglish: 'Belur Chennakeshava & Halebidu Temples' });
      this.memory.addTurn('assistant', intermediateReply);

      return {
        replyTextKannada: intermediateReply,
        dialectDetected: dialect,
        updatedContext: this.memory.getContext(),
        suggestedAction: 'update_itinerary',
        confidenceScore: 0.95,
      };
    }

    // 3. Parse trip request using deterministic Vibhakti parser
    const parsed = parseKannadaTripRequest(normalizedText, this.placeRecords);

    // Check origin
    if (parsed.origin) {
      this.memory.setOrigin({
        id: parsed.origin.place.id,
        nameKannada: parsed.origin.place.name,
        nameEnglish: parsed.origin.matchedAlias,
      });
    }

    // Check destinations
    if (parsed.destination) {
      this.memory.addDestination({
        id: parsed.destination.place.id,
        nameKannada: parsed.destination.place.name,
        nameEnglish: parsed.destination.matchedAlias,
      });
    } else if (this.memory.getContext().destinations.length === 0) {
      // Fallback: check tokens with suffixes stripped using EntityResolver
      const tokens = normalizedText.split(' ');
      for (const t of tokens) {
        const cleaned = t.replace(/(?:ಕ್ಕೆ|ಗೆ|ಇಗೆ|ದಲ್ಲಿ|ನಲ್ಲಿ|ಯಿಂದ|ನಿಂದ|ರಿಂದ|ಇಂದ)$/gu, '');
        if (cleaned.length >= 2 && cleaned !== parsed.origin?.place.name) {
          const res = EntityResolver.resolvePlace(cleaned);
          if (res && res.id !== parsed.origin?.place.id) {
            this.memory.addDestination({
              id: res.id,
              nameKannada: res.nameKannada,
              nameEnglish: res.nameEnglish,
            });
            break;
          }
        }
      }
    }

    // Check via stops
    if (parsed.via && parsed.via.length > 0) {
      parsed.via.forEach((v) => {
        this.memory.addViaStop({
          id: v.place.id,
          nameKannada: v.place.name,
          nameEnglish: v.matchedAlias,
        });
      });
    }

    // Check context stops mentioned along corridor (e.g. Hassan, Belur, Chikkamagaluru)
    if (parsed.contexts && parsed.contexts.length > 0) {
      parsed.contexts.forEach((c) => {
        const isAlreadyOrigin = parsed.origin?.place.id === c.place.id;
        const isAlreadyDest = parsed.destination?.place.id === c.place.id;
        if (!isAlreadyOrigin && !isAlreadyDest) {
          this.memory.addViaStop({
            id: c.place.id,
            nameKannada: c.place.name,
            nameEnglish: c.matchedAlias,
          });
        }
      });
    }

    // Fallback: entity lookup if not captured by strict vibhakti
    if (!parsed.origin && !parsed.destination) {
      const resolved = EntityResolver.resolvePlace(rawMessage);
      if (resolved) {
        if (resolved.isOriginHub) {
          this.memory.setOrigin({
            id: resolved.id,
            nameKannada: resolved.nameKannada,
            nameEnglish: resolved.nameEnglish,
          });
        } else {
          this.memory.addDestination({
            id: resolved.id,
            nameKannada: resolved.nameKannada,
            nameEnglish: resolved.nameEnglish,
          });
        }
      }
    }

    const currentCtx = this.memory.getContext();
    let reply = '';

    if (currentCtx.destinations.length > 0 && currentCtx.origin) {
      const destNames = currentCtx.destinations.map((d) => d.nameKannada).join(', ');
      reply = `${currentCtx.origin.nameKannada}ನಿಂದ ${destNames} ತಾಣಗಳಿಗೆ ಪ್ರವಾಸ ಯೋಜನೆ ಸಿದ್ಧವಾಗಿದೆ. ಮಾರ್ಗದಲ್ಲಿರುವ ವಿಶೇಷ ತಾಣಗಳು ಅಥವಾ ಊಟದ ಸ್ಥಳಗಳನ್ನು ಸೇರಿಸಬೇಕೇ?`;
    } else if (currentCtx.destinations.length > 0 && !currentCtx.origin) {
      const destNames = currentCtx.destinations.map((d) => d.nameKannada).join(', ');
      reply = `${destNames} ತಾಣಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ನಿಮ್ಮ ಪ್ರಯಾಣ ಆರಂಭವಾಗುವ ಊರು ಯಾವುದು? (ಉದಾ: ಬೆಂಗಳೂರು ಅಥವಾ ಮೈಸೂರು)`;
    } else {
      reply = DialectAdapter.getDialectGreeting(dialect.detectedDialect);
    }

    this.memory.addTurn('assistant', reply);

    return {
      replyTextKannada: reply,
      dialectDetected: dialect,
      updatedContext: currentCtx,
      suggestedAction: currentCtx.destinations.length > 0 ? 'update_itinerary' : 'ask_clarification',
      confidenceScore: parsed.confidence,
    };
  }

  private handleCorrection(text: string): { reply: string } | null {
    // E.g. "ಹಂಪಿ ಅಲ್ಲ, ಬಾದಾಮಿ"
    const match = text.match(/([^\s,]+)\s*(?:ಅಲ್ಲ|all[a|i]|beda)[,\s]+([^\s,]+)/i);
    if (match) {
      const removedPlace = match[1].trim();
      const addedPlace = match[2].trim();

      const resolvedAdd = EntityResolver.resolvePlace(addedPlace);
      if (resolvedAdd) {
        // Remove old and add new
        this.memory.getContext().destinations.forEach((d) => {
          if (d.nameKannada.includes(removedPlace) || removedPlace.includes(d.nameKannada)) {
            this.memory.removeDestination(d.id);
          }
        });
        this.memory.addDestination({
          id: resolvedAdd.id,
          nameKannada: resolvedAdd.nameKannada,
          nameEnglish: resolvedAdd.nameEnglish,
        });

        return {
          reply: `ಸರಿ, ನಿಮ್ಮ ಇಷ್ಟದಂತೆ ತಾಣವನ್ನು ಬದಲಾಯಿಸಲಾಗಿದೆ: ${resolvedAdd.nameKannada} ಸೇರಿಸಲಾಗಿದೆ.`,
        };
      }
    }

    return null;
  }
}
