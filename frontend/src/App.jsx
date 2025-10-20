import './App.css';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Interactive Data Visualization Tool</h1>
      </header>

      <main>
        <FileUpload />
      </main>
    </div>
  );
}

export default App;
