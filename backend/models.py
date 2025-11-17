# backend/models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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
    description = db.Column(db.Text, nullable=True)
    
    # NEW FIELDS
    is_featured = db.Column(db.Boolean, default=False)
    is_sold = db.Column(db.Boolean, default=False)
    image_urls = db.Column(db.Text, nullable=True)  # Store as comma-separated string