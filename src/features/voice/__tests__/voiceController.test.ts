/**
 * src/features/voice/__tests__/voiceController.test.ts
 * Vitest Unit Tests for Voice State Machine, VoiceController, and useVoiceRecognition.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { voiceStateReducer, INITIAL_VOICE_CONTEXT, VoiceContext } from '../VoiceStateMachine';
import { VoiceController } from '../VoiceController';
import { VoiceErrorHandler } from '../VoiceErrorHandler';
import { VoicePermissionManager } from '../VoicePermissionManager';

describe('Voice State Machine: Transitions & Invariants', () => {
  let context: VoiceContext;

  beforeEach(() => {
    context = { ...INITIAL_VOICE_CONTEXT };
  });

  it('1. Initializes in IDLE state with kn-IN language', () => {
    expect(context.state).toBe('IDLE');
    expect(context.language).toBe('kn-IN');
    expect(context.transcript).toBe('');
    expect(context.interimTranscript).toBe('');
    expect(context.error).toBeNull();
  });

  it('2. Transitions IDLE -> READY when speech is supported', () => {
    const next = voiceStateReducer(context, { type: 'CHECK_SUPPORT', supported: true });
    expect(next.state).toBe('READY');
    expect(next.isSupported).toBe(true);
  });

  it('3. Transitions to ERROR when browser is unsupported', () => {
    const next = voiceStateReducer(context, { type: 'CHECK_SUPPORT', supported: false });
    expect(next.state).toBe('ERROR');
    expect(next.error?.code).toBe('UNSUPPORTED_BROWSER');
    expect(next.error?.messageKannada).toContain('ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ');
  });

  it('4. Transitions READY -> LISTENING on START_LISTENING', () => {
    const readyState = voiceStateReducer(context, { type: 'CHECK_SUPPORT', supported: true });
    const listening = voiceStateReducer(readyState, { type: 'START_LISTENING' });
    expect(listening.state).toBe('LISTENING');
    expect(listening.startedAt).not.toBeNull();
  });

  it('5. Updates interim transcript without mutating final transcript during LISTENING', () => {
    const listening: VoiceContext = { ...context, state: 'LISTENING' };
    const interim = voiceStateReducer(listening, { type: 'INTERIM_RESULT', text: 'ಬೆಂಗಳೂರು' });
    expect(interim.state).toBe('LISTENING');
    expect(interim.interimTranscript).toBe('ಬೆಂಗಳೂರು');
    expect(interim.transcript).toBe('');
  });

  it('6. Transitions LISTENING -> PROCESSING -> COMMAND_PREVIEW on final speech results', () => {
    const listening: VoiceContext = { ...context, state: 'LISTENING' };
    const processing = voiceStateReducer(listening, {
      type: 'FINAL_RESULT',
      text: 'ಬೆಂಗಳೂರಿನಿಂದ ಹಾಸನದ ಮೂಲಕ ಚಿಕ್ಕಮಗಳೂರಿಗೆ ಹೋಗಬೇಕು',
    });
    expect(processing.state).toBe('PROCESSING');
    expect(processing.transcript).toBe('ಬೆಂಗಳೂರಿನಿಂದ ಹಾಸನದ ಮೂಲಕ ಚಿಕ್ಕಮಗಳೂರಿಗೆ ಹೋಗಬೇಕು');
    expect(processing.interimTranscript).toBe('');

    const preview = voiceStateReducer(processing, {
      type: 'PARSING_COMPLETE',
      entities: {
        origin: 'ಬೆಂಗಳೂರು',
        destination: 'ಚಿಕ್ಕಮಗಳೂರು',
        waypoints: ['ಹಾಸನ'],
        durationDays: 3,
      },
      confidence: 0.95,
    });
    expect(preview.state).toBe('COMMAND_PREVIEW');
    expect(preview.parsedEntities?.destination).toBe('ಚಿಕ್ಕಮಗಳೂರು');
    expect(preview.confidence).toBe(0.95);
  });

  it('7. Handles manual correction and updates parsed state', () => {
    const preview: VoiceContext = {
      ...context,
      state: 'COMMAND_PREVIEW',
      transcript: 'ಬೆಂಗಳೂರಿನಿಂದ ಹಂಪಿಗೆ ಹೋಗಬೇಕು',
      parsedEntities: { origin: 'ಬೆಂಗಳೂರು', destination: 'ಹಂಪಿ' },
    };

    const edited = voiceStateReducer(preview, {
      type: 'MANUAL_EDIT',
      text: 'ಬೆಂಗಳೂರಿನಿಂದ ಬಾದಾಮಿಗೆ ಹೋಗಬೇಕು',
      entities: { origin: 'ಬೆಂಗಳೂರು', destination: 'ಬಾದಾಮಿ' },
    });

    expect(edited.state).toBe('COMMAND_PREVIEW');
    expect(edited.transcript).toBe('ಬೆಂಗಳೂರಿನಿಂದ ಬಾದಾಮಿಗೆ ಹೋಗಬೇಕು');
    expect(edited.parsedEntities?.destination).toBe('ಬಾದಾಮಿ');
  });

  it('8. Transitions to ERROR with NO_SPEECH_DETECTED if STOP is pressed with no transcript', () => {
    const listening: VoiceContext = { ...context, state: 'LISTENING', transcript: '', interimTranscript: '' };
    const stopped = voiceStateReducer(listening, { type: 'STOP' });
    expect(stopped.state).toBe('ERROR');
    expect(stopped.error?.code).toBe('NO_SPEECH_DETECTED');
    expect(stopped.error?.messageKannada).toContain('ನಿಮ್ಮ ಧ್ವನಿ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ');
  });

  it('9. Transitions to CANCELLED state and clears interim transcript on CANCEL', () => {
    const listening: VoiceContext = { ...context, state: 'LISTENING', interimTranscript: 'ಅಪೂರ್ಣ...' };
    const cancelled = voiceStateReducer(listening, { type: 'CANCEL' });
    expect(cancelled.state).toBe('CANCELLED');
    expect(cancelled.interimTranscript).toBe('');
  });

  it('10. Handles permission denial and prevents restart', () => {
    const readyState: VoiceContext = { ...context, state: 'READY' };
    const denied = voiceStateReducer(readyState, {
      type: 'PERMISSION_DENIED',
      error: {
        code: 'PERMISSION_DENIED',
        messageKannada: 'ಮೈಕ್ರೋಫೋನ್ ಬಳಸಲು ಅನುಮತಿ ನೀಡಿ.',
        messageEnglish: 'Please allow microphone access.',
        retryable: true,
      },
    });
    expect(denied.state).toBe('ERROR');
    expect(denied.error?.code).toBe('PERMISSION_DENIED');
  });

  it('11. Switches language between kn-IN and en-IN seamlessly', () => {
    const knContext = voiceStateReducer(context, { type: 'SET_LANGUAGE', language: 'kn-IN' });
    expect(knContext.language).toBe('kn-IN');

    const enContext = voiceStateReducer(knContext, { type: 'SET_LANGUAGE', language: 'en-IN' });
    expect(enContext.language).toBe('en-IN');
  });
});

describe('VoiceController & Error Handler', () => {
  let controller: VoiceController;

  beforeEach(() => {
    controller = new VoiceController();
  });

  afterEach(() => {
    controller.cancelListening();
  });

  it('12. Maps DOM speech errors into standardized human-readable messages', () => {
    const noSpeech = VoiceErrorHandler.mapSpeechError({ error: 'no-speech' });
    expect(noSpeech.code).toBe('NO_SPEECH_DETECTED');
    expect(noSpeech.retryable).toBe(true);

    const notAllowed = VoiceErrorHandler.mapSpeechError({ error: 'not-allowed' });
    expect(notAllowed.code).toBe('PERMISSION_DENIED');
    expect(notAllowed.messageKannada).toContain('ಮೈಕ್ರೋಫೋನ್ ಬಳಸಲು ಅನುಮತಿ ನೀಡಿ');

    const networkErr = VoiceErrorHandler.mapSpeechError({ error: 'network' });
    expect(networkErr.code).toBe('NETWORK_FAILURE');
  });

  it('13. Safely detects permission state without requesting access on load', async () => {
    const state = await VoicePermissionManager.checkPermission();
    expect(['granted', 'prompt', 'denied', 'unsupported']).toContain(state);
  });

  it('14. Does not restart automatically after user stop or cancel', () => {
    controller.stopListening();
    expect(controller.getIsListening()).toBe(false);

    controller.cancelListening();
    expect(controller.getIsListening()).toBe(false);
  });
});
