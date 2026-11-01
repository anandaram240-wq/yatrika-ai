/**
 * src/features/voice/providers/OnDeviceSpeechProvider.ts
 * Experimental On-Device WebAssembly Speech Engine.
 * Provides private, client-side offline transcription when WASM/WebGPU models are cached.
 */

import {
  ISpeechProvider,
  SpeechProviderConfig,
  SpeechProviderCallbacks,
} from './SpeechProvider';

export class OnDeviceSpeechProvider implements ISpeechProvider {
  public readonly id = 'on_device_stt';
  public readonly name = 'On-Device WebAssembly STT';

  private activeSessionId: string | null = null;
  private isWasmLoaded = false;

  public get isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).WebAssembly && (window as any).navigator?.gpu);
  }

  public async isReady(): Promise<boolean> {
    return this.isWasmLoaded;
  }

  public async isAvailable(): Promise<boolean> {
    return this.isReady();
  }

  public async start(
    sessionId: string,
    _config: SpeechProviderConfig,
    callbacks: SpeechProviderCallbacks
  ): Promise<boolean> {
    if (!this.isWasmLoaded) {
      callbacks.onError?.(sessionId, {
        code: 'SERVICE_UNAVAILABLE',
        messageKannada: 'ಆನ್‌ಲೈನ್‌-ರಹಿತ ಸ್ಥಳೀಯ ಧ್ವನಿ ಮಾದರಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿಲ್ಲ. ಬ್ರೌಸರ್ ಧ್ವನಿ ಬಳಸಿ.',
        messageEnglish: 'On-device model weights are not loaded. Falling back to browser speech.',
        technicalDetails: 'WASM_MODEL_NOT_CACHED',
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
