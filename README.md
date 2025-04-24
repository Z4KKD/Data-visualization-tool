# Interactive Data Visualization Tool

This is a fully functional interactive web application that allows users to upload CSV or Excel files and generate dynamic visualizations using D3.js. The tool provides multiple chart types and real-time filtering, giving users deep insight into their datasets.

## 🚀 Features

- 📂 **File Upload**: Upload `.csv` or `.xlsx` files.
- 📊 **Chart Types**: Bar chart, Line chart, Pie chart, Heatmap.
- 🎛️ **Filters**: Filter data dynamically based on numerical values or categories.
- ⚡ **Real-Time Visualization**: Changes are reflected instantly when filters or chart types are updated.
- 🌐 **Responsive UI**: Built with React and D3.js for a clean, modern user experience.

## 📊 Data Analysis

This project focuses on **data analysis** and visualization. By allowing users to upload CSV or Excel files, it processes and analyzes the data to provide insightful visualizations.

### Key Data Analysis Features:
- **Data Processing**: Using **pandas**, the project processes and transforms the uploaded dataset, cleaning and structuring it for meaningful insights.
- **Visualization**: Different types of charts (bar charts, pie charts, line graphs, heatmaps) are generated to help users understand trends, patterns, and distributions within the data.
- **Filters**: Users can filter data dynamically to explore different subsets of the data (e.g., by date range, numeric ranges, or categories).

Although the project does not yet incorporate machine learning, it is designed to give users the ability to conduct thorough data analysis through dynamic visualizations and real-time filtering of datasets.

### Future Enhancements:
- **Machine Learning Integration**: Potential future feature to add machine learning algorithms for predicting trends or automatically categorizing data based on historical patterns.
- **Advanced Data Processing**: Future improvements may include adding additional data cleaning and transformation techniques to better handle missing values, outliers, and advanced analytics.

## 🧠 Tech Stack

### Frontend:
- React (Vite)
- D3.js for rendering charts

### Backend:
- Flask (Python)
- pandas (data processing)
- flask-cors (CORS handling)
- flask-uploads & openpyxl (file handling)

### Database:
- PostgreSQL (optional for future use, not yet implemented in the current version)

## 📁 Project Structure

/Frontend  
└── src/  
    ├── components/  
    │   ├── FileUpload.jsx  
    │   ├── ChartControls.jsx  
    │   ├── Filters.jsx  
    │   └── VisualizationArea.jsx  
    └── App.jsx  

/Backend  
├── app.py  
├── Uploads/  
└── requirements.txt  

## 🛠️ Setup Instructions

### Backend

1. Create and activate a virtual environment:
   python -m venv venv  
   source venv/bin/activate (or venv\Scripts\activate on Windows)

2. Install dependencies:
   pip install -r requirements.txt

3. Run the Flask server:
   python app.py

### Frontend

1. Install dependencies:
   npm install

2. Run the React dev server:
   npm run dev

Your frontend will run on `http://localhost:5173` and will communicate with the backend at `http://localhost:5000`.

## 📌 Notes

- **JWT Authentication** and **Docker** were skipped intentionally for simplicity and demo purposes.
- The project focuses on client-side interactivity, filters, and rendering charts — perfect for portfolios or data exploration.

## 🧑‍💻 Author

**Zachary Duncan**  
