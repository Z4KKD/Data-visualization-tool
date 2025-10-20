from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # allow frontend access

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'Uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def load_file(file):
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext == 'csv':
        df = pd.read_csv(file)
    elif ext in ('xls', 'xlsx'):
        df = pd.read_excel(file)
    else:
        raise ValueError("Unsupported file type")
    return df

@app.route('/upload', methods=['POST'])
def handle_file_upload():
    if 'file' not in request.files:
        return jsonify(error='No file part'), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(error='No selected file'), 400

    try:
        df = load_file(file)
        preview = df.head(5).to_dict(orient='records')
        return jsonify(message='Upload successful', preview=preview), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/summary', methods=['POST'])
def summary_statistics():
    file = request.files.get('file')
    if not file:
        return jsonify(error='No file uploaded'), 400
    try:
        df = load_file(file)

        # Basic stats
        summary = df.describe(include='all').to_dict()

        # Extra stats
        summary['median'] = df.median(numeric_only=True).to_dict()
        summary['mode'] = df.mode().iloc[0].to_dict() if not df.mode().empty else {}
        summary['variance'] = df.var(numeric_only=True).to_dict()
        summary['sum'] = df.sum(numeric_only=True).to_dict()
        summary['count'] = df.count().to_dict()

        # Correlation
        summary['correlation'] = df.corr(numeric_only=True).to_dict()

        # Column types
        summary['dtypes'] = df.dtypes.apply(lambda x: str(x)).to_dict()

        return jsonify(summary=summary), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/preview', methods=['POST'])
def preview_data():
    file = request.files.get('file')
    if not file:
        return jsonify(error='No file uploaded'), 400

    page = int(request.form.get('page', 1))
    per_page = int(request.form.get('per_page', 10))
    try:
        df = load_file(file)
        start = (page-1)*per_page
        end = start + per_page
        preview = df.iloc[start:end].to_dict(orient='records')
        return jsonify(preview=preview), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/grouped_summary', methods=['POST'])
def grouped_summary():
    file = request.files.get('file')
    group_col = request.form.get('group_col')  # e.g., 'Department'
    if not file:
        return jsonify(error='No file uploaded'), 400
    if not group_col:
        return jsonify(error='No group column specified'), 400
    try:
        df = load_file(file)
        if group_col not in df.columns:
            return jsonify(error=f"Column '{group_col}' not found"), 400

        grouped = df.groupby(group_col).agg(['mean','min','max','median','sum','count']).to_dict()
        return jsonify(grouped_summary=grouped), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/filter', methods=['POST'])
def filter_data():
    file = request.files.get('file')
    filters = request.json.get('filters', {})  # e.g., {"Salary": {"gt": 50000}}
    if not file:
        return jsonify(error='No file uploaded'), 400
    try:
        df = load_file(file)

        for col, condition in filters.items():
            if col not in df.columns:
                continue
            for op, val in condition.items():
                if op == 'gt':
                    df = df[df[col] > val]
                elif op == 'lt':
                    df = df[df[col] < val]
                elif op == 'eq':
                    df = df[df[col] == val]
                elif op == 'neq':
                    df = df[df[col] != val]

        filtered = df.head(50).to_dict(orient='records')
        return jsonify(filtered=filtered), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/')
def index():
    return '✅ Flask backend running with advanced Python analytics!'

if __name__ == '__main__':
    app.run(debug=True)
