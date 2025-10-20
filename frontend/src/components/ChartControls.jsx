import React from 'react';

const ChartControls = ({ chartType, setChartType }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor="chart-type" className="mb-1">Select Chart Type:</label>
    <select
      id="chart-type"
      value={chartType}
      onChange={(e) => setChartType(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="bar">Bar Chart</option>
      <option value="pie">Pie Chart</option>
      <option value="line">Line Chart</option>
      <option value="scatter">Scatter Plot</option>
      <option value="heatmap">Heat Map</option>
    </select>
  </div>
);

export default ChartControls;
