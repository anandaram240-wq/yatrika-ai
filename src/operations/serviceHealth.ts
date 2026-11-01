/**
 * @file src/operations/serviceHealth.ts
 * @description Service health monitoring, circuit breaker, and heartbeat engine for YatriKa AI V4.
 * @theme Code. Create. Celebrate Kannada.
 */

export type ServiceIdentifier =
  | 'weather_api'
  | 'road_conditions'
  | 'routing_engine'
  | 'transit_schedules'
  | 'poi_registry'
  | 'kannada_nlp'
  | 'offline_storage';

export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'CIRCUIT_OPEN';

export interface ServiceHealthSnapshot {
  serviceId: ServiceIdentifier;
  serviceName: string;
  status: HealthStatus;
  consecutiveFailures: number;
  lastSuccessfulPing?: string;
  lastFailurePing?: string;
  lastLatencyMs?: number;
  circuitBreakerOpen: boolean;
  activeProvider: string;
  fallbackAvailable: boolean;
}

export class ServiceHealthMonitor {
  private healthMap = new Map<ServiceIdentifier, ServiceHealthSnapshot>();
  private readonly failureThreshold = 3;
  private readonly recoveryThreshold = 2;
  private consecutiveSuccesses = new Map<ServiceIdentifier, number>();

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    const services: Array<{ id: ServiceIdentifier; name: string; fallback: boolean; provider: string }> = [
      { id: 'weather_api', name: 'Open-Meteo European Weather Ensemble', fallback: true, provider: 'src-open-meteo' },
      { id: 'road_conditions', name: 'Karnataka PWD & NHAI Road Status', fallback: true, provider: 'src-karnataka-pwd' },
      { id: 'routing_engine', name: 'OSRM Karnataka Road Network', fallback: true, provider: 'osrm-car-engine' },
      { id: 'transit_schedules', name: 'KSRTC & SWR Timetable Index', fallback: true, provider: 'src-ksrtc-official' },
      { id: 'poi_registry', name: 'Karnataka 678 Destination Unified Registry', fallback: true, provider: 'internal-verified-poi-db' },
      { id: 'kannada_nlp', name: 'NammaVani Vibhakti Morphological Parser', fallback: true, provider: 'internal-dravidian-regex-fst' },
      { id: 'offline_storage', name: 'Browser IndexedDB / LocalStorage Cache', fallback: true, provider: 'in-memory-storage' },
    ];

    services.forEach((s) => {
      this.healthMap.set(s.id, {
        serviceId: s.id,
        serviceName: s.name,
        status: 'HEALTHY',
        consecutiveFailures: 0,
        lastSuccessfulPing: new Date().toISOString(),
        circuitBreakerOpen: false,
        activeProvider: s.provider,
        fallbackAvailable: s.fallback,
      });
      this.consecutiveSuccesses.set(s.id, 0);
    });
  }

  public recordSuccess(serviceId: ServiceIdentifier, latencyMs: number) {
    const record = this.healthMap.get(serviceId);
    if (!record) return;

    record.consecutiveFailures = 0;
    record.lastSuccessfulPing = new Date().toISOString();
    record.lastLatencyMs = latencyMs;

    const successes = (this.consecutiveSuccesses.get(serviceId) ?? 0) + 1;
    this.consecutiveSuccesses.set(serviceId, successes);

    if (record.circuitBreakerOpen && successes >= this.recoveryThreshold) {
      record.circuitBreakerOpen = false;
      record.status = 'HEALTHY';
    } else if (!record.circuitBreakerOpen) {
      record.status = latencyMs > 1500 ? 'DEGRADED' : 'HEALTHY';
    }
  }

  public recordFailure(serviceId: ServiceIdentifier, errorDetails?: string) {
    const record = this.healthMap.get(serviceId);
    if (!record) return;

    record.consecutiveFailures += 1;
    record.lastFailurePing = new Date().toISOString();
    this.consecutiveSuccesses.set(serviceId, 0);

    if (record.consecutiveFailures >= this.failureThreshold) {
      record.circuitBreakerOpen = true;
      record.status = 'CIRCUIT_OPEN';
    } else {
      record.status = 'DEGRADED';
    }

    if (errorDetails) {
      // Diagnostic tracking
    }
  }

  public getSnapshot(serviceId: ServiceIdentifier): ServiceHealthSnapshot | undefined {
    return this.healthMap.get(serviceId);
  }

  public getAllSnapshots(): ServiceHealthSnapshot[] {
    return Array.from(this.healthMap.values());
  }

  public isCircuitOpen(serviceId: ServiceIdentifier): boolean {
    return this.healthMap.get(serviceId)?.circuitBreakerOpen ?? false;
  }
}
