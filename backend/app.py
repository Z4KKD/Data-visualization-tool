from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
import pandas as pd

# ─── App & Extensions Setup ────────────────────────────────────────────────────

app = Flask(__name__, static_folder='../Frontend/public', static_url_path='')

# database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Wordpass1@localhost:5432/data_viz_tool'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db     = SQLAlchemy(app)
migrate= Migrate(app, db)

# allow our Vite frontend to call us
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# ─── Models ─────────────────────────────────────────────────────────────────────

class FileMetadata(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    filename    = db.Column(db.String(255), nullable=False)
    file_size   = db.Column(db.BigInteger)
    upload_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    file_type   = db.Column(db.String(50))
    user_id     = db.Column(db.Integer)

# ─── Helpers ────────────────────────────────────────────────────────────────────

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'Uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def insert_file_metadata(filename, file_size, file_type, user_id):
    m = FileMetadata(
        filename=filename,
        file_size=file_size,
        file_type=file_type,
        user_id=user_id
    )
    db.session.add(m)
    db.session.commit()

# ─── Routes ─────────────────────────────────────────────────────────────────────

@app.route('/upload', methods=['POST'])
# Remove @jwt_required() to disable JWT
def handle_file_upload():
    # Simulating a user_id (or remove user_id if not needed)
    user_id = 1  # Use a static user ID for testing purposes, or set it to `None` if it's not required
    
    if 'file' not in request.files:
        return jsonify(error='No file part'), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(error='No selected file'), 400

    filename = file.filename
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    size = os.path.getsize(path)
    ext  = filename.rsplit('.', 1)[-1].lower()

    insert_file_metadata(filename, size, ext, user_id)

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

# simple root to sanity-check
@app.route('/')
def index():
    return 'Data‐Viz Backend Running', 200

# ─── Main ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(debug=True)
