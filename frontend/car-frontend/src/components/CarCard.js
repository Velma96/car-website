import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => (
  <Card className="mb-4 shadow-sm">
    {car.image_url && <Card.Img variant="top" src={`http://127.0.0.1:5000${car.image_url}`} style={{ height: '200px', objectFit: 'cover' }} />}
    <Card.Body>
      <Card.Title>{car.make} {car.model}</Card.Title>
      <Card.Text>
        Year: {car.year} | Price: KES {car.price.toLocaleString()}<br />
        Mileage: {car.mileage} km | Condition: {car.condition}
      </Card.Text>
      <Link to={`/car/${car.id}`}><Button variant="primary">View Details</Button></Link>
    </Card.Body>
  </Card>
);

export default CarCard;