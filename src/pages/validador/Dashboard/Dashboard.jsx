
import MetricCards from './MetricCards';
import LineChart from './LineChart';
import PieChart from './PieChart';

const Dashboard = () => {
  // Datos para métricas generales
  const metricsData = [
    { titulo: 'Documentos Totales', valor: '245', icono: '📄', cambio: '+12% mes anterior' },
    { titulo: 'Usuarios Activos', valor: '82', icono: '👥', cambio: '+5% mes anterior' },
    { titulo: 'Tiempo de Validación', valor: '24 hrs', icono: '⏱️', cambio: '-10% mes anterior' },
  ];

  // Datos para el gráfico de línea
  const lineData = [
    { fecha: '25 Jan', documentos: 200 },
    { fecha: '26 Jan', documentos: 50 },
    { fecha: '27 Jan', documentos: 60 },
    { fecha: '28 Jan', documentos: 40 },
    { fecha: '29 Jan', documentos: 80 },
    { fecha: '30 Jan', documentos: 40 },
    { fecha: '31 Jan', documentos: 50 },
    { fecha: '1 Feb', documentos: 80 },
    { fecha: '2 Feb', documentos: 60 },
    { fecha: '3 Feb', documentos: 80 },
    { fecha: '4 Feb', documentos: 70 },
    { fecha: '5 Feb', documentos: 60 },
  ];

  // Datos para el gráfico circular
  const pieData = [
    { name: 'Activos', value: 70, color: '#3b82f6' },
    { name: 'Suspendidos', value: 18, color: '#06b6d4' },
    { name: 'Cancelados', value: 12, color: '#d1d5db' }
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Tarjetas de métricas */}
      <MetricCards metricsData={metricsData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de línea */}
        <LineChart lineData={lineData} />
        
        {/* Gráfico circular */}
        <PieChart pieData={pieData} />
      </div>
    </div>
  );
};

export default Dashboard;