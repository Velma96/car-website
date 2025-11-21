from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
import os
from pathlib import Path
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# ENHANCED CORS CONFIGURATION
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://car-website-wine.vercel.app",
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Config
BASE_URL = os.environ.get('BASE_URL', 'http://127.0.0.1:5000')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cars.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs('uploads', exist_ok=True)

db = SQLAlchemy(app)

# Car Model
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

# Serve images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

# Helper: full image URLs
def get_full_urls(urls_str):
    if not urls_str:
        return []
    return [f"{BASE_URL}{url.strip()}" for url in urls_str.split(',') if url.strip()]

# GET ALL CARS
@app.route("/cars", methods=["GET"])
def get_cars():
    try:
        cars = Car.query.all()
        return jsonify([{
            'id': c.id,
            'make': c.make,
            'model': c.model,
            'year': c.year,
            'price': c.price,
            'mileage': c.mileage,
            'condition': c.condition,
            'transmission': c.transmission,
            'fuel_type': c.fuel_type,
            'description': c.description,
            'image_urls': get_full_urls(c.image_urls),
            'is_featured': c.is_featured,
            'is_sold': c.is_sold
        } for c in cars])
    except Exception as e:
        logger.error(f"Error getting cars: {str(e)}")
        return jsonify({"error": "Failed to fetch cars"}), 500

# GET SINGLE CAR
@app.route("/cars/<int:id>", methods=["GET"])
def get_car(id):
    try:
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
            'image_urls': get_full_urls(car.image_urls),
            'is_featured': car.is_featured,
            'is_sold': car.is_sold
        })
    except Exception as e:
        logger.error(f"Error getting car {id}: {str(e)}")
        return jsonify({"error": "Car not found"}), 404

# ADD CAR (Admin)
@app.route("/cars", methods=["POST", "OPTIONS"])
def add_car():
    if request.method == "OPTIONS":
        return "", 200
        
    try:
        data = request.form
        files = request.files.getlist('images[]')
        saved_urls = []
        
        logger.info(f"Received car data: {dict(data)}")
        logger.info(f"Received {len(files)} images")
        
        for file in files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join('uploads', filename)
                file.save(file_path)
                saved_urls.append(f"/uploads/{filename}")
                logger.info(f"Saved image: {filename}")
        
        # Validate required fields
        required_fields = ['make', 'model', 'year', 'price']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        car = Car(
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
            image_urls=",".join(saved_urls) if saved_urls else ""
        )
        
        db.session.add(car)
        db.session.commit()
        
        logger.info(f"Car added successfully with ID: {car.id}")
        return jsonify({"message": "Car added successfully", "id": car.id}), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding car: {str(e)}")
        return jsonify({"error": f"Failed to add car: {str(e)}"}), 500

# UPDATE CAR
@app.route("/cars/<int:id>", methods=["PUT", "OPTIONS"])
def update_car(id):
    if request.method == "OPTIONS":
        return "", 200
        
    try:
        car = Car.query.get_or_404(id)
        data = request.form
        files = request.files.getlist('images[]')
        
        current = car.image_urls.split(',') if car.image_urls else []
        new_urls = []
        
        for f in files:
            if f and f.filename:
                fn = secure_filename(f.filename)
                f.save(os.path.join('uploads', fn))
                new_urls.append(f"/uploads/{fn}")
        
        all_urls = current + new_urls
        car.image_urls = ",".join([u for u in all_urls if u])
        
        if 'make' in data: car.make = data['make']
        if 'model' in data: car.model = data['model']
        if 'year' in data: car.year = int(data['year'])
        if 'price' in data: car.price = float(data['price'])
        if 'mileage' in data: car.mileage = int(data['mileage'])
        if 'condition' in data: car.condition = data['condition']
        if 'transmission' in data: car.transmission = data['transmission']
        if 'fuel_type' in data: car.fuel_type = data['fuel_type']
        if 'description' in data: car.description = data['description']
        if 'is_featured' in data: car.is_featured = data['is_featured'] == 'true'
        if 'is_sold' in data: car.is_sold = data['is_sold'] == 'true'
        
        db.session.commit()
        return jsonify({"message": "Car updated successfully"})
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating car {id}: {str(e)}")
        return jsonify({"error": "Failed to update car"}), 500

# DELETE CAR
@app.route("/cars/<int:id>", methods=["DELETE", "OPTIONS"])
def delete_car(id):
    if request.method == "OPTIONS":
        return "", 200
        
    try:
        car = Car.query.get_or_404(id)
        db.session.delete(car)
        db.session.commit()
        return jsonify({"message": "Car deleted successfully"})
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting car {id}: {str(e)}")
        return jsonify({"error": "Failed to delete car"}), 500

# ENHANCED CONTACT FORM with better error handling
@app.route("/send-inquiry", methods=["POST", "OPTIONS"])
def send_inquiry():
    if request.method == "OPTIONS":
        return "", 200

    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data received"}), 400
            
        logger.info("INQUIRY RECEIVED: %s", data)

        # Required fields validation
        required = ['name', 'phone']
        for field in required:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400

        email = os.environ.get("GMAIL_USER")
        password = os.environ.get("GMAIL_APP_PASSWORD")

        if not email or not password:
            logger.error("Email credentials not configured")
            # Instead of failing, log the inquiry and return success
            logger.info("INQUIRY WOULD BE SENT: %s", data)
            return jsonify({"message": "Thank you! We'll contact you soon."}), 200

        msg = MIMEMultipart()
        msg['From'] = email
        msg['To'] = email
        msg['Subject'] = f"NEW INQUIRY: {data.get('name', 'Customer')} - {data.get('phone', '')}"

        body = f"""
        NEW CUSTOMER INQUIRY!

        Name         : {data.get('name', 'N/A')}
        Phone        : {data.get('phone', 'N/A')}
        Email        : {data.get('email', 'N/A')}
        Car Interest : {data.get('car_interest', 'Not specified')}
        Message      : {data.get('message', 'None')}

        CALL NOW: {data.get('phone', 'No number')}
        """
        msg.attach(MIMEText(body, 'plain'))

        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(email, password)
            server.sendmail(email, email, msg.as_string())
            server.quit()
            logger.info("EMAIL SENT SUCCESSFULLY!")
            return jsonify({"message": "Thank you! We'll call you soon."}), 200
        except Exception as e:
            logger.error("EMAIL FAILED: %s", str(e))
            # Still return success to user, but log the error
            logger.info("INQUIRY RECEIVED (email failed): %s", data)
            return jsonify({"message": "Thank you! We'll contact you soon."}), 200

    except Exception as e:
        logger.error("INQUIRY PROCESSING ERROR: %s", str(e))
        return jsonify({"error": "Failed to process inquiry"}), 500

# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)