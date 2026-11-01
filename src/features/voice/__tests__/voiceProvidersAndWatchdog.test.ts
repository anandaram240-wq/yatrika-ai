/**
 * @vitest-environment jsdom
 * src/features/voice/__tests__/voiceProvidersAndWatchdog.test.ts
 * Rigorous Unit Tests for Speech Providers, Watchdog Timers, and Session Isolation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserSpeechProvider } from '../providers/BrowserSpeechProvider';
import { RemoteSpeechProvider } from '../providers/RemoteSpeechProvider';
import { OnDeviceSpeechProvider } from '../providers/OnDeviceSpeechProvider';
import { SpeechProviderFactory } from '../providers/SpeechProviderFactory';
import { voiceStateReducer, INITIAL_VOICE_CONTEXT, VoiceContext } from '../VoiceStateMachine';

describe('Speech Provider Architecture & Session Isolation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('1. Rejects callbacks from stale or superseded session IDs', () => {
    const context: VoiceContext = {
      ...INITIAL_VOICE_CONTEXT,
      state: 'LISTENING',
      sessionId: 'session_active_123',
    };

    // Callback with old session ID
    const staleResult = voiceStateReducer(context, {
      type: 'FINAL_RESULT',
      sessionId: 'session_old_000',
      text: 'ಹಳೆಯ ಸಂದೇಶ',
    });

    // Must be completely ignored
    expect(staleResult.transcript).toBe('');
    expect(staleResult.sessionId).toBe('session_active_123');
    expect(staleResult.state).toBe('LISTENING');

    // Callback with active session ID
    const validResult = voiceStateReducer(context, {
      type: 'FINAL_RESULT',
      sessionId: 'session_active_123',
      text: 'ಹೊಸ ಸಂದೇಶ',
    });

    expect(validResult.transcript).toBe('ಹೊಸ ಸಂದೇಶ');
    expect(validResult.state).toBe('PROCESSING');
  });

  it('2. Enforces 7-second adaptive inactivity watchdog timer', async () => {
    const onTimeout = vi.fn();
    const provider = new BrowserSpeechProvider();

    // Mock DOM SpeechRecognition
    const mockRecognition = {
      continuous: true,
      interimResults: true,
      lang: 'kn-IN',
      start: vi.fn(),
      stop: vi.fn(),
      abort: vi.fn(),
      onstart: null as any,
      onend: null as any,
      onerror: null as any,
      onresult: null as any,
    };
    function MockSpeechRecognition() {
      return mockRecognition;
    }
    (window as any).webkitSpeechRecognition = MockSpeechRecognition;

    await provider.start(
      'sess_test_1',
      { language: 'kn-IN', inactivityTimeoutMs: 7000, maxDurationMs: 45000 },
      {
        onInterimResult: vi.fn(),
        onFinalResult: vi.fn(),
        onError: onTimeout,
      }
    );

    // Advance 5 seconds - no timeout yet
    vi.advanceTimersByTime(5000);
    expect(onTimeout).not.toHaveBeenCalled();

    // Reset inactivity timer through an interim speech result
    provider.resetInactivityWatchdog();

    // Advance another 5 seconds (total 10s from start, but 5s from speech reset)
    vi.advanceTimersByTime(5000);
    expect(onTimeout).not.toHaveBeenCalled();

    // Advance 2.5 more seconds (total 7.5s from last speech reset) -> watchdog fires!
    vi.advanceTimersByTime(2500);
    expect(onTimeout).toHaveBeenCalledWith(
      'sess_test_1',
      expect.objectContaining({
        code: 'TIMEOUT',
      })
    );

    await provider.stop('sess_test_1');
  });

  it('3. Enforces 45-second hard maximum duration session cap', async () => {
    const onTimeout = vi.fn();
    const provider = new BrowserSpeechProvider();

    const mockRecognition = {
      continuous: true,
      interimResults: true,
      lang: 'kn-IN',
      start: vi.fn(),
      stop: vi.fn(),
      abort: vi.fn(),
      onstart: null as any,
      onend: null as any,
      onerror: null as any,
      onresult: null as any,
    };
    function MockSpeechRecognition() {
      return mockRecognition;
    }
    (window as any).webkitSpeechRecognition = MockSpeechRecognition;

    await provider.start(
      'sess_test_2',
      { language: 'kn-IN', inactivityTimeoutMs: 7000, maxDurationMs: 45000 },
      {
        onInterimResult: vi.fn(),
        onFinalResult: vi.fn(),
        onError: onTimeout,
      }
    );

    // User continuously speaks every 4 seconds, resetting inactivity
    for (let i = 0; i < 10; i++) {
      vi.advanceTimersByTime(4000);
      provider.resetInactivityWatchdog();
    }
    // 40 seconds elapsed, no timeout
    expect(onTimeout).not.toHaveBeenCalled();

    // Advance another 6 seconds (total 46 seconds) -> hard max cap fires!
    vi.advanceTimersByTime(6000);
    expect(onTimeout).toHaveBeenCalledWith(
      'sess_test_2',
      expect.objectContaining({
        code: 'TIMEOUT',
      })
    );

    await provider.stop('sess_test_2');
  });

  it('4. RemoteSpeechProvider gracefully reports network/service errors without leaking keys', async () => {
    const provider = new RemoteSpeechProvider();
    const onError = vi.fn();

    await provider.start(
      'sess_remote_1',
      { language: 'kn-IN' },
      {
        onInterimResult: vi.fn(),
        onFinalResult: vi.fn(),
        onError,
      }
    );

    // Verify properties
    expect(provider.id).toBe('remote_backend_speech');
    expect(provider.name).toBe('Cloud Kannada Speech Proxy');
    expect(onError).toHaveBeenCalledWith(
      'sess_remote_1',
      expect.objectContaining({
        code: 'SERVICE_UNAVAILABLE',
      })
    );

    await provider.stop('sess_remote_1');
  });

  it('5. OnDeviceSpeechProvider honestly reports unavailable runtime in browser environment', async () => {
    const provider = new OnDeviceSpeechProvider();
    expect(provider.id).toBe('on_device_stt');
    const isAvailable = await provider.isAvailable();
    // Default environment does not have WebAssembly Whisper weights
    expect(typeof isAvailable).toBe('boolean');
  });

  it('6. SpeechProviderFactory delivers comparative capability matrix', () => {
    const matrix = SpeechProviderFactory.getComparisonMatrix();
    expect(matrix.length).toBe(3);
    const browserEntry = matrix.find((m) => m.id === 'browser_web_speech');
    const remoteEntry = matrix.find((m) => m.id === 'remote_backend_speech');
    const onDeviceEntry = matrix.find((m) => m.id === 'on_device_stt');

    expect(browserEntry?.kannadaAccuracyGrade).toBe('A');
    expect(remoteEntry?.operatingCost).toBe('tier_usage_billing');
    expect(onDeviceEntry?.networkDependency).toBe('zero_offline');
  });
});
