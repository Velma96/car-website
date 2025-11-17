import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, ListGroup } from 'react-bootstrap';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/cars/${id}`).then(res => setCar(res.data));
  }, [id]);

  if (!car) return <p>Loading...</p>;

  return (
    <Container>
      <Card className="my-4">
        {car.image_url && <Card.Img variant="top" src={`http://127.0.0.1:5000${car.image_url}`} />}
        <Card.Body>
          <Card.Title>{car.make} {car.model} ({car.year})</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>Price: KES {car.price.toLocaleString()}</ListGroup.Item>
            <ListGroup.Item>Mileage: {car.mileage} km</ListGroup.Item>
            <ListGroup.Item>Condition: {car.condition}</ListGroup.Item>
            <ListGroup.Item>Transmission: {car.transmission}</ListGroup.Item>
            <ListGroup.Item>Fuel Type: {car.fuel_type}</ListGroup.Item>
            <ListGroup.Item>Description: {car.description}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CarDetails;