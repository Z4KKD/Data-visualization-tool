import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import VisualizationArea from './VisualizationArea';
import ChartControls from './ChartControls';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [numericSummary, setNumericSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar');

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setPreviewData([]);
    setSummaryData(null);
    setNumericSummary({});
    setError(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    setLoading(true);

    // Upload file first
    axios.post('http://localhost:5000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
      setPreviewData(response.data.preview || []);

      // Then get summary
      return axios.post('http://localhost:5000/summary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    })
    .then((response) => {
      const summary = response.data.summary || {};
      setSummaryData(summary);

      // Extract numeric columns for chart
      const numeric = {};
      Object.entries(summary).forEach(([col, stats]) => {
        if (stats.mean !== undefined) {
          numeric[col] = {
            mean: stats.mean,
            min: stats.min,
            max: stats.max,
            std: stats.std
          };
        }
      });
      setNumericSummary(numeric);
    })
    .catch((err) => {
      if (err.response && err.response.data) setError(err.response.data.error);
      else setError('Error processing file. Please try again.');
    })
    .finally(() => setLoading(false));
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  return (
    <div>
      {/* Upload Button */}
      <div className="upload-container">
        <input {...getInputProps()} />
        <button className="upload-button" onClick={open}>
          {file ? `Selected: ${file.name}` : 'Upload File'}
        </button>
      </div>

      {loading && <p style={{ color:'#61dafb' }}>Uploading & processing...</p>}
      {error && <p style={{ color:'#ff6b6b' }}>{error}</p>}

      {/* Chart Controls and Visualization */}
      {previewData.length > 0 && (
        <>
          <div className="chart-controls">
            <ChartControls chartType={chartType} setChartType={setChartType} />
          </div>

          <div className="chart-container">
            <VisualizationArea 
              data={previewData} 
              chartType={chartType} 
              summary={numericSummary} 
            />
          </div>

          {/* Data Preview */}
          <div className="data-preview">
            <h3>Data Preview:</h3>
            <table>
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          {summaryData && (
            <div className="summary-container">
              <h3>Summary Statistics:</h3>
              {Object.keys(summaryData).map((col) => (
                <div key={col} className="summary-column">
                  <strong>{col}</strong>
                  <ul>
                    {Object.entries(summaryData[col]).map(([stat, value]) => (
                      <li key={stat}>{stat}: {value}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Numeric Summary Table */}
          {Object.keys(numericSummary).length > 0 && (
            <div className="numeric-summary">
              <h3>Numeric Summary (Mean, Min, Max, Std):</h3>
              {Object.entries(numericSummary).map(([col, stats]) => (
                <div key={col}>
                  <strong>{col}</strong>
                  <p>Mean: {stats.mean}</p>
                  <p>Min: {stats.min}</p>
                  <p>Max: {stats.max}</p>
                  <p>Std: {stats.std}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FileUpload;
