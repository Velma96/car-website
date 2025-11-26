// src/pages/Home.js — FINAL, CLEAN & DEPLOY-READY
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CarCard from '../components/CarCard';
import SearchFilter from '../components/SearchFilter';

// Full brands array — unchanged
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
  const navigate = useNavigate();
  const [allCars, setAllCars] = useState([]);
  const [displayCars, setDisplayCars] = useState([]);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://velma-backend.onrender.com';

  useEffect(() => {
    axios.get(`${API_URL}/cars`)
      .then(res => {
        const activeCars = res.data.filter(car => !car.is_sold);
        setAllCars(activeCars);
        setDisplayCars(activeCars);
        setFeaturedCars(activeCars.filter(car => car.is_featured).slice(0, 8));
      })
      .catch(err => console.error("Failed to load cars:", err));
  }, [API_URL]); // ← Fixed: API_URL is now in dependencies

  const filterByBrand = (brand) => {
    setSelectedBrand(brand);
    if (!brand) setDisplayCars(allCars);
    else setDisplayCars(allCars.filter(car => car.make.toLowerCase() === brand.toLowerCase()));
    document.getElementById('collection-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = ({ searchTerm, minPrice, maxPrice }) => {
    let filtered = allCars;
    if (searchTerm) filtered = filtered.filter(car => `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase()));
    if (minPrice) filtered = filtered.filter(car => car.price >= parseInt(minPrice));
    if (maxPrice) filtered = filtered.filter(car => car.price <= parseInt(maxPrice));
    setDisplayCars(filtered);
  };

  return (
    <>
      <section className="hero-light" style={{ paddingTop: '120px' }}>
        <Container className="h-100">
          <Row className="h-100 align-items-center">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="hero-title-light">The Art Of Driving</h1>
              <p className="hero-subtitle-light">
                Experience curated luxury. Our exclusive collection features the world's finest automobiles,
                each meticulously selected and maintained to the highest standards.
              </p>
              <div className="mt-5">
                <Button 
                  size="lg" 
                  className="btn-explore-light me-4"
                  onClick={() => document.getElementById('collection-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Collection
                </Button>
                <Button 
                  size="lg" 
                  variant="outline-dark" 
                  className="btn-learn-light"
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              {featuredCars.length > 0 ? (
                <Carousel fade controls={false} indicators={false} interval={4000} pause={false}>
                  {featuredCars.map(car => (
                    <Carousel.Item key={car.id}>
                      <div className="hero-car-wrapper">
                        <img src={car.image_urls?.[0]} alt={`${car.make} ${car.model}`} className="hero-car-img" />
                        <div className="hero-car-caption">
                          <h4>{car.make} {car.model} {car.year}</h4>
                          <p className="fw-bold">KES {parseFloat(car.price).toLocaleString()}</p>
                        </div>
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <div className="hero-car-placeholder">
                  <img src="https://images.unsplash.com/photo-1544636331-6035f89e13d8?q=80&w=2940" alt="Luxury" className="hero-car-img" />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Browse by Brand</h2>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button variant={selectedBrand === null ? "dark" : "outline-dark"} className="px-4" onClick={() => filterByBrand(null)}>
              All Brands
            </Button>
            {brands.map(brand => (
              <Button
                key={brand.name}
                variant={selectedBrand === brand.name ? "dark" : "outline-secondary"}
                className="d-flex flex-column align-items-center p-3 brand-btn"
                onClick={() => filterByBrand(brand.name)}
                style={{ width: '130px', height: '130px' }}
              >
                {brand.logo}
                <small className="mt-1 fw-bold">{brand.name}</small>
              </Button>
            ))}
          </div>
        </Container>
      </section>

      <section id="collection-section" className="py-5 bg-white">
        <Container>
          <h2 className="mb-4 text-center">
            {selectedBrand ? `${selectedBrand} Cars` : 'Our Collection'} ({displayCars.length})
          </h2>
          <SearchFilter onSearch={handleSearch} />
          <Row>
            {displayCars.length === 0 ? (
              <Col className="text-center py-5">
                <h3>No cars found</h3>
                <p>Try adjusting your filters.</p>
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
      </section>
    </>
  );
};

export default Home;