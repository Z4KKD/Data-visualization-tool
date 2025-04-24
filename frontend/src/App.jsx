import { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import ChartControls from './components/ChartControls';
import VisualizationArea from './components/VisualizationArea';

function App() {
  const [fileData, setFileData] = useState(null);
  const [selectedChart, setSelectedChart] = useState('bar'); // Default chart type
  const [filters, setFilters] = useState({}); // Example for filters

  // Handle file upload and store the data for visualization
  const handleFileUpload = (data) => {
    setFileData(data);
  };

  // Handle chart type selection
  const handleChartTypeChange = (newChartType) => {
    setSelectedChart(newChartType);
  };

  // Handle filter changes (expand this as needed)
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Interactive Data Visualization Tool</h1>
      </header>

      <main>
        <FileUpload onFileUpload={handleFileUpload} />

        {fileData && (
          <>
            <ChartControls 
              onChartTypeChange={handleChartTypeChange} 
              onFilterChange={handleFilterChange} 
            />

            <VisualizationArea 
              data={fileData} 
              chartType={selectedChart} 
              filters={filters} 
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
