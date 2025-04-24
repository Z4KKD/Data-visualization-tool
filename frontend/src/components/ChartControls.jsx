import React from 'react';

const ChartControls = ({ chartType, setChartType }) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="chart-type" className="block mb-2">Select Chart Type:</label>
        <select
          id="chart-type"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="line">Line Chart</option>
          <option value="heatmap">Heat Map</option>
        </select>
      </div>
    </div>
  );
};

export default ChartControls;
