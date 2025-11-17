from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    mileage = db.Column(db.Integer, default=0)
    condition = db.Column(db.String(20), default='Used')  # e.g., 'New', 'Used'
    transmission = db.Column(db.String(20), default='Automatic')
    fuel_type = db.Column(db.String(20), default='Petrol')
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)  # Path to main image