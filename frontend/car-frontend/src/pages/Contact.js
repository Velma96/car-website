// src/pages/Contact.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api/api';  // THIS IS THE MAGIC LINE

const Contact = () => {
  const location = useLocation();
  const prefilledCar = location.state?.carInterest || '';

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', car_interest: '', message: ''
  });

  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (prefilledCar && !formData.car_interest) {
      setFormData(prev => ({ ...prev, car_interest: prefilledCar }));
    }
  }, [prefilledCar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await axios.post(`${API_BASE}/send-inquiry`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '', car_interest: prefilledCar });
    } catch (err) {
      console.error("Inquiry failed:", err.response || err);
      setStatus('error');
    }
  };

  return (
    <Container className="my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-5">
                <h1 className="display-5 fw-bold">Get in Touch</h1>
                <p className="lead text-muted">
                  Interested in any vehicle? Leave your details and we’ll call you within 10 minutes!
                </p>
              </div>

              {prefilledCar && (
                <Alert variant="success" className="mb-4">
                  You're inquiring about: <strong>{prefilledCar}</strong>
                </Alert>
              )}

              {status === 'success' && (
                <Alert variant="success" className="mb-4">
                  Thank you! We’ve received your inquiry and will call you shortly.
                </Alert>
              )}

              {status === 'error' && (
                <Alert variant="danger" className="mb-4">
                  Failed to send. Please WhatsApp us at +254 720 789 084
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Email (optional)</Form.Label>
                  <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Car You're Interested In</Form.Label>
                  <Form.Control 
                    name="car_interest" 
                    value={formData.car_interest} 
                    onChange={handleChange} 
                    readOnly={!!prefilledCar}
                    style={prefilledCar ? { backgroundColor: '#e8f5e8', fontWeight: 'bold' } : {}}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message (optional)</Form.Label>
                  <Form.Control as="textarea" rows={4} name="message" value={formData.message} onChange={handleChange} />
                </Form.Group>

                <Button 
                  variant="success" 
                  size="lg" 
                  type="submit" 
                  disabled={status === 'sending'}
                  className="w-100"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Inquiry – We’ll Call You!'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p><strong>Call / WhatsApp:</strong> +254 720 789 084</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Contact;