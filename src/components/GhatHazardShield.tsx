
export type GhatHazardLevel = "unknown" | "normal" | "watch" | "high" | "closed";

export type GhatHazardShieldProps = {
  corridorName: string;
  /** Assessment produced by a trusted road-authority / operator data adapter. */
  level: GhatHazardLevel;
  assessmentLabel?: string;
  sourceName?: string;
  assessedAt?: string;
  precipitationMmPerHour?: number;
  windKmh?: number;
  visibilityKm?: number;
  issueSummary?: string;
  /** Only show a detour after the upstream service has verified it. */
  verifiedAlternative?: {
    label: string;
    etaDifferenceMinutes?: number;
    distanceKm?: number;
    sourceName: string;
    verifiedAt: string;
  };
};

const LEVEL_COPY: Record<GhatHazardLevel, { title: string; description: string }> = {
  unknown: { title: "Risk status unavailable", description: "No current verified road-risk assessment is available. Check local authorities before departure." },
  normal: { title: "No active alert reported", description: "The connected source has not reported an active restriction. Conditions can change quickly." },
  watch: { title: "Conditions require attention", description: "Monitor current conditions and follow local road and weather advisories." },
  high: { title: "High-risk advisory", description: "A connected source has reported elevated risk. Avoid entering the affected stretch until you verify the latest advice." },
  closed: { title: "Road closure reported", description: "Do not route through this corridor while the closure remains in force." },
};

function formatMetric(value: number | undefined, unit: string): string | undefined {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)} ${unit}` : undefined;
}

/**
 * Presentation-only risk card. It deliberately does not convert rainfall or
 * wind thresholds into a road closure decision. Supply a verified assessment.
 */
export function GhatHazardShield({
  corridorName,
  level,
  assessmentLabel,
  sourceName,
  assessedAt,
  precipitationMmPerHour,
  windKmh,
  visibilityKm,
  issueSummary,
  verifiedAlternative,
}: GhatHazardShieldProps) {
  const copy = LEVEL_COPY[level];
  const metrics = [
    ["Rainfall", formatMetric(precipitationMmPerHour, "mm/h")],
    ["Wind", formatMetric(windKmh, "km/h")],
    ["Visibility", formatMetric(visibilityKm, "km")],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label={`Ghat safety information for ${corridorName}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ghat-Shield · Road advisory</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{corridorName}</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          level === "closed" || level === "high" ? "bg-orange-100 text-orange-800" :
          level === "watch" ? "bg-amber-100 text-amber-800" :
          level === "normal" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
        }`}>
          {assessmentLabel ?? copy.title}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-700">{copy.description}</p>
      {issueSummary && <p className="mt-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-950">{issueSummary}</p>}

      {metrics.length > 0 && (
        <dl className="mt-4 grid grid-cols-3 gap-2">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs text-slate-500">{label}</dt>
              <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {verifiedAlternative && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Verified alternative supplied</p>
          <p className="mt-1 font-semibold text-slate-900">{verifiedAlternative.label}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
            {typeof verifiedAlternative.etaDifferenceMinutes === "number" && <span>ETA difference: +{verifiedAlternative.etaDifferenceMinutes} min</span>}
            {typeof verifiedAlternative.distanceKm === "number" && <span>{verifiedAlternative.distanceKm.toFixed(1)} km</span>}
          </div>
          <p className="mt-2 text-xs text-slate-600">Verified by {verifiedAlternative.sourceName} · {verifiedAlternative.verifiedAt}</p>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        {sourceName ? `Source: ${sourceName}` : "Source not supplied"}
        {assessedAt ? ` · Updated: ${assessedAt}` : " · Update time unavailable"}
      </p>
      <p className="mt-2 text-xs text-slate-500" role="note">Weather observations are not, by themselves, proof that a road is safe, unsafe or closed. Follow official traffic and disaster-management instructions.</p>
    </section>
  );
}
