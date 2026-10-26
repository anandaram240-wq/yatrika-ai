/**
 * Speech Service: Client-side Browser Web Speech API Wrapper
 * 
 * LINGUISTIC HONESTY NOTICE:
 * All audio generated here is explicitly classified as:
 * "Synthetic Standard kn-IN Script Readout — Not a Native Regional Recording" (ಕೃತಕ ಪ್ರಮಾಣಿತ ಕನ್ನಡ ಧ್ವನಿ).
 * Pitch and rate controls are standardized (pitch: 1.0, rate: 0.95) to prevent deceptive accent simulation.
 */

export interface SpeechDiagnostics {
  isSupported: boolean;
  hasKannadaVoice: boolean;
  activeVoiceName: string | null;
  activeVoiceLang: string | null;
  isUsingFallback: boolean;
  notice: string;
}

export interface SpeakOptions {
  kannadaText: string;
  transliteration?: string;
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
        notice: 'Web Speech API is not supported in this browser.',
      };
    }

    if (!this.isInitialized || this.voices.length === 0) {
      this.initVoices();
    }

    const kannadaVoice = this.voices.find(v => 
      v.lang.toLowerCase().startsWith('kn') || 
      v.name.toLowerCase().includes('kannada')
    );

    return {
      isSupported: true,
      hasKannadaVoice: Boolean(kannadaVoice),
      activeVoiceName: kannadaVoice ? kannadaVoice.name : null,
      activeVoiceLang: kannadaVoice ? kannadaVoice.lang : null,
      isUsingFallback: !Boolean(kannadaVoice),
      notice: kannadaVoice 
        ? 'Using Standard Kannada (kn-IN) synthetic OS voice'
        : 'Standard Kannada TTS voice (kn-IN) is not installed on your current browser/OS.',
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

    // Check for kn-IN voice
    const kannadaVoice = this.voices.find(v => 
      v.lang.toLowerCase().startsWith('kn') || 
      v.name.toLowerCase().includes('kannada')
    );

    if (!kannadaVoice) {
      const msg = 'Standard Kannada TTS voice (kn-IN) is not installed on your current browser/OS. Synthetic readout requires a kn-IN system voice.';
      if (options.onError) {
        options.onError(msg);
      }
      return false;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(options.kannadaText);
      utterance.voice = kannadaVoice;
      utterance.lang = 'kn-IN';
      utterance.pitch = 1.0;
      utterance.rate = 0.95;

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
