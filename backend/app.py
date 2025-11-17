from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
#from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "cars.db"
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)  # Create uploads folder

from models import db, Car  # Import after app config
db.init_app(app)

with app.app_context():
    db.create_all()  # Create DB tables if not exist

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.get("/cars")
def get_cars():
    cars = Car.query.all()
    return jsonify([{
        'id': car.id, 'make': car.make, 'model': car.model, 'year': car.year,
        'price': car.price, 'mileage': car.mileage, 'condition': car.condition,
        'transmission': car.transmission, 'fuel_type': car.fuel_type,
        'description': car.description, 'image_url': car.image_url
    } for car in cars])

@app.get("/cars/<int:id>")
def get_car(id):
    car = Car.query.get_or_404(id)
    return jsonify({
        'id': car.id, 'make': car.make, 'model': car.model, 'year': car.year,
        'price': car.price, 'mileage': car.mileage, 'condition': car.condition,
        'transmission': car.transmission, 'fuel_type': car.fuel_type,
        'description': car.description, 'image_url': car.image_url
    })

@app.post("/cars")
def add_car():
    data = request.form
    image = request.files.get('image')
    image_url = None
    if image:
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        image_url = f"/uploads/{filename}"

    new_car = Car(
        make=data['make'], model=data['model'], year=int(data['year']),
        price=float(data['price']), mileage=int(data.get('mileage', 0)),
        condition=data.get('condition', 'Used'), transmission=data.get('transmission', 'Automatic'),
        fuel_type=data.get('fuel_type', 'Petrol'), description=data.get('description'),
        image_url=image_url
    )
    db.session.add(new_car)
    db.session.commit()
    return jsonify({"message": "Car added", "car": new_car.id}), 201

@app.put("/cars/<int:id>")
def update_car(id):
    car = Car.query.get_or_404(id)
    data = request.form
    image = request.files.get('image')
    if image:
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        car.image_url = f"/uploads/{filename}"

    car.make = data.get('make', car.make)
    car.model = data.get('model', car.model)
    car.year = int(data.get('year', car.year))
    car.price = float(data.get('price', car.price))
    car.mileage = int(data.get('mileage', car.mileage))
    car.condition = data.get('condition', car.condition)
    car.transmission = data.get('transmission', car.transmission)
    car.fuel_type = data.get('fuel_type', car.fuel_type)
    car.description = data.get('description', car.description)
    db.session.commit()
    return jsonify({"message": "Car updated"})

@app.delete("/cars/<int:id>")
def delete_car(id):
    car = Car.query.get_or_404(id)
    db.session.delete(car)
    db.session.commit()
    return jsonify({"message": "Car deleted"})

if __name__ == "__main__":
    app.run(debug=True)