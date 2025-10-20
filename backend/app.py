from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'Uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def handle_file_upload():
    if 'file' not in request.files:
        return jsonify(error='No file part'), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(error='No selected file'), 400

    filename = file.filename
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    ext = filename.rsplit('.', 1)[-1].lower()

    try:
        if ext == 'csv':
            df = pd.read_csv(path)
        elif ext in ('xls','xlsx'):
            df = pd.read_excel(path)
        else:
            return jsonify(error='Unsupported file type'), 400

        preview = df.head(5).to_dict(orient='records')
        return jsonify(message='Upload successful', preview=preview), 200

    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/')
def index():
    return '✅ Flask backend running!'

if __name__ == '__main__':
    app.run(debug=True)
