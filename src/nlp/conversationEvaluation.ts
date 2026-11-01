/**
 * @file src/nlp/conversationEvaluation.ts
 * @description Conversation quality evaluator, multi-turn context retention, and user correction learning.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface ConversationTurn {
  turnNumber: number;
  userUtterance: string;
  agentResponse: string;
  extractedOrigin?: string;
  extractedDestination?: string;
  isCorrection: boolean;
}

export class ConversationEvaluationEngine {
  /**
   * Evaluates if a follow-up turn was an explicit user correction (e.g. "ಅಲ್ಲ, ಮೈಸೂರು ಅಲ್ಲ, ಹಾಸನದಿಂದ").
   */
  public static isUserCorrection(utterance: string): boolean {
    const text = utterance.toLowerCase();
    const correctionMarkers = ['ಅಲ್ಲ', 'ತಪ್ಪು', 'ಬದಲಿಗೆ', 'ನೋ ಅಲ್ಲ', 'not', 'instead', 'correction'];
    return correctionMarkers.some((m) => text.includes(m));
  }

  /**
   * Applies user correction to previous state while preserving unmodified entities.
   */
  public static applyCorrection(
    previousState: { origin: string; destination: string; stops: string[] },
    correctionUtterance: string
  ): { updatedOrigin: string; updatedDestination: string; correctionApplied: boolean; fieldCorrected: string } {
    const text = correctionUtterance.toLowerCase();
    let updatedOrigin = previousState.origin;
    let updatedDestination = previousState.destination;
    let fieldCorrected = 'none';

    // Check for origin correction keywords
    if (text.includes('ಹಾಸನ') || text.includes('hassan')) {
      updatedOrigin = 'Hassan';
      fieldCorrected = 'origin';
    } else if (text.includes('ಬೆಂಗಳೂರು') || text.includes('bengaluru')) {
      updatedOrigin = 'Bengaluru';
      fieldCorrected = 'origin';
    }

    // Check for destination correction keywords
    if (text.includes('ಹಂಪಿ') || text.includes('hampi')) {
      updatedDestination = 'Hampi';
      fieldCorrected = 'destination';
    } else if (text.includes('ಶೃಂಗೇರಿ') || text.includes('sringeri')) {
      updatedDestination = 'Sringeri';
      fieldCorrected = 'destination';
    }

    return {
      updatedOrigin,
      updatedDestination,
      correctionApplied: fieldCorrected !== 'none',
      fieldCorrected,
    };
  }
}
