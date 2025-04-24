import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import VisualizationArea from './VisualizationArea'; // Import the VisualizationArea component
import ChartControls from './ChartControls'; // Import the ChartControls component

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar'); // Add state for chart type

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setPreviewData([]); // Reset preview data on new upload
    setError(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    setLoading(true);

    // Make the POST request without the token
    axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Keep this header to send form data correctly
      }
    })
      .then((response) => {
        setPreviewData(response.data.preview || []);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        if (error.response && error.response.data) {
          setError(error.response.data.error || 'Error uploading file. Please try again.');
        } else {
          setError('Error uploading file. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  return (
    <div className="p-4 border rounded shadow">
      <div {...getRootProps()} className="p-6 border-dashed border-2 border-gray-400 cursor-pointer text-center">
        <input {...getInputProps()} />
        <p>Drag & drop a file here, or click to select</p>
      </div>

      {file && <p className="mt-2">Selected file: <strong>{file.name}</strong></p>}

      {loading && <p className="text-blue-500">Uploading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {previewData.length > 0 && (
        <div className="mt-4 overflow-auto">
          <h3 className="font-bold mb-2">Data Preview:</h3>
          <table className="table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                {Object.keys(previewData[0]).map((key) => (
                  <th key={key} className="border border-gray-300 px-2 py-1">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border border-gray-300 px-2 py-1">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pass data and chartType to VisualizationArea component */}
      <ChartControls chartType={chartType} setChartType={setChartType} /> {/* Add ChartControls here */}
      <VisualizationArea data={previewData} chartType={chartType} />
    </div>
  );
};

export default FileUpload;
