// src/components/AddCarForm.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AddCarForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price: '', mileage: '',
    condition: 'Used', transmission: 'Automatic', fuel_type: 'Petrol',
    description: '',
    is_featured: false,
    is_sold: false,
    images: null
  });

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, images: files }); // files = FileList
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    // Text fields
    data.append('make', formData.make);
    data.append('model', formData.model);
    data.append('year', formData.year);
    data.append('price', formData.price);
    data.append('mileage', formData.mileage || 0);
    data.append('condition', formData.condition);
    data.append('transmission', formData.transmission);
    data.append('fuel_type', formData.fuel_type);
    data.append('description', formData.description || '');
    data.append('is_featured', formData.is_featured);
    data.append('is_sold', formData.is_sold);

    // Multiple images
    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append('images[]', formData.images[i]);
      }
    }

    axios.post('http://127.0.0.1:5000/cars', data)
      .then(() => {
        onAdd();
        // Reset form
        setFormData({
          make: '', model: '', year: '', price: '', mileage: '',
          condition: 'Used', transmission: 'Automatic', fuel_type: 'Petrol',
          description: '', is_featured: false, is_sold: false, images: null
        });
      })
      .catch(err => console.error(err));
  };

  return (
    <Form onSubmit={handleSubmit} className="border p-4 rounded bg-light">
      <div className="row">
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>Make</Form.Label>
            <Form.Control name="make" value={formData.make} onChange={handleChange} required />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>Model</Form.Label>
            <Form.Control name="model" value={formData.model} onChange={handleChange} required />
          </Form.Group>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Year</Form.Label>
            <Form.Control type="number" name="year" value={formData.year} onChange={handleChange} required />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Price (KES)</Form.Label>
            <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Mileage (km)</Form.Label>
            <Form.Control type="number" name="mileage" value={formData.mileage} onChange={handleChange} />
          </Form.Group>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Condition</Form.Label>
            <Form.Select name="condition" value={formData.condition} onChange={handleChange}>
              <option>Used</option><option>New</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Transmission</Form.Label>
            <Form.Select name="transmission" value={formData.transmission} onChange={handleChange}>
              <option>Automatic</option><option>Manual</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Fuel Type</Form.Label>
            <Form.Select name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
              <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
            </Form.Select>
          </Form.Group>
        </div>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
      </Form.Group>

      {/* NEW FIELDS */}
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="Featured Car (show on homepage)"
          name="is_featured"
          checked={formData.is_featured}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="Mark as Sold"
          name="is_sold"
          checked={formData.is_sold}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Car Images (hold Ctrl/Cmd to select multiple)</Form.Label>
        <Form.Control
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleChange}
        />
      </Form.Group>

      <Button type="submit" variant="success" size="lg" className="w-100">
        Add Car
      </Button>
    </Form>
  );
};

export default AddCarForm;