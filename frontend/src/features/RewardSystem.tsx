export default function RewardSystem() {
  // Simulación de recompensas
  const rewards = [
    { title: "Certificado Verde", desc: "Por superar 80 EcoScore" },
    { title: "Descuento en servicios", desc: "Por participación activa" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-green-700 mb-2">Recompensas</h2>
      <ul className="space-y-2">
        {rewards.map((r, i) => (
          <li key={i}>
            <span className="font-bold text-green-600">{r.title}</span>
            <div className="text-gray-500 text-sm">{r.desc}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}