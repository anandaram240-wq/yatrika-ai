/**
 * src/features/voice/VoiceErrorHandler.ts
 * Standardized, human-readable error handler for Voice Interactions.
 * Provides idiomatic Kannada and English guidance with actionable fallbacks.
 */

import { VoiceErrorDetails } from './VoiceStateMachine';

export class VoiceErrorHandler {
  public static mapSpeechError(domError: string | any): VoiceErrorDetails {
    const errorString = typeof domError === 'string' ? domError : domError?.error || '';

    switch (errorString) {
      case 'not-allowed':
      case 'permission-denied':
        return {
          code: 'PERMISSION_DENIED',
          messageKannada: 'ಮೈಕ್ರೋಫೋನ್ ಬಳಸಲು ಅನುಮತಿ ನೀಡಿ ಅಥವಾ ಪಠ್ಯವನ್ನು ನಮೂದಿಸಿ.',
          messageEnglish: 'Please allow microphone access or type your travel query.',
          technicalDetails: errorString,
          retryable: true,
        };

      case 'no-speech':
        return {
          code: 'NO_SPEECH_DETECTED',
          messageKannada: 'ನಿಮ್ಮ ಧ್ವನಿ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ. ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.',
          messageEnglish: 'No speech was detected. Please try speaking again.',
          technicalDetails: errorString,
          retryable: true,
        };

      case 'network':
        return {
          code: 'NETWORK_FAILURE',
          messageKannada: 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಈಗ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಬಹುದು.',
          messageEnglish: 'Voice recognition network service unavailable. You can type in Kannada.',
          technicalDetails: errorString,
          retryable: true,
        };

      case 'audio-capture':
        return {
          code: 'MICROPHONE_UNAVAILABLE',
          messageKannada: 'ಮೈಕ್ರೋಫೋನ್ ಸಾಧನ ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಸಂಪರ್ಕ ಕಡಿತಗೊಂಡಿದೆ.',
          messageEnglish: 'Microphone hardware is unavailable or not connected.',
          technicalDetails: errorString,
          retryable: true,
        };

      case 'service-not-allowed':
        return {
          code: 'SERVICE_UNAVAILABLE',
          messageKannada: 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಸೇವೆ ಈ ಸಾಧನದಲ್ಲಿ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ.',
          messageEnglish: 'Speech service is restricted on this browser or platform.',
          technicalDetails: errorString,
          retryable: false,
        };

      case 'aborted':
        return {
          code: 'ABORTED',
          messageKannada: 'ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ.',
          messageEnglish: 'Voice recording was cancelled.',
          technicalDetails: errorString,
          retryable: true,
        };

      default:
        return {
          code: 'UNCLEAR_TRANSCRIPT',
          messageKannada: 'ಧ್ವನಿಯನ್ನು ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯದಲ್ಲಿ ನಮೂದಿಸಿ.',
          messageEnglish: `Could not process voice input (${errorString || 'unknown error'}). Please type instead.`,
          technicalDetails: errorString,
          retryable: true,
        };
    }
  }

  public static getUnsupportedBrowserError(): VoiceErrorDetails {
    return {
      code: 'UNSUPPORTED_BROWSER',
      messageKannada: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕ್ರೋಮ್ ಅಥವಾ ಸಫಾರಿ ಬಳಸಿ.',
      messageEnglish: 'Voice recognition is not supported in this browser. Please use Chrome or Safari.',
      retryable: false,
    };
  }

  public static getTimeoutError(): VoiceErrorDetails {
    return {
      code: 'TIMEOUT',
      messageKannada: 'ರೆಕಾರ್ಡಿಂಗ್ ಸಮಯ ಮೀರಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ.',
      messageEnglish: 'Listening session timed out. Please tap to speak again.',
      retryable: true,
    };
  }

  public static getEmptyTranscriptError(): VoiceErrorDetails {
    return {
      code: 'EMPTY_TRANSCRIPT',
      messageKannada: 'ಯಾವುದೇ ಧ್ವನಿ ಪಠ್ಯ ದಾಖಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ.',
      messageEnglish: 'No transcript was captured. Please speak clearly.',
      retryable: true,
    };
  }
}
