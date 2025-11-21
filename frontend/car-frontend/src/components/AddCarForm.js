// src/components/AddCarForm.js
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const brands = [
  "Toyota", "Nissan", "Honda", "Mercedes", "BMW",
  "Subaru", "Mazda", "Isuzu", "Volkswagen", "Land Rover",
  "Mitsubishi", "Suzuki", "Ford", "Hyundai", "Kia"
];

const AddCarForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price: '', mileage: '',
    condition: 'Used', transmission: 'Automatic', fuel_type: 'Petrol',
    description: '', is_featured: false, is_sold: false, images: null
  });
  const [status, setStatus] = useState(''); // 'success', 'error', 'loading'
  const [message, setMessage] = useState('');

  // Use environment variable for API URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://velma-backend.onrender.com';

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Adding car to inventory...');

    try {
      const data = new FormData();
      
      // Append all form data
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

      // Append images if available
      if (formData.images) {
        for (let i = 0; i < formData.images.length; i++) {
          data.append('images[]', formData.images[i]);
        }
      }

      const response = await axios.post(`${API_URL}/cars`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      // Success
      setStatus('success');
      setMessage('Car added successfully!');
      
      // Reset form
      setFormData({
        make: '', model: '', year: '', price: '', mileage: '',
        condition: 'Used', transmission: 'Automatic', fuel_type: 'Petrol',
        description: '', is_featured: false, is_sold: false, images: null
      });
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Call parent callback to refresh car list
      if (onAdd) onAdd();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus('');
        setMessage('');
      }, 5000);

    } catch (err) {
      console.error('Add car error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setStatus('error');
        setMessage('Network error: Cannot connect to server. Please check your internet connection and ensure the backend is running.');
      } else if (err.response) {
        // Server responded with error status
        setStatus('error');
        setMessage(`Server error: ${err.response.data.error || 'Failed to add car'}`);
      } else {
        setStatus('error');
        setMessage('Failed to add car. Please try again.');
      }
      
      // Clear error message after 8 seconds
      setTimeout(() => {
        setStatus('');
        setMessage('');
      }, 8000);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="border p-4 rounded bg-light">
      <h4 className="mb-4">Add New Car to Inventory</h4>
      
      {/* Status Alerts */}
      {status === 'success' && (
        <Alert variant="success" className="mb-3">
          <strong>Success!</strong> {message}
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert variant="danger" className="mb-3">
          <strong>Error!</strong> {message}
        </Alert>
      )}
      
      {status === 'loading' && (
        <Alert variant="info" className="mb-3 d-flex align-items-center">
          <Spinner animation="border" size="sm" className="me-2" />
          {message}
        </Alert>
      )}

      <div className="row">
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>Make (Brand) *</Form.Label>
            <Form.Select 
              name="make" 
              value={formData.make} 
              onChange={handleChange} 
              required
              disabled={status === 'loading'}
            >
              <option value="">Choose brand...</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>Model *</Form.Label>
            <Form.Control 
              name="model" 
              value={formData.model} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Harrier, X-Trail, Axio"
              disabled={status === 'loading'}
            />
          </Form.Group>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Year *</Form.Label>
            <Form.Control 
              type="number" 
              name="year" 
              value={formData.year} 
              onChange={handleChange} 
              required 
              placeholder="2020"
              min="1990"
              max="2024"
              disabled={status === 'loading'}
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Price (KES) *</Form.Label>
            <Form.Control 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              required 
              placeholder="2500000"
              min="0"
              step="1000"
              disabled={status === 'loading'}
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Mileage (km)</Form.Label>
            <Form.Control 
              type="number" 
              name="mileage" 
              value={formData.mileage} 
              onChange={handleChange} 
              placeholder="85000"
              min="0"
              disabled={status === 'loading'}
            />
          </Form.Group>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Condition</Form.Label>
            <Form.Select 
              name="condition" 
              value={formData.condition} 
              onChange={handleChange}
              disabled={status === 'loading'}
            >
              <option>Used</option>
              <option>New</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Transmission</Form.Label>
            <Form.Select 
              name="transmission" 
              value={formData.transmission} 
              onChange={handleChange}
              disabled={status === 'loading'}
            >
              <option>Automatic</option>
              <option>Manual</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group className="mb-3">
            <Form.Label>Fuel Type</Form.Label>
            <Form.Select 
              name="fuel_type" 
              value={formData.fuel_type} 
              onChange={handleChange}
              disabled={status === 'loading'}
            >
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </Form.Select>
          </Form.Group>
        </div>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control 
          as="textarea" 
          rows={3} 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Sunroof, leather seats, reverse camera..."
          disabled={status === 'loading'}
        />
      </Form.Group>

      <div className="row">
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Check 
              type="checkbox" 
              label="Featured Car (show on homepage)" 
              name="is_featured" 
              checked={formData.is_featured} 
              onChange={handleChange}
              disabled={status === 'loading'}
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Check 
              type="checkbox" 
              label="Mark as Sold" 
              name="is_sold" 
              checked={formData.is_sold} 
              onChange={handleChange}
              disabled={status === 'loading'}
            />
          </Form.Group>
        </div>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Car Images (hold Ctrl/Cmd to select multiple)</Form.Label>
        <Form.Control 
          type="file" 
          name="images" 
          multiple 
          accept="image/*" 
          onChange={handleChange}
          disabled={status === 'loading'}
        />
        <Form.Text className="text-muted">
          {formData.images ? `${formData.images.length} image(s) selected` : 'No images selected'}
        </Form.Text>
      </Form.Group>

      <Button 
        type="submit" 
        variant="success" 
        size="lg" 
        className="w-100"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Adding Car...
          </>
        ) : (
          'Add Car to Inventory'
        )}
      </Button>
    </Form>
  );
};

export default AddCarForm;