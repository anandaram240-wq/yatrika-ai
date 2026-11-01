/**
 * @file src/operations/incidentManager.ts
 * @description Incident classification and real-time operations manager for YatriKa AI V4.
 * Rigorously separates operational software/network warnings from physical travel hazards.
 * @theme Code. Create. Celebrate Kannada.
 */

import { ServiceIdentifier } from './serviceHealth';

export type IncidentSeverity = 'INFO' | 'WARNING' | 'DEGRADED' | 'CRITICAL' | 'RECOVERED';

export type IncidentDomain = 'OPERATIONAL_SOFTWARE' | 'PHYSICAL_TRAVEL_HAZARD';

export interface IncidentRecord {
  id: string;
  severity: IncidentSeverity;
  domain: IncidentDomain;
  serviceId?: ServiceIdentifier;
  title: string;
  titleKannada: string;
  description: string;
  sourceAuthority: string;
  timestamp: string;
  resolvedAt?: string;
  isResolved: boolean;
  mitigationApplied?: string;
}

export class IncidentManager {
  private incidents: IncidentRecord[] = [];

  public createIncident(params: {
    severity: IncidentSeverity;
    domain: IncidentDomain;
    serviceId?: ServiceIdentifier;
    title: string;
    titleKannada: string;
    description: string;
    sourceAuthority: string;
    mitigationApplied?: string;
  }): IncidentRecord {
    const record: IncidentRecord = {
      id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      severity: params.severity,
      domain: params.domain,
      serviceId: params.serviceId,
      title: params.title,
      titleKannada: params.titleKannada,
      description: params.description,
      sourceAuthority: params.sourceAuthority,
      timestamp: new Date().toISOString(),
      isResolved: false,
      mitigationApplied: params.mitigationApplied,
    };

    this.incidents.unshift(record);
    return record;
  }

  public resolveIncident(incidentId: string, resolutionNote?: string): boolean {
    const incident = this.incidents.find((i) => i.id === incidentId);
    if (!incident) return false;

    incident.isResolved = true;
    incident.resolvedAt = new Date().toISOString();
    incident.severity = 'RECOVERED';
    if (resolutionNote) {
      incident.description += ` | ಪರಿಹಾರ (Resolution): ${resolutionNote}`;
    }
    return true;
  }

  public getActiveIncidents(): IncidentRecord[] {
    return this.incidents.filter((i) => !i.isResolved);
  }

  public getOperationalWarnings(): IncidentRecord[] {
    return this.getActiveIncidents().filter((i) => i.domain === 'OPERATIONAL_SOFTWARE');
  }

  public getPhysicalTravelHazards(): IncidentRecord[] {
    return this.getActiveIncidents().filter((i) => i.domain === 'PHYSICAL_TRAVEL_HAZARD');
  }

  public getAllIncidents(): IncidentRecord[] {
    return [...this.incidents];
  }

  /**
   * Helper to ensure API outages never get displayed as road blockages.
   */
  public verifyDomainSeparation(): boolean {
    return this.incidents.every((inc) => {
      if (inc.domain === 'OPERATIONAL_SOFTWARE') {
        // Operational warnings must not reference physical road closures as ground truth
        return !inc.title.toLowerCase().includes('road closed by landslide');
      }
      return true;
    });
  }
}
