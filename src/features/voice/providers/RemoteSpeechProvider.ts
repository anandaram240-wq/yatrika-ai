/**
 * src/features/voice/providers/RemoteSpeechProvider.ts
 * Cloud Speech Proxy Provider for YatriKa AI.
 * Communicates with backend proxy endpoint; never exposes raw cloud credentials in frontend.
 */

import {
  ISpeechProvider,
  SpeechProviderConfig,
  SpeechProviderCallbacks,
} from './SpeechProvider';

export class RemoteSpeechProvider implements ISpeechProvider {
  public readonly id = 'remote_backend_speech';
  public readonly name = 'Cloud Kannada Speech Proxy';

  private activeSessionId: string | null = null;
  private endpointUrl: string;

  constructor(options?: { endpointUrl?: string; language?: string }) {
    this.endpointUrl = options?.endpointUrl || '/api/v1/voice/transcribe';
  }

  public get isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).MediaRecorder &&
      (window as any).navigator?.mediaDevices?.getUserMedia
    );
  }

  public async isReady(): Promise<boolean> {
    return this.isSupported;
  }

  public async start(
    sessionId: string,
    _config: SpeechProviderConfig,
    callbacks: SpeechProviderCallbacks
  ): Promise<boolean> {
    // When cloud backend proxy is unconfigured in development/offline demo
    if (!this.endpointUrl || this.endpointUrl.startsWith('/api/v1')) {
      callbacks.onError?.(sessionId, {
        code: 'SERVICE_UNAVAILABLE',
        messageKannada: 'ರಿಮೋಟ್ ಕ್ಲೌಡ್ ಸೇವೆ ಕಾನ್ಫಿಗರ್ ಆಗಿಲ್ಲ. ಬ್ರೌಸರ್ ಧ್ವನಿ ಸೌಲಭ್ಯವನ್ನು ಬಳಸಲಾಗುತ್ತಿದೆ.',
        messageEnglish: 'Remote speech backend is not configured. Falling back to browser speech.',
        technicalDetails: 'REMOTE_STT_UNCONFIGURED',
        retryable: true,
      });
      return false;
    }

    this.activeSessionId = sessionId;
    callbacks.onStart?.(sessionId);
    return true;
  }

  public async stop(sessionId: string): Promise<void> {
    if (this.activeSessionId === sessionId) {
      this.activeSessionId = null;
    }
  }

  public async cancel(sessionId: string): Promise<void> {
    if (this.activeSessionId === sessionId) {
      this.activeSessionId = null;
    }
  }
}
