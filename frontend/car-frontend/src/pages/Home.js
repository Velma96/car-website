// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import CarCard from '../components/CarCard';
import SearchFilter from '../components/SearchFilter';

// ... your brands SVG array stays the same ...

const Home = () => {
  const [cars, setCars] = useState([]);
  const [displayCars, setDisplayCars] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    axios.get('https://velma-backend.onrender.com/cars')  // ← Your Render backend
      .then(res => {
        const activeCars = res.data.filter(car => !car.is_sold);
        setCars(activeCars);
        setDisplayCars(activeCars);
      })
      .catch(err => console.error("Failed to load cars:", err));
  }, []);

  const filterByBrand = (brand) => {
    setSelectedBrand(brand);
    if (!brand) {
      setDisplayCars(cars);
    } else {
      setDisplayCars(cars.filter(car => car.make.toLowerCase() === brand.toLowerCase()));
    }
  };

  const featuredCars = cars.filter(car => car.is_featured && !car.is_sold);

  return (
    <Container className="my-5">
      {featuredCars.length > 0 && (
        <>
          <h2 className="text-center mb-5 fw-bold text-primary">Featured Vehicle</h2>
          <Carousel className="mb-5 shadow-lg rounded">
            {featuredCars.map(car => (
              <Carousel.Item key={car.id}>
                <img
                  src={car.image_urls?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'}  // ← Direct URL
                  className="d-block w-100"
                  alt={`${car.make} ${car.model}`}
                  style={{ height: '500px', objectFit: 'cover' }}
                />
                <Carousel.Caption className="bg-dark bg-opacity-80 rounded p-4">
                  <h3 className="display-5 fw-bold">{car.make} {car.model}</h3>
                  <p className="fs-3 text-white">KES {car.price.toLocaleString()}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </>
      )}

      {/* BROWSE BY BRAND */}
      <div className="text-center my-5 py-5 bg-light rounded shadow-sm">
        <h2 className="mb-4 fw-bold text-primary">Browse by Brand</h2>
        <div className="d-flex flex-wrap justify-content-center gap-4">
          <Button
            variant={selectedBrand === null ? "primary" : "outline-secondary"}
            className="p-3"
            onClick={() => filterByBrand(null)}
          >
            <strong>All Brands</strong>
          </Button>

          {brands.map(brand => (
            <Button
              key={brand.name}
              variant={selectedBrand === brand.name ? "primary" : "outline-primary"}
              className="d-flex flex-column align-items-center justify-content-center p-3 rounded shadow-sm brand-btn"
              onClick={() => filterByBrand(brand.name)}
              style={{ width: '130px', height: '130px', borderWidth: '2px' }}
            >
              {brand.logo}
              <small className="mt-1 fw-bold">{brand.name}</small>
            </Button>
          ))}
        </div>
      </div>

      <h1 className="mb-4 text-center">
        {selectedBrand ? `${selectedBrand} Cars` : 'All Available Cars'} ({displayCars.length})
      </h1>
      <SearchFilter onSearch={() => {}} />

      <Row>
        {displayCars.length === 0 ? (
          <Col className="text-center py-5">
            <h3>No {selectedBrand || 'cars'} in stock right now</h3>
            <p>New stock arrives daily — check back soon!</p>
          </Col>
        ) : (
          displayCars.map(car => (
            <Col xs={12} md={6} lg={4} key={car.id} className="mb-4">
              <CarCard car={car} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Home;