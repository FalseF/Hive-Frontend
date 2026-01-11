"use client";

import React, { useState } from "react";

interface BarConfig<T> {
  key: keyof T;
  label: string;
  color: string;
}

interface TooltipData {
  x: number;
  y: number;
  name: string;
  label: string;
  value: number;
}

interface DynamicBarChartProps<T> {
  title: string;
  data: T[];
  nameKey: keyof T; // e.g. "name"
  bars: BarConfig<T>[]; // revenue, margin, etc
  maxValue?: number; // optional override
  height?: number;
  tickCount ?: number;
}

export function DynamicBarChartWithNegative<T extends Record<string, any>>({
  title,
  data,
  nameKey,
  bars,
  maxValue,
  height = 200,
  tickCount = 4,
}: DynamicBarChartProps<T>) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const maxHight =
  maxValue ??
   Math.max(
      ...data.flatMap(item =>
        bars.map(bar => Number(item[bar.key]) || 0)
      )
    );

  const calculatedMax = maxHight || 1;

  const yAxisLabels = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((calculatedMax / tickCount) * (tickCount - i))
  );

  const isCentered = data.length <= 2;

  const columnStyle = isCentered
    ? { width: "120px" }
    : { flex: 1 };

  if (!data.length) {
    return (
      <div className="bg-white p-4 rounded-lg text-center ">
        <h1 className="text-lg font-semibold mb-30">{title}</h1>
            No data available
      </div>
    );
  }

  const values = data.flatMap(item =>
  bars.map(bar => Number(item[bar.key]) || 0)
);

const maxValueCalc = Math.max(...values, 0);
const minValueCalc = Math.min(...values, 0);

const max = maxValue ?? maxValueCalc;
const min = minValueCalc;

const range = max - min || 1;

// zero line position
const zeroY = max > 0 ? (max / range) * height : 0;

  
  return (
    <div className="bg-white p-4 rounded-lg">
      <h1 className="text-lg font-semibold text-center mb-2">{title}</h1>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-6 text-sm">
        {bars.map(bar => (
          <div key={bar.label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: bar.color }}
            />
            <span>{bar.label}</span>
          </div>
        ))}
      </div>

      <div className="relative" style={{ paddingLeft: 40, paddingBottom: 32 }}>
  {/* Y AXIS */}
  <div className="absolute left-0 top-0 h-full w-[40px] text-sm text-gray-600">
    {yAxisLabels.map((value, i) => {
      const y = (height / tickCount) * i;

      return (
        <div
          key={i}
          className="absolute right-2 transform -translate-y-1/2 transition-all duration-300"
          style={{ top: `${y}px` }}
        >
          {value}
        </div>
      );
    })}
  </div>

  {/* CHART */}
  <div className="relative" style={{ height }}>
    {/* GRID + ZERO LINE */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {yAxisLabels.map((_, i) => {
        const y = (height / tickCount) * i;
        return (
          <line
            key={i}
            x1="0"
            y1={y}
            x2="100%"
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}

      {/* Zero Line */}
      {min < 0 && (
        <line
          x1="0"
          y1={zeroY}
          x2="100%"
          y2={zeroY}
          stroke="#111827"
          strokeWidth="1.5"
        />
      )}
    </svg>

    {/* BARS */}
    <div
      className={`relative h-full flex items-end gap-4 ${
        isCentered ? "justify-center" : ""
      }`}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className={`flex items-end gap-1 ${isCentered ? "" : "flex-1"}`}
          style={columnStyle}
        >
          {bars.map(bar => {
            const value = Number(item[bar.key]) || 0;
            const barHeight = Math.abs(value / range) * height;

            const isNegative = value < 0;

            return (
              <div
                key={bar.label}
                className="relative w-full flex justify-center"
              >
                <div
                  className="rounded-t cursor-pointer hover:opacity-80 transition-all duration-500 ease-out"
                  style={{
                    height: `${barHeight}px`,
                    width: `${100 / bars.length}%`,
                    backgroundColor: bar.color,
                    minWidth: 20,
                    transform: isNegative
                      ? `translateY(${zeroY}px)`
                      : `translateY(${zeroY - barHeight}px)`,
                  }}
                  onMouseEnter={e =>
                    setTooltip({
                      x: e.currentTarget.getBoundingClientRect().left,
                      y: e.currentTarget.getBoundingClientRect().top,
                      name: item[nameKey] as string,
                      label: bar.label,
                      value,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>

  {/* X AXIS */}
  <div
    className={`flex gap-4 mt-4 ${
      isCentered ? "justify-center" : ""
    }`}
  >
    {data.map((item, index) => (
      <div
        key={index}
        className="text-cyan-600 underline text-sm text-center"
        style={columnStyle}
      >
        {item[nameKey]}
      </div>
    ))}
  </div>
</div>


      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed bg-gray-800 text-white px-3 py-2 rounded text-sm pointer-events-none z-50"
          style={{
            left: tooltip.x,
            top: tooltip.y - 60,
            transform: "translateX(-50%)",
          }}
        >
          <div className="font-semibold">{tooltip.name}</div>
          <div>
            {tooltip.label}: ${tooltip.value}
          </div>
        </div>
      )}
    </div>
  );
}
