import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const SearchFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, minPrice, maxPrice });
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row>
        <Col><Form.Control placeholder="Search by make/model" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></Col>
        <Col><Form.Control type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} /></Col>
        <Col><Form.Control type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} /></Col>
        <Col><Button type="submit" variant="primary">Filter</Button></Col>
      </Row>
    </Form>
  );
};

export default SearchFilter;