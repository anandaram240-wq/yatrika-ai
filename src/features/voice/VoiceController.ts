/**
 * src/features/voice/VoiceController.ts
 * Master Controller managing Web Speech Recognition lifecycle and audio events.
 * Enforces strict teardown, watchdog timeouts, and zero unauthorized restarts.
 */

import { VoiceErrorHandler } from './VoiceErrorHandler';
import { VoiceErrorDetails, VoiceLanguage } from './VoiceStateMachine';

export interface VoiceControllerEvents {
  onStart?: () => void;
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (transcript: string) => void;
  onError?: (error: VoiceErrorDetails) => void;
  onEnd?: () => void;
}

export class VoiceController {
  private recognition: any | null = null;
  private isListening = false;
  private userInitiatedStop = false;
  private timeoutWatchdog: ReturnType<typeof setTimeout> | null = null;
  private activeLanguage: VoiceLanguage = 'kn-IN';

  /**
   * Returns true if SpeechRecognition or webkitSpeechRecognition exists
   */
  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Sets recognition language ('kn-IN' or 'en-IN')
   */
  public setLanguage(lang: VoiceLanguage): void {
    this.activeLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public getLanguage(): VoiceLanguage {
    return this.activeLanguage;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Starts listening session with safety checks and watchdog timer
   */
  public startListening(events: VoiceControllerEvents, timeoutMs = 12000): boolean {
    if (!this.isSupported()) {
      events.onError?.(VoiceErrorHandler.getUnsupportedBrowserError());
      return false;
    }

    // Teardown any dangling instance
    if (this.isListening) {
      this.cancelListening();
    }

    this.userInitiatedStop = false;

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      this.recognition = new SpeechRecognitionClass();
      this.recognition.lang = this.activeLanguage;
      this.recognition.continuous = false; // Single utterance mode prevents endless looping
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      // Watchdog timeout to prevent frozen listening states
      this.clearWatchdog();
      this.timeoutWatchdog = setTimeout(() => {
        if (this.isListening) {
          this.stopListening();
          events.onError?.(VoiceErrorHandler.getTimeoutError());
        }
      }, timeoutMs);

      this.recognition.onstart = () => {
        this.isListening = true;
        events.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalText += item[0].transcript;
          } else {
            interimText += item[0].transcript;
          }
        }

        if (interimText && !finalText) {
          events.onInterimResult?.(interimText.trim());
        }

        if (finalText) {
          this.clearWatchdog();
          events.onFinalResult?.(finalText.trim());
        }
      };

      this.recognition.onerror = (domError: any) => {
        this.clearWatchdog();
        this.isListening = false;
        if (!this.userInitiatedStop) {
          events.onError?.(VoiceErrorHandler.mapSpeechError(domError));
        }
      };

      this.recognition.onend = () => {
        this.clearWatchdog();
        this.isListening = false;
        events.onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.clearWatchdog();
      this.isListening = false;
      events.onError?.(VoiceErrorHandler.mapSpeechError(err));
      return false;
    }
  }

  /**
   * Gracefully stops recording and collects final result
   */
  public stopListening(): void {
    this.userInitiatedStop = true;
    this.clearWatchdog();
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Safe catch if already stopped
      }
    }
    this.isListening = false;
  }

  /**
   * Aborts and cancels recognition immediately without triggering results
   */
  public cancelListening(): void {
    this.userInitiatedStop = true;
    this.clearWatchdog();
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // Safe catch if already aborted
      }
    }
    this.isListening = false;
  }

  /**
   * Speaks Kannada or English text using Web Speech Synthesis API
   */
  public speakText(text: string, lang: VoiceLanguage = 'kn-IN', onComplete?: () => void): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onComplete?.();
      return false;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95; // Slightly slower for crisp Kannada pronunciation
      utterance.pitch = 1.0;

      utterance.onend = () => onComplete?.();
      utterance.onerror = () => onComplete?.();

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      onComplete?.();
      return false;
    }
  }

  private clearWatchdog(): void {
    if (this.timeoutWatchdog) {
      clearTimeout(this.timeoutWatchdog);
      this.timeoutWatchdog = null;
    }
  }
}

// Export singleton instance for app-wide coordination
export const voiceControllerInstance = new VoiceController();
