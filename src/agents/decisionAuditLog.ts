/**
 * @file src/agents/decisionAuditLog.ts
 * @description Decision audit log, human approval gate, and snapshot rollback manager for autonomous travel replanning.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface AutonomousDecisionRecord {
  decisionId: string;
  timestamp: string;
  triggerEvent: string;
  sourceOfInterruption: string;
  affectedSegment: string;
  reasonCode: string;
  explanationKannada: string;
  explanationEnglish: string;
  alternativesEvaluated: Array<{
    optionId: string;
    description: string;
    durationDeltaMinutes: number;
    costDeltaInr: number;
    feasibilityScore: number;
  }>;
  recommendedOptionId: string;
  humanApprovalRequired: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ROLLED_BACK';
  approvedAt?: string;
  previousItinerarySnapshot: unknown;
}

export class DecisionAuditManager {
  private auditLog: AutonomousDecisionRecord[] = [];

  public logDecision(decision: AutonomousDecisionRecord): void {
    this.auditLog.unshift(decision);
  }

  public getDecision(decisionId: string): AutonomousDecisionRecord | undefined {
    return this.auditLog.find((d) => d.decisionId === decisionId);
  }

  public approveDecision(decisionId: string): boolean {
    const record = this.getDecision(decisionId);
    if (!record) return false;
    record.approvalStatus = 'APPROVED';
    record.approvedAt = new Date().toISOString();
    return true;
  }

  public rejectDecision(decisionId: string): boolean {
    const record = this.getDecision(decisionId);
    if (!record) return false;
    record.approvalStatus = 'REJECTED';
    return true;
  }

  public rollbackDecision(decisionId: string): { success: boolean; restoredSnapshot?: unknown } {
    const record = this.getDecision(decisionId);
    if (!record || !record.previousItinerarySnapshot) {
      return { success: false };
    }
    record.approvalStatus = 'ROLLED_BACK';
    return {
      success: true,
      restoredSnapshot: record.previousItinerarySnapshot,
    };
  }

  public getAllDecisions(): AutonomousDecisionRecord[] {
    return [...this.auditLog];
  }
}
