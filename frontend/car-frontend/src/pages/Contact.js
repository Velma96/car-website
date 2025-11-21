// src/pages/Contact.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Contact = () => {
  const location = useLocation();
  const prefilledCar = location.state?.carInterest || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    car_interest: '',
    message: ''
  });

  const [status, setStatus] = useState(null);

  // Use environment variable — works locally AND on live site
  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

  // Auto-fill car name — safe & clean
  useEffect(() => {
    if (prefilledCar && !formData.car_interest) {
      setFormData(prev => ({ ...prev, car_interest: prefilledCar }));
    }
  }, [prefilledCar, formData.car_interest]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await axios.post(`${API_URL}/send-inquiry`, formData);
      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        car_interest: prefilledCar, // Keep the car name after success
        message: ''
      });
    } catch (err) {
      console.error("Inquiry failed:", err);
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
                  Something went wrong. Please WhatsApp us directly at +254 700 123 456
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Phone Number (WhatsApp) *</Form.Label>
                    <Form.Control
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Email (optional)</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Car You're Interested In</Form.Label>
                  <Form.Control
                    name="car_interest"
                    value={formData.car_interest}
                    onChange={handleChange}
                    placeholder="e.g. Toyota Harrier 2018"
                    style={prefilledCar ? { backgroundColor: '#e8f5e8', fontWeight: 'bold' } : {}}
                    readOnly={!!prefilledCar}
                  />
                  {prefilledCar && (
                    <Form.Text className="text-success">
                      Auto-filled from car page
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message (optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us your budget or questions..."
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="success"
                    size="lg"
                    type="submit"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Inquiry – We’ll Call You!'}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-2">
                  <strong>Call / WhatsApp:</strong> +254 700 123 456
                </p>
                <p className="text-muted">
                  Open Mon–Sat: 8AM–6PM | Sun: 10AM–4PM
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Contact;