/**
 * src/features/voice/providers/SpeechProviderFactory.ts
 * Factory and comparative evaluation matrix for speech providers.
 */

import { ISpeechProvider } from './SpeechProvider';
import { BrowserSpeechProvider } from './BrowserSpeechProvider';
import { RemoteSpeechProvider } from './RemoteSpeechProvider';
import { OnDeviceSpeechProvider } from './OnDeviceSpeechProvider';

export interface ProviderCapabilityMetrics {
  id: string;
  name: string;
  kannadaAccuracyGrade: 'A+' | 'A' | 'B+' | 'B';
  estimatedLatencyMs: number;
  networkDependency: 'online_required' | 'hybrid' | 'zero_offline';
  privacyLevel: 'local_device_private' | 'browser_vendor_cloud' | 'custom_proxy_private';
  operatingCost: 'zero_free' | 'tier_usage_billing';
  supportedDevices: string[];
}

export const SPEECH_PROVIDER_COMPARISON: ProviderCapabilityMetrics[] = [
  {
    id: 'browser_web_speech',
    name: 'Browser Web Speech API (Default)',
    kannadaAccuracyGrade: 'A',
    estimatedLatencyMs: 350,
    networkDependency: 'online_required',
    privacyLevel: 'browser_vendor_cloud',
    operatingCost: 'zero_free',
    supportedDevices: ['Chrome (Desktop/Android)', 'Safari (iOS/macOS)', 'Edge'],
  },
  {
    id: 'remote_backend_speech',
    name: 'Remote Cloud Speech-to-Text Proxy',
    kannadaAccuracyGrade: 'A+',
    estimatedLatencyMs: 650,
    networkDependency: 'online_required',
    privacyLevel: 'custom_proxy_private',
    operatingCost: 'tier_usage_billing',
    supportedDevices: ['All modern browsers with MediaRecorder'],
  },
  {
    id: 'on_device_stt',
    name: 'On-Device WebAssembly STT (Experimental)',
    kannadaAccuracyGrade: 'B+',
    estimatedLatencyMs: 850,
    networkDependency: 'zero_offline',
    privacyLevel: 'local_device_private',
    operatingCost: 'zero_free',
    supportedDevices: ['High-memory desktop browsers with WebGPU'],
  },
];

export class SpeechProviderFactory {
  private static defaultProvider: ISpeechProvider = new BrowserSpeechProvider();

  public static getProvider(preference?: 'browser' | 'remote' | 'on_device'): ISpeechProvider {
    switch (preference) {
      case 'remote':
        return new RemoteSpeechProvider();
      case 'on_device':
        return new OnDeviceSpeechProvider();
      case 'browser':
      default:
        return this.defaultProvider;
    }
  }

  public static getComparisonMatrix(): ProviderCapabilityMetrics[] {
    return SPEECH_PROVIDER_COMPARISON;
  }
}
