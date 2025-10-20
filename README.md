# Interactive Data Visualization Tool

This is a fully functional interactive web application that allows users to upload CSV or Excel files and generate dynamic visualizations using React, D3.js, and Python (Flask). The tool provides multiple chart types and real-time filtering, giving users deep insight into their datasets.

![Logo](https://github.com/Z4KKD/Data-visualization-tool/blob/main/IDVT.png)

---

## 🚀 Features

* 👂 **File Upload**: Upload `.csv` or `.xlsx` files.
* 💬 **Chart Types**: Bar chart, Line chart, Pie chart, Scatter plot, Heatmap.
* 🛣️ **Filters**: Filter data dynamically based on numerical values or categories.
* ⚡ **Real-Time Visualization**: Changes are reflected instantly when filters or chart types are updated.
* 🌌 **Dynamic Galaxy Background**: Animated, dark-green theme for immersive UI.
* 🌐 **Responsive UI**: Built with React and D3.js for a modern user experience.

---

## 📊 Data Analysis

The app focuses on **data analysis** and visualization. Users can upload CSV or Excel files, and the backend (Flask + Pandas) processes and analyzes the data to provide insights.

### Key Features:

* **Data Processing**: Uploaded datasets are cleaned and structured using **pandas** for meaningful analysis.
* **Visualizations**: Various charts (bar, pie, line, scatter, heatmap) help users explore trends and patterns.
* **Dynamic Filters**: Explore subsets of data interactively by numeric ranges or categories.

### Future Enhancements:

* **Machine Learning Integration**: Predict trends or categorize data automatically.
* **Advanced Data Processing**: Additional cleaning, handling missing values, outlier detection, and analytics.

---

## 🧠 Tech Stack

### Frontend

* React (Vite)
* D3.js for rendering charts
* Tailwind CSS (optional styling)

### Backend

* Flask (Python)
* pandas for data processing
* flask-cors for handling CORS
* openpyxl for Excel file processing

### Database

* PostgreSQL (optional for future persistence)

---

## 📁 Project Structure

```
/Frontend
└── src/
    ├── components/
    │   ├── FileUpload.jsx
    │   ├── ChartControls.jsx
    │   └── VisualizationArea.jsx
    └── App.jsx

/Backend
├── app.py
├── Uploads/
└── requirements.txt
```

---

## 🌐 Hosting Instructions

### Frontend on Netlify

1. Build the frontend for production:

```bash
cd frontend
npm run build
```

2. Drag-and-drop the `dist/` folder (or use `netlify.toml` config) in Netlify dashboard.
3. Set environment variable if needed for API URL:

```bash
REACT_APP_API_URL=https://your-backend.onrender.com
```

### Backend on Render

1. Push backend to GitHub if not already done.
2. Create a new **Web Service** on Render.
3. Connect your GitHub repo.
4. Set build and start commands:

```bash
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
```

5. Add environment variables if needed, like `FLASK_ENV=production`.
6. Deploy. Copy your Render service URL and use it as the API URL in the frontend.

---

## 🛠️ Local Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

* Frontend runs on `http://localhost:5173`
* Backend runs on `http://localhost:5000`
* Update API endpoints in frontend if needed.

---

## 💾 Downloadable Version

To download a ready-to-run version of this project:

1. Clone the repo:

```bash
git clone https://github.com/Z4KKD/Data-visualization-tool.git
```

2. Zip the folder:

```bash
zip -r IDVT.zip Data-visualization-tool/
```

3. Extract on any machine, install dependencies (frontend: `npm install`, backend: `pip install -r requirements.txt`) and run locally.

---

## 📌 Notes

* JWT Authentication and Docker are skipped for simplicity.
* Focused on interactive visualization and dynamic filtering.
* Perfect for portfolios, demos, and data exploration.

---

## 🧑‍💻 Author

**Zachary Duncan**

* GitHub: [Z4KKD](https://github.com/Z4KKD)
* Portfolio: [Z4KKD](https://z4kkd.netlify.app/)
