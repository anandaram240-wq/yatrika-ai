/**
 * Speech Service: Client-side Browser Web Speech API Wrapper
 * 
 * LINGUISTIC HONESTY NOTICE:
 * Pitch and rate controls available in browser speech synthesis alter playback speed and audio frequency.
 * They DO NOT generate an authentic regional dialect, accent, or native phonetic articulation.
 * All audio generated here is explicitly classified as "Synthetic Browser Speech" (ಕೃತಕ ಧ್ವನಿ).
 */

export interface SpeechDiagnostics {
  isSupported: boolean;
  hasKannadaVoice: boolean;
  activeVoiceName: string | null;
  activeVoiceLang: string | null;
  isUsingFallback: boolean;
}

export interface SpeakOptions {
  kannadaText: string;
  transliteration?: string;
  syntheticPitch?: number;
  syntheticRate?: number;
  onStart?: (diagnostics: SpeechDiagnostics) => void;
  onEnd?: () => void;
  onError?: (errorMessage: string) => void;
}

class SpeechService {
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    this.isInitialized = true;
  }

  public getDiagnostics(): SpeechDiagnostics {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return {
        isSupported: false,
        hasKannadaVoice: false,
        activeVoiceName: null,
        activeVoiceLang: null,
        isUsingFallback: false,
      };
    }

    if (!this.isInitialized || this.voices.length === 0) {
      this.initVoices();
    }

    const kannadaVoice = this.voices.find(v => 
      v.lang.toLowerCase().includes('kn') || 
      v.name.toLowerCase().includes('kannada')
    );

    const indianVoice = this.voices.find(v => 
      v.lang.toLowerCase().includes('en-in') || 
      v.lang.toLowerCase().includes('hi-in')
    );

    const activeVoice = kannadaVoice || indianVoice || this.voices[0] || null;

    return {
      isSupported: true,
      hasKannadaVoice: Boolean(kannadaVoice),
      activeVoiceName: activeVoice ? activeVoice.name : null,
      activeVoiceLang: activeVoice ? activeVoice.lang : null,
      isUsingFallback: !kannadaVoice,
    };
  }

  public speak(options: SpeakOptions): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options.onError) {
        options.onError('Web Speech API is not supported in this browser environment.');
      }
      return false;
    }

    // Cancel any active audio playback
    window.speechSynthesis.cancel();

    if (!this.isInitialized || this.voices.length === 0) {
      this.initVoices();
    }

    const diagnostics = this.getDiagnostics();

    // Prefer native kn-IN voice
    const kannadaVoice = this.voices.find(v => 
      v.lang.toLowerCase().includes('kn') || 
      v.name.toLowerCase().includes('kannada')
    );

    const indianVoice = this.voices.find(v => 
      v.lang.toLowerCase().includes('en-in') || 
      v.lang.toLowerCase().includes('hi-in')
    );

    let textToSpeak = options.kannadaText;
    let voiceToUse = kannadaVoice;

    // Honest fallback: if client device lacks Kannada TTS voice, fall back to phonetic transliteration
    if (!kannadaVoice) {
      textToSpeak = options.transliteration || options.kannadaText;
      voiceToUse = indianVoice || this.voices[0] || undefined;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }
      
      utterance.rate = options.syntheticRate ?? 0.95;
      utterance.pitch = options.syntheticPitch ?? 1.0;

      utterance.onstart = () => {
        if (options.onStart) options.onStart(diagnostics);
      };

      utterance.onend = () => {
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = (e) => {
        if (options.onEnd) options.onEnd();
        if (options.onError) {
          options.onError(e.error ? `Speech synthesis error: ${e.error}` : 'Speech synthesis interrupted');
        }
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err: any) {
      if (options.onEnd) options.onEnd();
      if (options.onError) {
        options.onError(err?.message || 'Speech execution failed');
      }
      return false;
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();
