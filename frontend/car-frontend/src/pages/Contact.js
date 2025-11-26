// src/pages/Contact.js — FINAL & 100% CLEAN
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    const text = `NEW INQUIRY!\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || 'None'}\nCar: ${formData.car_interest || 'Not specified'}\nMessage: ${formData.message || 'No message'}`;

    const encoded = encodeURIComponent(text);
    const whatsappURL = `https://wa.me/254720789084?text=${encoded}`;

    window.open(whatsappURL, '_blank');

    setStatus('success');
    setFormData({ name: '', phone: '', email: '', message: '', car_interest: prefilledCar });
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
                  Opening WhatsApp... Your inquiry is being sent!
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Phone Number (WhatsApp) *</Form.Label>
                    <Form.Control name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+254 712 345 678" />
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
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  Send via WhatsApp – Instant Reply!
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p><strong>Call / WhatsApp:</strong> +254 720 789 084</p>
                <p className="text-success">You’ll get inquiries directly on your phone!</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Contact;