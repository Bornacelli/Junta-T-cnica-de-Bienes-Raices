import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const PieChart = ({ pieData }) => {
  // Tooltip personalizado para gráfico circular
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="text-sm font-medium" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-700">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-700">Estado de Documentos</h2>
        <div className="text-sm text-gray-500">Total: 100%</div>
      </div>
      
      <div className="h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={100}
              paddingAngle={1.5} 
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}  
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
        {pieData.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-xs text-gray-500">{item.name}</p>
            <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;