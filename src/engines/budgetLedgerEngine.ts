// src/engines/budgetLedgerEngine.ts
import {
  BudgetAndClassConfig,
  BudgetLineItem,
  HonestBudgetSummary,
  TravellerGroupConfig,
} from '../types/journeySchema';

export const SELECTABLE_BUDGET_TIERS = [
  { id: 'economy', label: 'Economy (₹1,000 – ₹3,000 / person)', minInr: 1000, maxInr: 3000, defaultInr: 2500 },
  { id: 'standard', label: 'Standard (₹3,000 – ₹5,000 / person)', minInr: 3000, maxInr: 5000, defaultInr: 4500 },
  { id: 'comfort', label: 'Comfort (₹5,000 – ₹10,000 / person)', minInr: 5000, maxInr: 10000, defaultInr: 7500 },
  { id: 'premium', label: 'Premium (₹10,000 – ₹20,000 / person)', minInr: 10000, maxInr: 20000, defaultInr: 15000 },
  { id: 'business_luxury', label: 'Business / Luxury (₹20,000+ / person)', minInr: 20000, maxInr: 100000, defaultInr: 25000 },
] as const;

export function calculateHonestBudget(
  group: TravellerGroupConfig,
  config: BudgetAndClassConfig,
  lineItems: BudgetLineItem[]
): HonestBudgetSummary {
  const totalTravellers = Math.max(1, group.adults + group.children + group.seniors);

  const budgetTargetGroupInr =
    config.budgetMode === 'TOTAL_GROUP'
      ? config.customBudgetInr
      : config.customBudgetInr * totalTravellers;

  const budgetTargetPerPersonInr = Math.round(budgetTargetGroupInr / totalTravellers);

  let confirmedAndPublishedGroupInr = 0;
  let estimatedGroupInr = 0;
  const unavailableItemLabels: string[] = [];

  for (const item of lineItems) {
    if (item.status === 'UNAVAILABLE') {
      unavailableItemLabels.push(item.label);
      continue;
    }
    if (item.status === 'NOT_INCLUDED') {
      continue;
    }
    const groupVal = item.amountGroupTotalInr ?? (item.amountPerPersonInr ? item.amountPerPersonInr * totalTravellers : 0);
    if (item.status === 'CONFIRMED' || item.status === 'PUBLISHED_RATE' || item.status === 'PROVIDER_QUOTE') {
      confirmedAndPublishedGroupInr += groupVal;
    } else if (item.status === 'ESTIMATED') {
      estimatedGroupInr += groupVal;
    }
  }

  const knownCumulativeGroup = confirmedAndPublishedGroupInr + estimatedGroupInr;
  const hasUnavailableCoreItems = unavailableItemLabels.length > 0;

  let budgetComparisonStatus: HonestBudgetSummary['budgetComparisonStatus'] = 'WITHIN_KNOWN_COSTS';
  if (knownCumulativeGroup > budgetTargetGroupInr) {
    budgetComparisonStatus = 'EXCEEDS_BUDGET';
  } else if (hasUnavailableCoreItems) {
    budgetComparisonStatus = 'INCOMPLETE_DUE_TO_UNAVAILABLE_RATES';
  }

  return {
    lineItems,
    confirmedAndPublishedGroupInr,
    estimatedGroupInr,
    confirmedAndPublishedPerPersonInr: Math.round(confirmedAndPublishedGroupInr / totalTravellers),
    estimatedPerPersonInr: Math.round(estimatedGroupInr / totalTravellers),
    hasUnavailableCoreItems,
    unavailableItemLabels,
    budgetTargetGroupInr,
    budgetTargetPerPersonInr,
    budgetComparisonStatus,
  };
}
