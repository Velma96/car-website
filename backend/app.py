from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from pathlib import Path
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)

# === FIX CORS PROPERLY ===
CORS(app, resources={
    r"/*": {
        "origins": ["https://car-website-wine.vercel.app", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# === REST OF YOUR CODE (unchanged) ===
BASE_URL = os.environ.get('BASE_URL', 'http://127.0.0.1:5000')
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "cars.db"
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

from models import db, Car
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

def get_full_image_urls(image_urls_str):
    if not image_urls_str:
        return []
    urls = image_urls_str.split(',')
    return [f"{BASE_URL}{url}" for url in urls if url.strip()]

@app.get("/cars")
def get_cars():
    cars = Car.query.all()
    return jsonify([{
        'id': c.id, 'make': c.make, 'model': c.model, 'year': c.year,
        'price': c.price, 'mileage': c.mileage, 'condition': c.condition,
        'transmission': c.transmission, 'fuel_type': c.fuel_type,
        'description': c.description, 'image_urls': get_full_image_urls(c.image_urls),
        'is_featured': c.is_featured, 'is_sold': c.is_sold
    } for c in cars])

@app.get("/cars/<int:id>")
def get_car(id):
    car = Car.query.get_or_404(id)
    return jsonify({
        'id': car.id, 'make': car.make, 'model': car.model, 'year': car.year,
        'price': car.price, 'mileage': car.mileage, 'condition': car.condition,
        'transmission': car.transmission, 'fuel_type': car.fuel_type,
        'description': car.description, 'image_urls': get_full_image_urls(car.image_urls),
        'is_featured': car.is_featured, 'is_sold': car.is_sold
    })

# === ADMIN ROUTES (add, update, delete) ===
# (keep your existing code — just make sure they exist)

@app.post("/send-inquiry")
def send_inquiry():
    data = request.get_json()
    print("Inquiry received:", data)

    email = os.environ.get("GMAIL_USER")
    password = os.environ.get("GMAIL_APP_PASSWORD")

    if not email or not password:
        print("GMAIL_USER or GMAIL_APP_PASSWORD missing!")
        return jsonify({"error": "Email not configured"}), 500

    msg = MIMEMultipart()
    msg['From'] = email
    msg['To'] = email
    msg['Subject'] = f"NEW INQUIRY from {data.get('name', 'Unknown')}"

    body = f"""
    Name: {data.get('name')}
    Phone: {data.get('phone')}
    Email: {data.get('email')}
    Car: {data.get('car_interest')}
    Message: {data.get('message')}
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(email, password)
        server.sendmail(email, email, msg.as_string())
        server.quit()
        print("EMAIL SENT SUCCESSFULLY!")
        return jsonify({"message": "Sent!"}), 200
    except Exception as e:
        print("EMAIL FAILED:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)