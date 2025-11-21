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

# === AUTOMATIC BASE URL (works locally + Render) ===
BASE_URL = os.environ.get('BASE_URL', 'http://127.0.0.1:5000')

# === Database setup ===
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

# === Serve uploaded images ===
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# === Helper: Return full image URLs ===
def get_full_image_urls(image_urls_str):
    if not image_urls_str:
        return []
    urls = image_urls_str.split(',')
    return [f"{BASE_URL}{url}" for url in urls if url.strip()]

# === CAR ENDPOINTS ===
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
        'image_urls': get_full_image_urls(car.image_urls),
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
        'image_urls': get_full_image_urls(car.image_urls),
        'is_featured': car.is_featured,
        'is_sold': car.is_sold
    })

# === Image upload helper ===
def save_images(files):
    urls = []
    for file in files:
        if file and file.filename:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            urls.append(f"/uploads/{filename}")
    return ",".join(urls) if urls else None

# === ADD CAR (Admin) ===
@app.post("/cars")
def add_car():
    data = request.form
    files = request.files.getlist('images[]')
    image_urls = save_images(files) if files else None

    new_car = Car(
        make=data['make'],
        model=data['model'],
        year=int(data['year']),
        price=float(data['price']),
        mileage=int(data.get('mileage', 0)),
        condition=data.get('condition', 'Used'),
        transmission=data.get('transmission', 'Automatic'),
        fuel_type=data.get('fuel_type', 'Petrol'),
        description=data.get('description', ''),
        is_featured=data.get('is_featured') == 'true',
        is_sold=data.get('is_sold') == 'true',
        image_urls=image_urls
    )
    db.session.add(new_car)
    db.session.commit()
    return jsonify({"message": "Car added", "id": new_car.id}), 201

# === UPDATE CAR ===
@app.put("/cars/<int:id>")
def update_car(id):
    car = Car.query.get_or_404(id)
    data = request.form
    files = request.files.getlist('images[]')

    current_urls = car.image_urls.split(',') if car.image_urls else []
    new_urls = save_images(files).split(',') if files else []
    all_urls = ','.join([url for url in current_urls + new_urls if url])

    car.make = data.get('make', car.make)
    car.model = data.get('model', car.model)
    car.year = int(data.get('year', car.year))
    car.price = float(data.get('price', car.price))
    car.mileage = int(data.get('mileage', car.mileage))
    car.condition = data.get('condition', car.condition)
    car.transmission = data.get('transmission', car.transmission)
    car.fuel_type = data.get('fuel_type', car.fuel_type)
    car.description = data.get('description', car.description)
    car.is_featured = data.get('is_featured') == 'true'
    car.is_sold = data.get('is_sold') == 'true'
    if all_urls:
        car.image_urls = all_urls

    db.session.commit()
    return jsonify({"message": "Car updated"})

# === DELETE CAR ===
@app.delete("/cars/<int:id>")
def delete_car(id):
    car = Car.query.get_or_404(id)
    db.session.delete(car)
    db.session.commit()
    return jsonify({"message": "Car deleted"})

# === CONTACT FORM — NOW 100% WORKING WITH ENV VARS ===
@app.post("/send-inquiry")
def send_inquiry():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    # Secure: Read from environment variables
    YOUR_EMAIL = os.environ.get("GMAIL_USER")
    YOUR_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD")

    if not YOUR_EMAIL or not YOUR_PASSWORD:
        print("ERROR: Gmail credentials not set in environment variables")
        return jsonify({"error": "Email service not configured"}), 500

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
        print(f"SUCCESS: Inquiry email sent → {data.get('name')} ({data.get('phone')})")
        return jsonify({"message": "Inquiry sent successfully"}), 200

    except smtplib.SMTPAuthenticationError as e:
        print(f"GMAIL AUTH FAILED: {e}")
        return jsonify({"error": "Gmail login failed"}), 500
    except Exception as e:
        print(f"EMAIL SEND ERROR: {e}")
        return jsonify({"error": "Failed to send email"}), 500

# === Run server ===
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)