export interface SpeakOptions {
  kannadaText: string;
  transliteration: string;
  pitch?: number;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
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

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.isInitialized) this.initVoices();
    return this.voices;
  }

  public speak(options: SpeakOptions): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options.onError) options.onError('Speech synthesis not supported in this browser.');
      return false;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    if (!this.isInitialized || this.voices.length === 0) {
      this.initVoices();
    }

    // Attempt to locate a Kannada voice (kn-IN)
    const kannadaVoice = this.voices.find(v => 
      v.lang.toLowerCase().includes('kn') || 
      v.lang.toLowerCase().includes('kannada') ||
      v.name.toLowerCase().includes('kannada')
    );

    // Fallback Indian voice if kn is not present
    const indianVoice = this.voices.find(v => 
      v.lang.toLowerCase().includes('en-in') || 
      v.lang.toLowerCase().includes('hi-in')
    );

    let textToSpeak = options.kannadaText;
    let voiceToUse = kannadaVoice;

    // If no Kannada voice exists on this OS/browser, pronounce the transliterated English text
    if (!kannadaVoice) {
      textToSpeak = options.transliteration;
      voiceToUse = indianVoice || this.voices[0];
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }
      
      utterance.rate = options.rate ?? 0.95;
      utterance.pitch = options.pitch ?? 1.0;

      utterance.onstart = () => {
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = (e) => {
        if (options.onEnd) options.onEnd();
        if (options.onError) options.onError(e);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      if (options.onEnd) options.onEnd();
      if (options.onError) options.onError(err);
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
