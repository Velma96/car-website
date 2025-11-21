import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';

const CarCard = ({ car }) => {
  const images = car.image_urls && car.image_urls.length > 0 
    ? car.image_urls 
    : ['https://via.placeholder.com/300x200?text=No+Image'];

  return (
    <Card className="mb-4 shadow-sm position-relative">
      {car.is_sold && (
        <div className="position-absolute top-0 start-0 p-3">
          <span className="badge bg-danger fs-5">SOLD</span>
        </div>
      )}
      {car.is_featured && (
        <div className="position-absolute top-0 end-0 p-3">
          <span className="badge bg-warning text-dark">Featured</span>
        </div>
      )}

      <Carousel>
        {images.map((url, i) => (
          <Carousel.Item key={i}>
            <img 
              src={url}  // ← Direct full URL from backend
              className="d-block w-100" 
              alt={`${car.make} ${car.model} ${i + 1}`}
              style={{ height: '200px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <Card.Body>
        <Card.Title>{car.make} {car.model}</Card.Title>
        <Card.Text>
          <strong>KES {car.price.toLocaleString()}</strong><br/>
          {car.year} • {car.mileage.toLocaleString()} km • {car.condition}
        </Card.Text>
        <Link to={`/car/${car.id}`}>
          <Button variant="primary" className="w-100">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CarCard;