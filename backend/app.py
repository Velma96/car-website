from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)

# THIS FIXES CORS + MIXED CONTENT
CORS(app, resources={r"/*": {"origins": "*", "methods": "*", "allow_headers": "*"}})

# Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cars.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs('uploads', exist_ok=True)

db = SQLAlchemy(app)

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    mileage = db.Column(db.Integer, default=0)
    condition = db.Column(db.String(20), default='Used')
    transmission = db.Column(db.String(20), default='Automatic')
    fuel_type = db.Column(db.String(20), default='Petrol')
    description = db.Column(db.Text)
    image_urls = db.Column(db.Text)
    is_featured = db.Column(db.Boolean, default=False)
    is_sold = db.Column(db.Boolean, default=False)

with app.app_context():
    db.create_all()

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

# AUTO DETECT HTTPS
BASE_URL = os.environ.get('BASE_URL', 'https://velma-backend.onrender.com')

def get_full_urls(urls_str):
    if not urls_str:
        return []
    return [f"{BASE_URL}{url.strip()}" for url in urls_str.split(',') if url.strip()]

@app.get("/cars")
def get_cars():
    cars = Car.query.all()
    return jsonify([{
        'id': c.id, 'make': c.make, 'model': c.model, 'year': c.year,
        'price': c.price, 'mileage': c.mileage, 'condition': c.condition,
        'transmission': c.transmission, 'fuel_type': c.fuel_type,
        'description': c.description, 'image_urls': get_full_urls(c.image_urls),
        'is_featured': c.is_featured, 'is_sold': c.is_sold
    } for c in cars])

@app.get("/cars/<int:id>")
def get_car(id):
    car = Car.query.get_or_404(id)
    return jsonify({
        'id': car.id, 'make': car.make, 'model': car.model, 'year': car.year,
        'price': car.price, 'mileage': car.mileage, 'condition': car.condition,
        'transmission': car.transmission, 'fuel_type': car.fuel_type,
        'description': car.description, 'image_urls': get_full_urls(car.image_urls),
        'is_featured': car.is_featured, 'is_sold': car.is_sold
    })

# ADMIN: ADD CAR
@app.route("/cars", methods=["POST"])
def add_car():
    try:
        data = request.form
        files = request.files.getlist('images')
        urls = []
        for f in files:
            if f and f.filename:
                fn = secure_filename(f.filename)
                f.save(os.path.join('uploads', fn))
                urls.append(f"/uploads/{fn}")
        
        car = Car(
            make=data['make'], model=data['model'], year=int(data['year']),
            price=float(data['price']), mileage=int(data.get('mileage', 0)),
            condition=data.get('condition', 'Used'),
            transmission=data.get('transmission', 'Automatic'),
            fuel_type=data.get('fuel_type', 'Petrol'),
            description=data.get('description', ''),
            is_featured=data.get('is_featured') == 'true',
            is_sold=data.get('is_sold') == 'true',
            image_urls=",".join(urls) if urls else None
        )
        db.session.add(car)  # FIXED: Was broken before!
        db.session.commit()
        return jsonify({"message": "Car added!", "id": car.id}), 201
    except Exception as e:
        print("ADD ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

# ADMIN: UPDATE & DELETE (same fix applied)
@app.route("/cars/<int:id>", methods=["PUT", "DELETE"])
def update_or_delete_car(id):
    if request.method == "DELETE":
        car = Car.query.get_or_404(id)
        db.session.delete(car)
        db.session.commit()
        return jsonify({"message": "Deleted"})
    
    if request.method == "PUT":
        car = Car.query.get_or_404(id)
        data = request.form
        files = request.files.getlist('images')
        current = car.image_urls.split(',') if car.image_urls else []
        for f in files:
            if f and f.filename:
                fn = secure_filename(f.filename)
                f.save(os.path.join('uploads', fn))
                current.append(f"/uploads/{fn}")
        car.image_urls = ",".join([u for u in current if u])
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
        db.session.commit()
        return jsonify({"message": "Updated"})

# CONTACT FORM
@app.route("/send-inquiry", methods=["POST", "OPTIONS"])
def send_inquiry():
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.get_json()
        email = os.environ.get("GMAIL_USER")
        password = os.environ.get("GMAIL_APP_PASSWORD")
        if not email or not password:
            return jsonify({"error": "Email not set"}), 500

        msg = MIMEMultipart()
        msg['From'] = msg['To'] = email
        msg['Subject'] = f"INQUIRY: {data.get('name')} - {data.get('phone')}"
        msg.attach(MIMEText(f"Name: {data.get('name')}\nPhone: {data.get('phone')}\nCar: {data.get('car_interest')}\nMessage: {data.get('message')}", 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(email, password)
        server.sendmail(email, email, msg.as_string())
        server.quit()
        return jsonify({"message": "Sent!"}), 200
    except Exception as e:
        print("EMAIL ERROR:", str(e))
        return jsonify({"error": "Failed"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))