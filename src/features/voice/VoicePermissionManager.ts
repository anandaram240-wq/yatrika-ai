/**
 * src/features/voice/VoicePermissionManager.ts
 * Safe permission detection and status tracker for Microphone hardware.
 * Never requests permission prematurely on page load.
 */

export type MicPermissionState = 'granted' | 'prompt' | 'denied' | 'unsupported';

export class VoicePermissionManager {
  public static async checkPermission(): Promise<MicPermissionState> {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return 'unsupported';
    }

    // Check if Permissions API is available
    if ('permissions' in navigator && navigator.permissions?.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        return status.state as MicPermissionState;
      } catch {
        // Many browsers throw TypeError on 'microphone' permission name
        return 'prompt';
      }
    }

    // Default to 'prompt' if API is unsupported, letting the user trigger the prompt on click
    return 'prompt';
  }

  public static isSpeechSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }
}
