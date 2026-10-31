/**
 * @file src/nlp/contextMemory.ts
 * @description Multi-turn contextual travel dialog memory for YatriKa AI.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface DialogTurn {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intentDetected?: string;
  entitiesExtracted?: Record<string, unknown>;
}

export interface ConversationalTripContext {
  origin?: { id: string; nameKannada: string; nameEnglish: string };
  destinations: Array<{ id: string; nameKannada: string; nameEnglish: string }>;
  viaStops: Array<{ id: string; nameKannada: string; nameEnglish: string }>;
  durationDays?: number;
  budgetInr?: number;
  isFemalePassenger?: boolean;
  travelSeason?: string;
  specialInterests: string[]; // 'heritage' | 'waterfalls' | 'trek' | 'coffee' | 'food'
  turns: DialogTurn[];
  pendingConfirmation?: {
    type: 'ambiguous_place' | 'detour_acceptance' | 'schedule_adjustment';
    prompt: string;
    candidates: string[];
  };
}

export class ContextMemory {
  private context: ConversationalTripContext;

  constructor() {
    this.context = {
      destinations: [],
      viaStops: [],
      specialInterests: [],
      turns: [],
    };
  }

  public getContext(): ConversationalTripContext {
    return { ...this.context };
  }

  public addTurn(sender: 'user' | 'assistant', text: string, metadata?: { intent?: string; entities?: Record<string, unknown> }) {
    this.context.turns.push({
      id: `turn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender,
      text,
      timestamp: new Date().toISOString(),
      ...(metadata?.intent ? { intentDetected: metadata.intent } : {}),
      ...(metadata?.entities ? { entitiesExtracted: metadata.entities } : {}),
    });
  }

  public setOrigin(origin: { id: string; nameKannada: string; nameEnglish: string }) {
    this.context.origin = origin;
  }

  public addDestination(dest: { id: string; nameKannada: string; nameEnglish: string }) {
    if (!this.context.destinations.some((d) => d.id === dest.id)) {
      this.context.destinations.push(dest);
    }
  }

  public removeDestination(destId: string) {
    this.context.destinations = this.context.destinations.filter((d) => d.id !== destId);
  }

  public addViaStop(stop: { id: string; nameKannada: string; nameEnglish: string }) {
    if (!this.context.viaStops.some((v) => v.id === stop.id)) {
      this.context.viaStops.push(stop);
    }
  }

  public updateBudget(budget: number) {
    this.context.budgetInr = budget;
  }

  public updateDuration(days: number) {
    this.context.durationDays = days;
  }

  public setFemalePassenger(value: boolean) {
    this.context.isFemalePassenger = value;
  }

  public addSpecialInterest(interest: string) {
    if (!this.context.specialInterests.includes(interest)) {
      this.context.specialInterests.push(interest);
    }
  }

  public setPendingConfirmation(confirmation: ConversationalTripContext['pendingConfirmation']) {
    this.context.pendingConfirmation = confirmation;
  }

  public clearPendingConfirmation() {
    this.context.pendingConfirmation = undefined;
  }

  public reset() {
    this.context = {
      destinations: [],
      viaStops: [],
      specialInterests: [],
      turns: [],
    };
  }
}
