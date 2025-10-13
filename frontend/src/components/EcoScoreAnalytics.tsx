/**
 * EcoScoreAnalytics Component
 * Muestra métricas y análisis del EcoScore basado en datos ambientales.
 */
import React from "react";

export default function EcoScoreAnalytics() {
  // Simulación de datos
  const ecoScore = 82;
  const trend = [70, 74, 78, 80, 82];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-green-700 mb-2">EcoScore</h2>
      <div className="flex items-center space-x-4">
        <span className="text-4xl font-bold text-green-600">{ecoScore}</span>
        <span className="text-gray-500">/ 100</span>
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-400 mb-1">Tendencia semanal</div>
        <div className="flex space-x-2">
          {trend.map((val, idx) => (
            <div
              key={idx}
              className={`h-3 rounded bg-green-400`}
              style={{ width: 24, opacity: 0.5 + idx * 0.1 }}
              title={`Día ${idx + 1}: ${val}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
