import { describe, expect, it } from 'vitest';
import { DemoScenarioEngine } from '../demo/demoScenarioEngine';
import { DemoResetController } from '../demo/demoResetController';
import { DEMO_SCENARIOS } from '../demo/demoDataRegistry';

describe('Phase 11: Jury-Ready Demonstration System (Scenarios A - E)', () => {
  it('1. Executes Scenario A (Kannada Speech-to-Plan) within 150ms', async () => {
    const res = await DemoScenarioEngine.runScenarioA();
    expect(res.success).toBe(true);
    expect(res.executionDurationMs).toBeLessThan(150);
    expect(res.logs.length).toBeGreaterThanOrEqual(4);
  });

  it('2. Executes Scenario B (Ghat Hazard & Detour Confirmation)', () => {
    const res = DemoScenarioEngine.runScenarioB();
    expect(res.success).toBe(true);
    expect(res.outputSummary).toContain('Sampaje Ghat');
    expect(res.definition.isSimulatedDemoData).toBe(true); // Transparently marked as simulated
  });

  it('3. Executes Scenario C (Smart Scheduling & Darshan Windows)', () => {
    const res = DemoScenarioEngine.runScenarioC();
    expect(res.success).toBe(true);
    expect(res.outputSummary).toContain('12:30 PM - 4:00 PM');
  });

  it('4. Executes Scenario D (Multimodal Transit & Shakti Scheme Audit)', () => {
    const res = DemoScenarioEngine.runScenarioD();
    expect(res.success).toBe(true);
    expect(res.outputSummary).toContain('Shakti Scheme ₹0 audit');
  });

  it('5. Executes Scenario E (Offline Resilience & Privacy SOS)', () => {
    const res = DemoScenarioEngine.runScenarioE();
    expect(res.success).toBe(true);
    expect(res.outputSummary).toContain('zero sensitive data leakage');
  });

  it('6. Executes one-click demo reset controller reliably', () => {
    const reset = DemoResetController.resetCompleteDemoEnvironment();
    expect(reset.success).toBe(true);
    expect(reset.resetTimestamp).toBeDefined();
  });

  it('7. Asserts all demo definitions clearly identify simulation vs live data', () => {
    const scenarios = Object.values(DEMO_SCENARIOS);
    expect(scenarios.length).toBe(6);
    scenarios.forEach((s) => {
      expect(s.scenarioId).toBeDefined();
      expect(s.simulationNote).toBeDefined();
      expect(typeof s.isSimulatedDemoData).toBe('boolean');
    });
  });

  it('8. Executes The Golden User Journey (Bengaluru -> Hassan -> Belur -> Chikkamagaluru -> Mullayanagiri)', () => {
    const golden = DemoScenarioEngine.runScenarioGolden();
    expect(golden.success).toBe(true);
    expect(golden.scenarioId).toBe('SCENARIO_GOLDEN');
    expect(golden.outputSummary).toContain('Golden Journey validated');
    expect(golden.logs.some((l) => l.includes('Shettihalli'))).toBe(true);
    expect(golden.logs.some((l) => l.includes('Belur Chennakeshava'))).toBe(true);
    expect(golden.logs.some((l) => l.includes('Mullayanagiri'))).toBe(true);
  });
});
