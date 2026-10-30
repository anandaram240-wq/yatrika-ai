/**
 * src/features/voice-agent/adapters/speechRecognitionAdapter.ts
 * Browser-native Web Speech API speech-to-text and text-to-speech adapter
 * with graceful degradation and error handling.
 */

export interface SpeechAdapterEvents {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
}

// Window type augmentation for WebKit Speech Recognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export class BrowserSpeechAdapter {
  private recognitionInstance: any | null = null;
  private isListening = false;
  private isSupported = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.isSupported = true;
      }
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public startListening(events: SpeechAdapterEvents, language: 'kn-IN' | 'en-IN' = 'kn-IN'): boolean {
    if (!this.isSupported) {
      events.onError?.('Speech recognition is not supported in this browser. Please type your query.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognitionInstance = new SpeechRecognition();
      this.recognitionInstance.lang = language;
      this.recognitionInstance.continuous = false;
      this.recognitionInstance.interimResults = true;
      this.recognitionInstance.maxAlternatives = 1;

      this.recognitionInstance.onstart = () => {
        this.isListening = true;
        events.onStart?.();
      };

      this.recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        events.onResult?.(currentTranscript, !!finalTranscript);
      };

      this.recognitionInstance.onerror = (err: any) => {
        this.isListening = false;
        const msg = err.error === 'not-allowed'
          ? 'Microphone permission was denied. Please allow microphone access.'
          : err.error === 'no-speech'
          ? 'No speech detected. Please speak into your microphone.'
          : `Speech error: ${err.error || 'unknown'}`;
        events.onError?.(msg);
      };

      this.recognitionInstance.onend = () => {
        this.isListening = false;
        events.onEnd?.();
      };

      this.recognitionInstance.start();
      return true;
    } catch (e: any) {
      this.isListening = false;
      events.onError?.(e.message || 'Failed to initialize speech recognition.');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognitionInstance && this.isListening) {
      try {
        this.recognitionInstance.stop();
      } catch {
        // Safe ignore
      }
      this.isListening = false;
    }
  }

  public speakKannada(text: string, onEndCallback?: () => void): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'kn-IN';
    utterance.rate = 0.95; // Slightly slower for crisp clarity

    // Select Kannada voice if available
    const voices = window.speechSynthesis.getVoices();
    const kannadaVoice = voices.find((v) => v.lang.startsWith('kn') || v.name.toLowerCase().includes('kannada'));
    if (kannadaVoice) {
      utterance.voice = kannadaVoice;
    }

    if (onEndCallback) {
      utterance.onend = onEndCallback;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export const speechAdapterInstance = new BrowserSpeechAdapter();
