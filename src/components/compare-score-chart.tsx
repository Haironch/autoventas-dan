"use client";

import { useState, type MouseEvent, type PointerEvent } from "react";
import { Card } from "@/components/ui/Card";
import { AXES, type AxisKey, type Scores } from "@/lib/compare-scores";

export interface ChartSeries {
  key: string;
  title: string;
  scores: Scores;
  /** Espacio del comparador (0, 1 o 2): el color sigue al espacio, no al orden en la lista. */
  slot: number;
}

interface CompareScoreChartProps {
  series: ChartSeries[];
}

const TICKS = [0, 25, 50, 75, 100];
const NO_DATA = "s/d";

function seriesColor(index: number) {
  return `var(--series-${index + 1})`;
}

function leaderValue(series: ChartSeries[], axis: AxisKey): number {
  return Math.max(0, ...series.map((item) => item.scores[axis] ?? 0));
}

export function CompareScoreChart({ series }: CompareScoreChartProps) {
  const [active, setActive] = useState<AxisKey | null>(null);

  function handleClick(event: MouseEvent, axis: AxisKey) {
    // En mouse manda el hover; el toque en pantallas táctiles abre y cierra el detalle.
    if ((event.nativeEvent as globalThis.PointerEvent).pointerType === "mouse") return;
    setActive((current) => (current === axis ? null : axis));
  }

  function hoverHandlers(axis: AxisKey) {
    return {
      onPointerEnter: (event: PointerEvent) => event.pointerType === "mouse" && setActive(axis),
      onPointerLeave: (event: PointerEvent) => event.pointerType === "mouse" && setActive(null),
    };
  }

  return (
    <Card className="p-5 space-y-5">
      <div>
        <h2 className="font-heading font-bold text-base">Perfil comparado</h2>
        <p className="text-xs text-muted mt-1 max-w-xl leading-relaxed">
          Puntaje orientativo de 0 a 100 en cinco temas; más es mejor. No son mediciones: salen de reglas
          simples sobre los datos de cada auto.
        </p>
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Autos comparados">
        {series.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-xs text-foreground">
            <span
              className="inline-block size-3 rounded-[3px] shrink-0"
              style={{ background: seriesColor(item.slot) }}
              aria-hidden="true"
            />
            {item.title}
          </li>
        ))}
      </ul>

      <div>
        {AXES.map((axis) => {
          const leader = leaderValue(series, axis.key);
          const isActive = active === axis.key;
          const summary = series
            .map((item) => `${item.title}: ${item.scores[axis.key] ?? "sin datos"}`)
            .join(", ");

          return (
            <div
              key={axis.key}
              role="group"
              tabIndex={0}
              aria-label={`${axis.label}. ${summary}`}
              onFocus={() => setActive(axis.key)}
              onBlur={() => setActive(null)}
              onClick={(event) => handleClick(event, axis.key)}
              {...hoverHandlers(axis.key)}
              className="relative -mx-2 px-2 py-2.5 rounded-lg grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-x-4 gap-y-1.5 items-center outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="text-sm text-foreground">{axis.label}</span>

              <div className="pr-8">
                <div
                  className="relative"
                  style={{
                    backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px)",
                    backgroundSize: "25% 100%",
                    boxShadow: "inset -1px 0 0 var(--border)",
                  }}
                >
                  {series.map((item) => {
                    const score = item.scores[axis.key];
                    const showLabel = score !== null && score > 0 && score === leader;

                    return (
                      <div key={item.key} className="relative h-3.5 mb-0.5 last:mb-0">
                        {score !== null && score > 0 && (
                          <div
                            className="h-full rounded-r-[4px]"
                            style={{ width: `${score}%`, background: seriesColor(item.slot) }}
                          />
                        )}
                        {showLabel && (
                          <span
                            className="absolute top-1/2 -translate-y-1/2 text-xs text-muted tabular-nums"
                            style={{ left: `calc(${score}% + 6px)` }}
                          >
                            {score}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {isActive && (
                <div
                  aria-hidden="true"
                  className="absolute right-2 top-full z-10 mt-0.5 min-w-48 rounded-lg border border-border bg-surface px-3 py-2.5 shadow-lg"
                >
                  <p className="text-xs text-muted mb-1.5">{axis.label}</p>
                  <ul className="space-y-1.5">
                    {series.map((item) => (
                      <li key={item.key} className="flex items-center gap-2">
                        <span
                          className="inline-block h-0.5 w-4 shrink-0 rounded-full"
                          style={{ background: seriesColor(item.slot) }}
                        />
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          {item.scores[axis.key] ?? NO_DATA}
                        </span>
                        <span className="text-xs text-muted">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        <div className="grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-x-4 mt-1" aria-hidden="true">
          <span className="max-sm:hidden" />
          <div className="pr-8">
            <div className="relative h-4">
              {TICKS.map((tick) => (
                <span
                  key={tick}
                  className="absolute text-[11px] text-muted tabular-nums -translate-x-1/2"
                  style={{ left: `${tick}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <details>
          <summary className="cursor-pointer text-sm text-accent hover:text-accent-hover transition-colors">
            Ver como tabla
          </summary>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse min-w-[360px]">
              <thead>
                <tr>
                  <th className="text-left text-xs text-muted font-normal py-2 pr-4">Tema</th>
                  {series.map((item) => (
                    <th key={item.key} className="text-left text-xs font-medium py-2 pr-4">
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AXES.map((axis) => {
                  const leader = leaderValue(series, axis.key);
                  return (
                    <tr key={axis.key} className="border-t border-border">
                      <td className="py-2 pr-4 text-xs text-muted">{axis.label}</td>
                      {series.map((item) => {
                        const score = item.scores[axis.key];
                        return (
                          <td
                            key={item.key}
                            className={`py-2 pr-4 tabular-nums ${score !== null && score === leader ? "font-semibold" : ""}`}
                          >
                            {score ?? NO_DATA}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>

        <details>
          <summary className="cursor-pointer text-sm text-accent hover:text-accent-hover transition-colors">
            Cómo se calculan los puntajes
          </summary>
          <dl className="mt-3 space-y-2.5">
            {AXES.map((axis) => (
              <div key={axis.key}>
                <dt className="text-xs font-medium text-foreground">{axis.label}</dt>
                <dd className="text-xs text-muted leading-relaxed">{axis.rule}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </Card>
  );
}
