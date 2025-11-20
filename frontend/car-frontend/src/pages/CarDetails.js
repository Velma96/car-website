// src/pages/CarDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Carousel, Badge, Button } from 'react-bootstrap';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/cars/${id}`)
      .then(res => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Container className="py-5 text-center"><h3>Loading...</h3></Container>;
  if (!car) return <Container className="py-5 text-center"><h3>Car not found</h3></Container>;

  const images = car.image_urls && car.image_urls.length > 0
    ? car.image_urls
    : ['https://via.placeholder.com/800x600?text=No+Image+Available'];

  const carName = `${car.make} ${car.model} ${car.year}`;

  return (
    <Container className="my-5">
      <Row>
        {/* Image Gallery */}
        <Col lg={7} className="mb-4 mb-lg-0">
          <div className="position-relative">
            {car.is_sold && (
              <Badge bg="danger" className="position-absolute top-0 start-0 m-3 fs-4 px-4 py-3 z-3">
                SOLD
              </Badge>
            )}
            {car.is_featured && !car.is_sold && (
              <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-3 fs-5 px-3 py-2 z-3">
                Featured
              </Badge>
            )}

            <Carousel indicators={images.length > 1} controls={images.length > 1}>
              {images.map((url, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={`http://127.0.0.1:5000${url}`}
                    className="d-block w-100 rounded"
                    alt={`${car.make} ${car.model} ${index + 1}`}
                    style={{ height: '500px', objectFit: 'cover' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>

            {images.length > 1 && (
              <div className="mt-3 row g-2">
                {images.map((url, index) => (
                  <div className="col-3 col-md-2" key={index}>
                    <img
                      src={`http://127.0.0.1:5000${url}`}
                      className="img-fluid rounded cursor-pointer border"
                      alt={`Thumbnail ${index + 1}`}
                      style={{ height: '80px', objectFit: 'cover' }}
                      onClick={() => document.querySelector(`.carousel-indicators button[data-bs-slide-to="${index}"]`)?.click()}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* Car Info */}
        <Col lg={5}>
          <div className="ps-lg-4">
            <h1 className="display-5 fw-bold">
              {car.make} {car.model} <small className="text-muted fs-4">({car.year})</small>
            </h1>

            <h2 className="text-success fw-bold my-4">
              KES {parseFloat(car.price).toLocaleString()}
            </h2>

            <div className="bg-light p-4 rounded mb-4">
              <h4>Vehicle Details</h4>
              <table className="table table-borderless">
                <tbody>
                  <tr><td><strong>Mileage</strong></td><td>{car.mileage.toLocaleString()} km</td></tr>
                  <tr><td><strong>Condition</strong></td><td>{car.condition}</td></tr>
                  <tr><td><strong>Transmission</strong></td><td>{car.transmission}</td></tr>
                  <tr><td><strong>Fuel Type</strong></td><td>{car.fuel_type}</td></tr>
                </tbody>
              </table>
            </div>

            {car.description && (
              <div className="mb-4">
                <h4>Description</h4>
                <p className="lead">{car.description}</p>
              </div>
            )}

            <div className="d-grid gap-3">
              <Button 
                size="lg" 
                variant="success" 
                className="fw-bold"
                onClick={() => window.location.href = 'tel:+254700123456'}
              >
                Call / WhatsApp: +254 700 123 456
              </Button>

              <Button 
                size="lg" 
                variant="primary"
                className="fw-bold"
                onClick={() => navigate('/contact', { state: { carInterest: carName } })}
              >
                Send Inquiry – We’ll Call You in 10 Minutes!
              </Button>
            </div>

            <div className="mt-4">
              <Link to="/">
                <Button variant="link">Back to Inventory</Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CarDetails;