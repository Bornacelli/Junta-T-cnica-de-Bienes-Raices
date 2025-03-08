

const MetricCards = ({ metricsData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {metricsData.map((metric, index) => (
        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">{metric.titulo}</p>
            <p className="text-2xl font-bold text-gray-800">{metric.valor}</p>
            <p className="text-xs text-green-600">{metric.cambio}</p>
          </div>
          <div className="text-3xl">{metric.icono}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;