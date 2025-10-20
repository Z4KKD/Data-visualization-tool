from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd

app = Flask(__name__)
CORS(app)  # allow frontend access

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'Uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def load_file(file):
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext == 'csv':
        return pd.read_csv(file)
    elif ext in ('xls', 'xlsx'):
        return pd.read_excel(file)
    else:
        raise ValueError("Unsupported file type")

@app.route('/upload', methods=['POST'])
def handle_file_upload():
    file = request.files.get('file')
    if not file or file.filename == '':
        return jsonify(error='No file uploaded'), 400
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

        # Column types
        summary['dtypes'] = df.dtypes.apply(str).to_dict()

        return jsonify(summary=summary), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/')
def index():
    return '✅ Flask backend running with advanced Python analytics!'

if __name__ == '__main__':
    app.run(debug=True)
