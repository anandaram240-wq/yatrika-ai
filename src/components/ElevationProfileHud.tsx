import { useEffect, useMemo, useRef } from "react";

export type ElevationPoint = {
  distanceKm: number;
  elevationM: number;
};

export type ElevationProfileHudProps = {
  points: ElevationPoint[];
  title?: string;
  height?: number;
  hairpinCount?: number;
  nextSegmentLabel?: string;
  /** Optional measured radius from a road-geometry processor. */
  nextHairpinRadiusM?: number;
};

function finitePoints(points: ElevationPoint[]): ElevationPoint[] {
  return points.filter((point) => Number.isFinite(point.distanceKm) &&
    Number.isFinite(point.elevationM) && point.distanceKm >= 0);
}

/** Canvas elevation profile with resize-aware redraw and no continuous busy loop. */
export function ElevationProfileHud({
  points,
  title = "Route elevation profile",
  height = 180,
  hairpinCount,
  nextSegmentLabel,
  nextHairpinRadiusM,
}: ElevationProfileHudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const safePoints = useMemo(() => finitePoints(points), [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const cssHeight = Math.max(100, height);
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(cssHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, cssHeight);

      const padding = { top: 14, right: 12, bottom: 26, left: 46 };
      const plotWidth = Math.max(1, width - padding.left - padding.right);
      const plotHeight = Math.max(1, cssHeight - padding.top - padding.bottom);

      context.font = "11px system-ui, sans-serif";
      context.fillStyle = "#64748b";
      context.strokeStyle = "#e2e8f0";
      context.lineWidth = 1;

      if (safePoints.length < 2) {
        context.fillText("Elevation data unavailable", padding.left, padding.top + 18);
        return;
      }

      const minDistance = Math.min(...safePoints.map((p) => p.distanceKm));
      const maxDistance = Math.max(...safePoints.map((p) => p.distanceKm));
      const minElevation = Math.min(...safePoints.map((p) => p.elevationM));
      const maxElevation = Math.max(...safePoints.map((p) => p.elevationM));
      const elevationRange = Math.max(1, maxElevation - minElevation);
      const distanceRange = Math.max(0.001, maxDistance - minDistance);
      const x = (distance: number) => padding.left + ((distance - minDistance) / distanceRange) * plotWidth;
      const y = (elevation: number) => padding.top + plotHeight - ((elevation - minElevation) / elevationRange) * plotHeight;

      for (let i = 0; i <= 2; i += 1) {
        const yy = padding.top + (plotHeight * i) / 2;
        context.beginPath();
        context.moveTo(padding.left, yy);
        context.lineTo(width - padding.right, yy);
        context.stroke();
        const labelValue = Math.round(maxElevation - (elevationRange * i) / 2);
        context.fillText(`${labelValue} m`, 4, yy + 4);
      }

      context.beginPath();
      safePoints.forEach((point, index) => {
        const px = x(point.distanceKm);
        const py = y(point.elevationM);
        if (index === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      });
      context.lineTo(x(safePoints[safePoints.length - 1].distanceKm), padding.top + plotHeight);
      context.lineTo(x(safePoints[0].distanceKm), padding.top + plotHeight);
      context.closePath();
      const fill = context.createLinearGradient(0, padding.top, 0, padding.top + plotHeight);
      fill.addColorStop(0, "rgba(37, 99, 235, 0.24)");
      fill.addColorStop(1, "rgba(37, 99, 235, 0.02)");
      context.fillStyle = fill;
      context.fill();

      context.beginPath();
      safePoints.forEach((point, index) => {
        const px = x(point.distanceKm);
        const py = y(point.elevationM);
        if (index === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      });
      context.strokeStyle = "#2563eb";
      context.lineWidth = 2.5;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.stroke();

      context.fillStyle = "#64748b";
      context.fillText(`${minDistance.toFixed(0)} km`, padding.left, cssHeight - 6);
      const endLabel = `${maxDistance.toFixed(0)} km`;
      const labelWidth = context.measureText(endLabel).width;
      context.fillText(endLabel, width - padding.right - labelWidth, cssHeight - 6);
    };

    draw();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(draw) : undefined;
    observer?.observe(canvas);
    window.addEventListener("resize", draw);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, [safePoints, height]);

  const minElevation = safePoints.length ? Math.min(...safePoints.map((p) => p.elevationM)) : undefined;
  const maxElevation = safePoints.length ? Math.max(...safePoints.map((p) => p.elevationM)) : undefined;
  const hasTightHairpinFlag = typeof nextHairpinRadiusM === "number" && nextHairpinRadiusM > 0 && nextHairpinRadiusM < 15;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label={title}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Topo-HUD</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        {typeof hairpinCount === "number" && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">{hairpinCount} mapped hairpins</span>}
      </div>

      <canvas
        ref={canvasRef}
        className="mt-3 block w-full"
        style={{ height }}
        role="img"
        aria-label={safePoints.length >= 2 && minElevation !== undefined && maxElevation !== undefined
          ? `Elevation profile from ${minElevation} to ${maxElevation} metres across ${safePoints[safePoints.length - 1].distanceKm - safePoints[0].distanceKm} kilometres`
          : "Elevation profile unavailable"}
      />

      {hasTightHairpinFlag && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
          Tight bend ahead{nextSegmentLabel ? ` on ${nextSegmentLabel}` : ""}: supplied road geometry reports a radius of {nextHairpinRadiusM!.toFixed(1)} m. Reduce speed and follow road signage.
        </p>
      )}
      <p className="mt-3 text-xs text-slate-500">Elevation is based on the supplied route profile. Hairpin warnings appear only when a measured bend radius is provided.</p>
    </section>
  );
}
