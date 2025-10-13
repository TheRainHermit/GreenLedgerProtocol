import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

type MetricType = {
  type: string;
  name: string;
  units: string[];
  description: string;
};

export default function DataCoinUploadForm({ onUpload }: { onUpload?: () => void }) {
  const { user } = useUser();
  const [metricTypes, setMetricTypes] = useState<MetricType[]>([]);
  const [metricType, setMetricType] = useState("");
  const [unit, setUnit] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/datacoins/metrics/types")
      .then(res => res.json())
      .then(data => {
        if (data.success) setMetricTypes(data.metric_types);
      });
  }, []);

  useEffect(() => {
    // Reset unit when metricType changes
    const selected = metricTypes.find(mt => mt.type === metricType);
    setUnit(selected?.units[0] || "");
  }, [metricType, metricTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("http://localhost:8000/api/v1/datacoins/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: user.companyId,
          metric_type: metricType,
          value: parseFloat(value),
          unit,
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("¡Métrica subida correctamente!");
        setValue("");
        onUpload && onUpload();
      } else {
        setError(data.error || "Error al subir la métrica");
      }
    } catch {
      setError("Error de red o servidor");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-green-700 mb-2">Subir nueva métrica ambiental</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tipo de métrica</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={metricType}
            onChange={e => setMetricType(e.target.value)}
            required
          >
            <option value="">Selecciona...</option>
            {metricTypes.map(mt => (
              <option key={mt.type} value={mt.type}>
                {mt.name}
              </option>
            ))}
          </select>
          {metricType && (
            <div className="text-xs text-gray-500 mt-1">
              {metricTypes.find(mt => mt.type === metricType)?.description}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Valor</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={value}
            onChange={e => setValue(e.target.value)}
            required
            min="0"
            step="any"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Unidad</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            required
          >
            {metricTypes
              .find(mt => mt.type === metricType)
              ?.units.map(u => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Subiendo..." : "Subir métrica"}
        </button>
        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}