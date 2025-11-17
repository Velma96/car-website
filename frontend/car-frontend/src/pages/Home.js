// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import CarCard from '../components/CarCard';
import SearchFilter from '../components/SearchFilter';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/cars')
      .then(res => {
        setCars(res.data);
        setFilteredCars(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = ({ searchTerm, minPrice, maxPrice }) => {
    let results = cars;

    if (searchTerm) {
      results = results.filter(car =>
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (minPrice) results = results.filter(car => car.price >= parseFloat(minPrice));
    if (maxPrice) results = results.filter(car => car.price <= parseFloat(maxPrice));

    setFilteredCars(results);
  };

  // Featured cars (not sold)
  const featuredCars = cars.filter(car => car.is_featured && !car.is_sold);

  // Available cars (not sold)
  const availableCars = filteredCars.filter(car => !car.is_sold);

  return (
    <Container className="my-5">
      {/* Featured Carousel */}
      {featuredCars.length > 0 && (
        <>
          <h2 className="text-center mb-5 fw-bold">Featured Vehicles</h2>
          <Carousel className="mb-5 shadow-lg rounded">
            {featuredCars.map(car => (
              <Carousel.Item key={car.id}>
                <img
                  src={`http://127.0.0.1:5000${car.image_urls?.[0] || '/placeholder.jpg'}`}
                  className="d-block w-100"
                  alt={`${car.make} ${car.model}`}
                  style={{ height: '500px', objectFit: 'cover' }}
                />
                <Carousel.Caption className="bg-dark bg-opacity-80 rounded p-4">
                  <h3 className="display-5 fw-bold">{car.make} {car.model} ({car.year})</h3>
                  <p className="fs-4 mb-0">
                    KES {car.price.toLocaleString()} • {car.mileage.toLocaleString()} km
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </>
      )}

      {/* Main Inventory */}
      <h1 className="mb-4">Available Cars ({availableCars.length})</h1>
      <SearchFilter onSearch={handleSearch} />

      {availableCars.length === 0 ? (
        <div className="text-center py-5">
          <h3>No cars match your search</h3>
        </div>
      ) : (
        <Row>
          {availableCars.map(car => (
            <Col xs={12} md={6} lg={4} key={car.id} className="mb-4">
              <CarCard car={car} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;