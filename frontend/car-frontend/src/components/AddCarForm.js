import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AddCarForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price: '', mileage: '', condition: 'Used',
    transmission: 'Automatic', fuel_type: 'Petrol', description: '', image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    axios.post('http://127.0.0.1:5000/cars', data)
      .then(() => {
        onAdd();
        setFormData({ make: '', model: '', year: '', price: '', mileage: '', condition: 'Used', transmission: 'Automatic', fuel_type: 'Petrol', description: '', image: null });
      })
      .catch(err => console.error(err));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group><Form.Label>Make</Form.Label><Form.Control name="make" value={formData.make} onChange={handleChange} required /></Form.Group>
      <Form.Group><Form.Label>Model</Form.Label><Form.Control name="model" value={formData.model} onChange={handleChange} required /></Form.Group>
      <Form.Group><Form.Label>Year</Form.Label><Form.Control type="number" name="year" value={formData.year} onChange={handleChange} required /></Form.Group>
      <Form.Group><Form.Label>Price (KES)</Form.Label><Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required /></Form.Group>
      <Form.Group><Form.Label>Mileage (km)</Form.Label><Form.Control type="number" name="mileage" value={formData.mileage} onChange={handleChange} /></Form.Group>
      <Form.Group><Form.Label>Condition</Form.Label><Form.Select name="condition" value={formData.condition} onChange={handleChange}><option>Used</option><option>New</option></Form.Select></Form.Group>
      <Form.Group><Form.Label>Transmission</Form.Label><Form.Select name="transmission" value={formData.transmission} onChange={handleChange}><option>Automatic</option><option>Manual</option></Form.Select></Form.Group>
      <Form.Group><Form.Label>Fuel Type</Form.Label><Form.Select name="fuel_type" value={formData.fuel_type} onChange={handleChange}><option>Petrol</option><option>Diesel</option><option>Electric</option></Form.Select></Form.Group>
      <Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} /></Form.Group>
      <Form.Group><Form.Label>Image</Form.Label><Form.Control type="file" name="image" onChange={handleChange} /></Form.Group>
      <Button type="submit" variant="success" className="mt-3">Add Car</Button>
    </Form>
  );
};

export default AddCarForm;