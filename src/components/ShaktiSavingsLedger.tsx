
export type ShaktiLeg = {
  id: string;
  description: string;
  /** Must be verified by the fare / eligibility adapter for this passenger and leg. */
  eligibility: "verified-eligible" | "not-eligible" | "unverified";
  baseFareInr: number;
  farePaidInr: number;
  serviceLabel?: string;
};

export type CarbonComparison = {
  privateTripKgCo2e: number;
  selectedTripKgCo2e: number;
  methodologyLabel: string;
};

export type ShaktiSavingsLedgerProps = {
  legs: ShaktiLeg[];
  carbonComparison?: CarbonComparison;
  currencyLabel?: string;
};

const money = (value: number, currencyLabel: string) =>
  `${currencyLabel}${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function isValidNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

/**
 * Calculates savings only for verified-eligible legs and only from the
 * supplied base fare and actual fare paid. Eligibility rules are intentionally
 * outside this UI component and must be supplied by a maintained rule source.
 */
export function ShaktiSavingsLedger({
  legs,
  carbonComparison,
  currencyLabel = "₹",
}: ShaktiSavingsLedgerProps) {
  const validLegs = legs.filter((leg) =>
    isValidNonNegative(leg.baseFareInr) && isValidNonNegative(leg.farePaidInr),
  );
  const verifiedSavings = validLegs
    .filter((leg) => leg.eligibility === "verified-eligible")
    .reduce((sum, leg) => sum + Math.max(0, leg.baseFareInr - leg.farePaidInr), 0);
  const pendingCount = legs.filter((leg) => leg.eligibility === "unverified").length;

  const carbonValuesValid = carbonComparison &&
    isValidNonNegative(carbonComparison.privateTripKgCo2e) &&
    isValidNonNegative(carbonComparison.selectedTripKgCo2e);
  const co2eSaved = carbonValuesValid
    ? carbonComparison.privateTripKgCo2e - carbonComparison.selectedTripKgCo2e
    : undefined;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Shakti fare savings ledger">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">NammaSanchara · Shakti ledger</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Verified fare savings</h2>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">Leg-by-leg audit</span>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-600">Total verified savings</p>
        <p className="mt-1 text-3xl font-bold tabular-nums text-slate-950">{money(verifiedSavings, currencyLabel)}</p>
        {pendingCount > 0 && <p className="mt-2 text-xs text-amber-800">{pendingCount} leg(s) are excluded until eligibility is verified.</p>}
      </div>

      <div className="mt-4 space-y-2">
        {legs.map((leg) => {
          const valid = isValidNonNegative(leg.baseFareInr) && isValidNonNegative(leg.farePaidInr);
          const saved = valid && leg.eligibility === "verified-eligible"
            ? Math.max(0, leg.baseFareInr - leg.farePaidInr)
            : undefined;
          const stateLabel = leg.eligibility === "verified-eligible" ? "Verified eligible" :
            leg.eligibility === "not-eligible" ? "Not covered" : "Pending verification";
          return (
            <div key={leg.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-2 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900">{leg.description}</p>
                <p className="text-xs text-slate-500">{leg.serviceLabel ? `${leg.serviceLabel} · ` : ""}{stateLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums text-slate-900">{saved === undefined ? "Not counted" : money(saved, currencyLabel)}</p>
                {valid && <p className="text-xs text-slate-500">Base {money(leg.baseFareInr, currencyLabel)} · Paid {money(leg.farePaidInr, currencyLabel)}</p>}
              </div>
            </div>
          );
        })}
        {legs.length === 0 && <p className="text-sm text-slate-500">No transit legs have been added.</p>}
      </div>

      {carbonComparison && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">Green mobility estimate</p>
          {carbonValuesValid ? (
            <>
              <p className="mt-1 text-xl font-bold tabular-nums text-emerald-950">
                {co2eSaved! >= 0 ? `${co2eSaved!.toFixed(2)} kg CO₂e estimated reduction` : `${Math.abs(co2eSaved!).toFixed(2)} kg CO₂e estimated increase`}
              </p>
              <p className="mt-1 text-xs text-emerald-900">{carbonComparison.methodologyLabel}</p>
            </>
          ) : <p className="mt-1 text-sm text-emerald-950">Carbon comparison values are invalid, so no estimate is displayed.</p>}
        </div>
      )}
      <p className="mt-3 text-xs text-slate-500">Savings are calculated only from supplied, verified eligibility and actual fare data. Unverified legs are not counted.</p>
    </section>
  );
}
