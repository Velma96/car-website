// src/pages/ScheduleVisit.js — LUXURY BOOKING PAGE
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const ScheduleVisit = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferred_date: '',
    preferred_time: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const text = `NEW VISIT REQUEST!\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || '—'}\nDate: ${formData.preferred_date}\nTime: ${formData.preferred_time}\nMessage: ${formData.message || 'None'}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/254720789084?text=${encoded}`, '_blank');
    
    alert('Thank you! We’ll confirm your visit within 10 minutes');
    setFormData({ name: '', phone: '', email: '', preferred_date: '', preferred_time: '', message: '' });
  };

  return (
    <section className="py-5" style={{ paddingTop: '140px', minHeight: '100vh', background: '#f8f9fa' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold mb-3">Schedule Your Private Viewing</h1>
              <p className="lead text-muted">
                Experience our collection in person. Book a one-on-one appointment at our showroom.
              </p>
            </div>

            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-4">
                      <Form.Label className="fw-bold">Full Name *</Form.Label>
                      <Form.Control
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Label className="fw-bold">Phone (WhatsApp) *</Form.Label>
                      <Form.Control
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+254 712 345 678"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-4">
                      <Form.Label className="fw-bold">Email (optional)</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                      />
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Label className="fw-bold">Preferred Date *</Form.Label>
                      <Form.Control
                        name="preferred_date"
                        type="date"
                        value={formData.preferred_date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-4">
                      <Form.Label className="fw-bold">Preferred Time *</Form.Label>
                      <Form.Select
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Choose time</option>
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                        <option>2:00 PM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                        <option>5:00 PM</option>
                      </Form.Select>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Label className="fw-bold">Any Specific Car?</Form.Label>
                      <Form.Control
                        name="message"
                        as="textarea"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="e.g. Interested in the white Mercedes GLE..."
                      />
                    </Col>
                  </Row>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      size="lg" 
                      style={{ 
                        background: '#d4af37', 
                        border: 'none', 
                        padding: '1rem 4rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Confirm Appointment via WhatsApp
                    </Button>
                  </div>

                  <div className="text-center mt-4 text-muted">
                    <p>Or call directly: <strong>+254 720 789 084</strong></p>
                    <small>We reply instantly • 7 days a week</small>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ScheduleVisit;