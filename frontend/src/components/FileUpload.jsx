import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import VisualizationArea from './VisualizationArea';
import ChartControls from './ChartControls';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar');

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setPreviewData([]);
    setError(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    setLoading(true);

    axios.post('http://localhost:5000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
      setPreviewData(response.data.preview || []);
    })
    .catch((err) => {
      if (err.response && err.response.data) setError(err.response.data.error);
      else setError('Error uploading file. Please try again.');
    })
    .finally(() => setLoading(false));
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,       // prevent clicking the entire dropzone
    noKeyboard: true,    // prevent keyboard open
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

      {loading && <p style={{color:'#61dafb'}}>Uploading...</p>}
      {error && <p style={{color:'#ff6b6b'}}>{error}</p>}

      {/* Chart Controls */}
      {previewData.length > 0 && (
        <>
          <div className="chart-controls">
            <ChartControls chartType={chartType} setChartType={setChartType} />
          </div>

          {/* Chart */}
          <div className="chart-container">
            <VisualizationArea data={previewData} chartType={chartType} />
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
        </>
      )}
    </div>
  );
};

export default FileUpload;
