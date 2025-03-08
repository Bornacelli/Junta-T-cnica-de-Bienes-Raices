import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

const LineChart = ({ lineData }) => {
  // Tooltip personalizado para gráfico de línea
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-700">{`${label}`}</p>
          <p className="text-sm text-blue-600">{`Documentos: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-700">Documentos Cargados</h2>
        <div className="text-2xl font-bold text-blue-600">80 Docs</div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorDocumentos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="fecha" 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              axisLine={false}
              tickLine={false}
              dx={-5}
            />
            <Tooltip content={<CustomLineTooltip />} />
            <Area 
              type="monotone" 
              dataKey="documentos" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorDocumentos)" 
            />
            <Line 
              type="monotone" 
              dataKey="documentos" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 0 }} 
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#3b82f6' }} 
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;