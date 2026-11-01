/**
 * @file src/operations/operationsCenter.ts
 * @description Centralized Live Operations Center for YatriKa AI V4.
 * Unifies service health, freshness monitoring, incident tracking, and fault recovery.
 * @theme Code. Create. Celebrate Kannada.
 */

import { ServiceHealthMonitor, ServiceHealthSnapshot, ServiceIdentifier } from './serviceHealth';
import { DataFreshnessMonitor, FreshnessReport } from './dataFreshnessMonitor';
import { IncidentManager, IncidentRecord, IncidentSeverity } from './incidentManager';
import { RecoveryCoordinator } from './recoveryCoordinator';

export interface OperationsCenterOverview {
  overallStatus: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  services: ServiceHealthSnapshot[];
  freshness: FreshnessReport[];
  activeIncidents: IncidentRecord[];
  operationalWarningsCount: number;
  physicalHazardsCount: number;
  lastHeartbeat: string;
}

export class YatrikaOperationsCenter {
  private static instance: YatrikaOperationsCenter | null = null;

  public readonly healthMonitor: ServiceHealthMonitor;
  public readonly freshnessMonitor: DataFreshnessMonitor;
  public readonly incidentManager: IncidentManager;
  public readonly recoveryCoordinator: RecoveryCoordinator;

  private constructor() {
    this.healthMonitor = new ServiceHealthMonitor();
    this.freshnessMonitor = new DataFreshnessMonitor();
    this.incidentManager = new IncidentManager();
    this.recoveryCoordinator = new RecoveryCoordinator(this.healthMonitor);
  }

  public static getInstance(): YatrikaOperationsCenter {
    if (!YatrikaOperationsCenter.instance) {
      YatrikaOperationsCenter.instance = new YatrikaOperationsCenter();
    }
    return YatrikaOperationsCenter.instance;
  }

  public getOverview(): OperationsCenterOverview {
    const services = this.healthMonitor.getAllSnapshots();
    const freshness = this.freshnessMonitor.checkAll();
    const activeIncidents = this.incidentManager.getActiveIncidents();

    const hasCircuitOpen = services.some((s) => s.circuitBreakerOpen);
    const hasCriticalIncidents = activeIncidents.some((i) => i.severity === 'CRITICAL');
    const hasDegraded = services.some((s) => s.status === 'DEGRADED') || freshness.some((f) => f.isStale);

    let overallStatus: OperationsCenterOverview['overallStatus'] = 'OPTIMAL';
    if (hasCircuitOpen || hasCriticalIncidents) {
      overallStatus = 'CRITICAL';
    } else if (hasDegraded) {
      overallStatus = 'DEGRADED';
    }

    return {
      overallStatus,
      services,
      freshness,
      activeIncidents,
      operationalWarningsCount: this.incidentManager.getOperationalWarnings().length,
      physicalHazardsCount: this.incidentManager.getPhysicalTravelHazards().length,
      lastHeartbeat: new Date().toISOString(),
    };
  }

  public reportOperationalWarning(serviceId: ServiceIdentifier, title: string, details: string) {
    return this.incidentManager.createIncident({
      severity: 'WARNING',
      domain: 'OPERATIONAL_SOFTWARE',
      serviceId,
      title,
      titleKannada: `ಕಾರ್ಯಾಚರಣೆ ಎಚ್ಚರಿಕೆ: ${title}`,
      description: details,
      sourceAuthority: 'YatriKa AI Telemetry Engine',
      mitigationApplied: 'Switched to validated cached data snapshot',
    });
  }

  public reportPhysicalRoadHazard(title: string, titleKannada: string, description: string, sourceAuthority: string, severity: IncidentSeverity = 'WARNING') {
    return this.incidentManager.createIncident({
      severity,
      domain: 'PHYSICAL_TRAVEL_HAZARD',
      title,
      titleKannada,
      description,
      sourceAuthority,
    });
  }
}
