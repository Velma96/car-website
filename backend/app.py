from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from pathlib import Path
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

# === AUTOMATIC BASE URL (works locally + on Render) ===
BASE_URL = os.environ.get('BASE_URL', 'http://127.0.0.1:5000')  # ← This is the magic line

# Database setup
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

# Serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# === HELPER: Build full image URLs ===
def get_full_image_urls(image_urls_str):
    if not image_urls_str:
        return []
    urls = image_urls_str.split(',')
    return [f"{BASE_URL}{url}" for url in urls if url.strip()]

# === CAR ENDPOINTS (Now return FULL URLs) ===
@app.get("/cars")
def get_cars():
    cars = Car.query.all()
    return jsonify([{
        'id': car.id,
        'make': car.make,
        'model': car.model,
        'year': car.year,
        'price': car.price,
        'mileage': car.mileage,
        'condition': car.condition,
        'transmission': car.transmission,
        'fuel_type': car.fuel_type,
        'description': car.description,
        'image_urls': get_full_image_urls(car.image_urls),  # ← Full URLs!
        'is_featured': car.is_featured,
        'is_sold': car.is_sold
    } for car in cars])

@app.get("/cars/<int:id>")
def get_car(id):
    car = Car.query.get_or_404(id)
    return jsonify({
        'id': car.id,
        'make': car.make,
        'model': car.model,
        'year': car.year,
        'price': car.price,
        'mileage': car.mileage,
        'condition': car.condition,
        'transmission': car.transmission,
        'fuel_type': car.fuel_type,
        'description': car.description,
        'image_urls': get_full_image_urls(car.image_urls),  # ← Full URLs!
        'is_featured': car.is_featured,
        'is_sold': car.is_sold
    })

# === REST OF YOUR CODE (unchanged) ===
def save_images(files):
    urls = []
    for file in files:
        if file and file.filename:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            urls.append(f"/uploads/{filename}")
    return ",".join(urls) if urls else None

# ... [your add_car, update_car, delete_car, send_inquiry routes stay exactly the same] ...

@app.post("/send-inquiry")
def send_inquiry():
    data = request.get_json()
    YOUR_EMAIL = "awuorphoebi@gmail.com"
    YOUR_PASSWORD = "zmci wpqs xlpg ejmm"

    subject = f"NEW CAR INQUIRY from {data.get('name', 'Unknown')}"
    body = f"""
    NEW CUSTOMER INQUIRY JUST CAME IN!

    Name           : {data.get('name', 'Not provided')}
    Phone          : {data.get('phone', 'Not provided')}
    Email          : {data.get('email', 'Not provided')}
    Interested in  : {data.get('car_interest', 'Not specified')}

    Message:
    {data.get('message', 'No message')}

    CALL THEM NOW → {data.get('phone', 'No phone')}
    """

    msg = MIMEMultipart()
    msg['From'] = YOUR_EMAIL
    msg['To'] = YOUR_EMAIL
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(YOUR_EMAIL, YOUR_PASSWORD)
        server.sendmail(YOUR_EMAIL, YOUR_EMAIL, msg.as_string())
        server.quit()
        return jsonify({"message": "Inquiry sent successfully"}), 200
    except Exception as e:
        print("Email failed:", e)
        return jsonify({"error": "Failed to send email"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)