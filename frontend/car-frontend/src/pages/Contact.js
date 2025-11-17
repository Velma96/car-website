import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const Contact = () => (
  <Container className="my-4">
    <h1>Contact Us</h1>
    <Form>
      <Form.Group><Form.Label>Name</Form.Label><Form.Control /></Form.Group>
      <Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" /></Form.Group>
      <Form.Group><Form.Label>Message</Form.Label><Form.Control as="textarea" /></Form.Group>
      <Button type="submit" variant="primary">Send</Button>
    </Form>
  </Container>
);

export default Contact;