/**
 * @file src/demo/demoResetController.ts
 * @description One-click deterministic reset controller for jury presentations.
 * @theme Code. Create. Celebrate Kannada.
 */

export class DemoResetController {
  /**
   * Resets all cached demo keys, local storage entries, and in-memory states.
   */
  public static resetCompleteDemoEnvironment(): {
    success: boolean;
    clearedKeysCount: number;
    resetTimestamp: string;
  } {
    let count = 0;

    if (typeof localStorage !== 'undefined') {
      const keysToClear: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('yatrika_') || k.includes('trip-'))) {
          keysToClear.push(k);
        }
      }
      keysToClear.forEach((k) => {
        localStorage.removeItem(k);
        count++;
      });
    }

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }

    return {
      success: true,
      clearedKeysCount: count,
      resetTimestamp: new Date().toISOString(),
    };
  }
}
