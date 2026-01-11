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

export function DynamicBarChart<T extends Record<string, any>>({
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

      <div className="relative" style={{ paddingLeft: "40px" }}>
        {/* Y Axis */}
        <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-sm text-gray-600">
          {yAxisLabels.map((value,index) => (
            <div key={index}>{value}</div>
          ))}
        </div>

        {/* Chart */}
        <div className="relative" style={{ height }}>
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {yAxisLabels.map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={(height / tickCount) * i}
                x2="100%"
                y2={(height / tickCount) * i}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
          </svg>

          {/* Bars */}
          <div className={`relative h-full flex items-end gap-4 ${ isCentered ? "justify-center" : ""}`}>
            {data.map((item, index) => (
              <div  
              key={index} 
              className={`flex items-end gap-1 ${isCentered ? "" : "flex-1"}`}
              style={columnStyle}
              >
                {bars.map(bar => {
                  const value = Number(item[bar.key]) || 0;
                  const barHeight = (value / calculatedMax) * height;

                  return (
                    <div
                      key={bar.label}
                      className="rounded-t cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        height: `${barHeight}px`,
                        width: `${100 / bars.length}%`,
                        backgroundColor: bar.color,
                        minWidth: "20px",
                      }}
                      onMouseEnter={e =>
                        setTooltip({
                          x: e.currentTarget.getBoundingClientRect().left,
                          y: e.currentTarget.getBoundingClientRect().top,
                          name: item[nameKey],
                          label: bar.label,
                          value,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* X Axis */}
        <div 
          className={`flex gap-4 mt-4 ${isCentered ? "justify-center" : ""}`}
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
