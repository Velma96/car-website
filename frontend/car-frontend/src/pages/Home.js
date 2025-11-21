// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import CarCard from '../components/CarCard';
import SearchFilter from '../components/SearchFilter';

// ALL BRAND LOGOS (restored exactly as before)
const brands = [
  { name: 'Toyota', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="#C3002F" strokeWidth="5"/><circle cx="50" cy="50" r="30" fill="none" stroke="#C3002F" strokeWidth="5"/><circle cx="50" cy="50" r="20" fill="none" stroke="#C3002F" strokeWidth="5"/><text x="50" y="58" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#C3002F">TOYOTA</text></svg> },
  { name: 'Nissan', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="35" width="70" height="30" rx="15" fill="#C3002F"/><text x="50" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">NISSAN</text></svg> },
  { name: 'Honda', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M25 25 L50 75 L75 25 Z" fill="none" stroke="#E60012" strokeWidth="7"/><text x="50" y="90" textAnchor="middle" fontSize="12" fill="#E60012" fontWeight="bold">HONDA</text></svg> },
  { name: 'Mercedes', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="#00A19C" strokeWidth="6"/><path d="M50 10 L50 90 M25 35 L75 65 M75 35 L25 65" stroke="#00A19C" strokeWidth="6"/></svg> },
  { name: 'BMW', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="#0066B1" strokeWidth="7"/><path d="M30 30 L50 50 L30 70 Z M70 30 L50 50 L70 70 Z" fill="#0066B1"/></svg> },
  { name: 'Subaru', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="30" width="60" height="40" rx="20" fill="#0033A0"/><text x="50" y="55" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">SUBARU</text></svg> },
  { name: 'Mazda', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20 50 Q50 10 80 50 Q50 90 20 50 Z" fill="#B71C1C"/><text x="50" y="58" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">MAZDA</text></svg> },
  { name: 'Isuzu', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="35" width="50" height="30" rx="10" fill="#D32F2F"/><text x="50" y="55" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">ISUZU</text></svg> },
  { name: 'Volkswagen', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="#001E50" strokeWidth="7"/><text x="50" y="60" textAnchor="middle" fontSize="20" fill="#001E50" fontWeight="bold">V</text><text x="50" y="80" textAnchor="middle" fontSize="20" fill="#001E50" fontWeight="bold">W</text></svg> },
  { name: 'Land Rover', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="35" width="70" height="30" rx="15" fill="#006400"/><text x="50" y="55" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">LAND ROVER</text></svg> },
  { name: 'Mitsubishi', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 L70 70 L30 70 Z" fill="#E60012"/><path d="M50 80 L70 30 L30 30 Z" fill="#E60012"/></svg> },
  { name: 'Suzuki', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50" y="65" textAnchor="middle" fontSize="45" fill="#D32F2F" fontWeight="bold">S</text></svg> },
  { name: 'Ford', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="40" ry="25" fill="#1C3A70"/><text x="50" y="55" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">FORD</text></svg> },
  { name: 'Hyundai', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="38" ry="30" fill="none" stroke="#002C5F" strokeWidth="7"/><text x="50" y="55" textAnchor="middle" fontSize="12" fill="#002C5F" fontWeight="bold">HYUNDAI</text></svg> },
  { name: 'Kia', logo: <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="40" ry="28" fill="#BB162B"/><text x="50" y="55" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">KIA</text></svg> }
];

const Home = () => {
  const [cars, setCars] = useState([]);
  const [displayCars, setDisplayCars] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    axios.get(`${API_URL}/cars`)
      .then(res => {
        const activeCars = res.data.filter(car => !car.is_sold);
        setCars(activeCars);
        setDisplayCars(activeCars);
      })
      .catch(err => console.error("Failed to load cars:", err));
  }, [API_URL]);

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

      {/* Featured Carousel */}
      {featuredCars.length > 0 && (
        <>
          <h2 className="text-center mb-5 fw-bold text-primary">Featured Vehicle</h2>
          <Carousel className="mb-5 shadow-lg rounded">
            {featuredCars.map(car => (
              <Carousel.Item key={car.id}>
                <img
                  src={car.image_urls?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
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

      {/* BROWSE BY BRAND – FULLY RESTORED */}
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

      {/* Car List */}
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