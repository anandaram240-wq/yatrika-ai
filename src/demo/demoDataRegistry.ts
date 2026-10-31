/**
 * @file src/demo/demoDataRegistry.ts
 * @description Jury-Ready demonstration scenarios and transparently labeled demo datasets.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface DemoScenarioDefinition {
  scenarioId: 'SCENARIO_A' | 'SCENARIO_B' | 'SCENARIO_C' | 'SCENARIO_D' | 'SCENARIO_E';
  title: string;
  titleKannada: string;
  themeFocus: string;
  inputDescription: string;
  expectedOutcome: string;
  isSimulatedDemoData: boolean;
  simulationNote: string;
}

export const DEMO_SCENARIOS: Record<string, DemoScenarioDefinition> = {
  SCENARIO_A: {
    scenarioId: 'SCENARIO_A',
    title: 'Kannada Natural Speech-to-Plan',
    titleKannada: 'ಕನ್ನಡ ಧ್ವನಿ ಪ್ರಯಾಣ ಯೋಜನೆ',
    themeFocus: 'NammaVani Multi-Turn NLP & Vibhakti Case Transducer',
    inputDescription: 'Utterance: "ಬೆಂಗಳೂರಿನಿಂದ ಚಿಕ್ಕಮಗಳೂರಿಗೆ ಹೋಗಿ ಮುಳ್ಳಯ್ಯನಗಿರಿ ನೋಡಬೇಕು"',
    expectedOutcome: 'Parses origin (SBC), destination (Chikkamagaluru), adds Mullayanagiri, and creates 2-day corridor plan in <100ms.',
    isSimulatedDemoData: false,
    simulationNote: 'Runs live deterministic grammatical parsing against verified 678 destination registry.',
  },
  SCENARIO_B: {
    scenarioId: 'SCENARIO_B',
    title: 'Western Ghats Monsoon Hazard & Detour',
    titleKannada: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಮಳೆ ಹಾಗೂ ಬದಲಿ ಮಾರ್ಗ',
    themeFocus: 'Ghat-Shield & Topographic Speed Heuristic',
    inputDescription: 'Live feed reports 22 mm/h rain + rockfall on NH-75 Shiradi Ghat.',
    expectedOutcome: 'Flags high hazard, preserves original route until traveler confirms detour via Sampaje NH-275 (+45m).',
    isSimulatedDemoData: true,
    simulationNote: 'Simulated PWD rockfall bulletin used to demonstrate hazard trip without real-world catastrophe.',
  },
  SCENARIO_C: {
    scenarioId: 'SCENARIO_C',
    title: 'Smart Scheduling & Darshan Windows',
    titleKannada: 'ದೇವಸ್ಥಾನ ದರ್ಶನ ಸಮಯ ಹಾಗೂ ವೇಳಾಪಟ್ಟಿ',
    themeFocus: 'Time-Window Solver & Feasibility Engine',
    inputDescription: 'Hassan -> Belur -> Halebidu -> Shravanabelagola full circuit.',
    expectedOutcome: 'Schedules visits to avoid 12:30 PM - 4:00 PM sanctum doors closure, ensuring all darshans are open.',
    isSimulatedDemoData: false,
    simulationNote: 'Timings derived directly from official ASI and Muzrai temple schedules.',
  },
  SCENARIO_D: {
    scenarioId: 'SCENARIO_D',
    title: 'Multimodal Transit & Statutory Shakti Audit',
    titleKannada: 'ಬಹುಮಾದರಿ ಸಾರಿಗೆ ಹಾಗೂ ಶಕ್ತಿ ಯೋಜನೆ ₹0 ಲೆಕ್ಕಪತ್ರ',
    themeFocus: 'NammaSanchara & GoK TRD 34 MDA 2023 Order Verification',
    inputDescription: 'SWR Vande Bharat (SBC -> MYS) connecting to KSRTC Karnataka Sarige.',
    expectedOutcome: 'Calculates 15 min pedestrian subway transfer at SBC, ₹0 fare audit for female passenger on Sarige, and CO2 offset.',
    isSimulatedDemoData: false,
    simulationNote: 'Schedules and rules verified against KSRTC gazette and SWR timetables.',
  },
  SCENARIO_E: {
    scenarioId: 'SCENARIO_E',
    title: 'Zero-Connectivity GhatOffline Mode',
    titleKannada: 'ನೆಟ್‌ವರ್ಕ್ ರಹಿತ ಘಾಟಿ ಆಫ್‌ಲೈನ್ ಹಾಗೂ ತುರ್ತು ಸಹಾಯ',
    themeFocus: 'Privacy-Safe Emergency SOS & Offline Cache Persistence',
    inputDescription: 'Network disconnect at Kudremukha National Park ridge.',
    expectedOutcome: 'Instant offline packet recovery, 112/108/1077/1926 statutory directory, zero data leakage in SOS QR.',
    isSimulatedDemoData: false,
    simulationNote: 'Demonstrates offline persistence via local storage snapshots.',
  },
};
