// src/pages/Contact.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api/api';  // ← THIS IS THE FIX

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
  }, [prefilledCar, formData.car_interest]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await axios.post(`${API_BASE}/send-inquiry`, formData);
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '', car_interest: prefilledCar });
    } catch (err) {
      console.error("Inquiry failed:", err);
      setStatus('error');
    }
  };

  // ... rest of your JSX (unchanged)
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

              {prefilledCar && <Alert variant="success">You're inquiring about: <strong>{prefilledCar}</strong></Alert>}
              {status === 'success' && <Alert variant="success">Thank you! We’ve received your inquiry.</Alert>}
              {status === 'error' && <Alert variant="danger">Failed. WhatsApp us at +254 700 123 456</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Your form fields — unchanged */}
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
                  <Form.Control name="car_interest" value={formData.car_interest} onChange={handleChange} readOnly={!!prefilledCar} />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={4} name="message" value={formData.message} onChange={handleChange} />
                </Form.Group>

                <Button variant="success" size="lg" type="submit" disabled={status === 'sending'} className="w-100">
                  {status === 'sending' ? 'Sending...' : 'Send Inquiry'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p><strong>Call / WhatsApp:</strong> +254 700 123 456</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Contact;