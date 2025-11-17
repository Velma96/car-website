import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import CarCard from '../components/CarCard';
import SearchFilter from '../components/SearchFilter';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/cars').then(res => {
      setCars(res.data);
      setFilteredCars(res.data);
    });
  }, []);

  const handleSearch = ({ searchTerm, minPrice, maxPrice }) => {
    let results = cars;
    if (searchTerm) {
      results = results.filter(car => car.make.toLowerCase().includes(searchTerm.toLowerCase()) || car.model.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (minPrice) results = results.filter(car => car.price >= parseFloat(minPrice));
    if (maxPrice) results = results.filter(car => car.price <= parseFloat(maxPrice));
    setFilteredCars(results);
  };

  return (
    <Container>
      <h1 className="my-4">Welcome to Our Car Yard</h1>
      <SearchFilter onSearch={handleSearch} />
      <Row>
        {filteredCars.map(car => (
          <Col md={4} key={car.id}><CarCard car={car} /></Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;