import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import VisualizationArea from './VisualizationArea';
import ChartControls from './ChartControls';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [numericSummary, setNumericSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar');

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setPreviewData([]);
    setNumericSummary({});
    setError(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);
    setLoading(true);

    // Upload file and fetch summary
    axios.post('http://localhost:5000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      setPreviewData(res.data.preview || []);
      return axios.post('http://localhost:5000/summary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    })
    .then(res => {
      const summary = res.data.summary || {};
      const numeric = {};
      Object.entries(summary).forEach(([col, stats]) => {
        if (stats.mean !== undefined) {
          numeric[col] = { mean: stats.mean, min: stats.min, max: stats.max, std: stats.std };
        }
      });
      setNumericSummary(numeric);
    })
    .catch(err => {
      setError(err.response?.data?.error || 'Error processing file.');
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
      <div {...getRootProps()} className="upload-container">
        <input {...getInputProps()} />
        <button onClick={open} className="upload-button">
          {file ? `Selected: ${file.name}` : 'Upload File'}
        </button>
      </div>

      {loading && <p style={{ color:'#61dafb' }}>Uploading & processing...</p>}
      {error && <p style={{ color:'#ff6b6b' }}>{error}</p>}

      {/* Charts & Data */}
      {previewData.length > 0 && (
        <>
          <ChartControls chartType={chartType} setChartType={setChartType} />
          <VisualizationArea data={previewData} chartType={chartType} summary={numericSummary} />

          {/* Data Preview */}
          <div className="data-preview">
            <h3>Data Preview:</h3>
            <table>
              <thead>
                <tr>{Object.keys(previewData[0]).map(key => <th key={key}>{key}</th>)}</tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>{Object.values(row).map((val,i) => <td key={i}>{val}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Numeric Summary */}
          {Object.keys(numericSummary).length > 0 && (
            <div className="numeric-summary">
              <h3>Numeric Summary:</h3>
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
