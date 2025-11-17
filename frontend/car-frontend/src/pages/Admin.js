// src/pages/Admin.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import AddCarForm from '../components/AddCarForm';
import CarCard from '../components/CarCard';
import EditCarModal from '../components/EditCarModal';

const Admin = () => {
  const [cars, setCars] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(true);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    if (authenticated) {
      fetchCars();
    }
  }, [authenticated]);

  const fetchCars = () => {
    axios.get('http://127.0.0.1:5000/cars')
      .then(res => setCars(res.data))
      .catch(err => console.error(err));
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === 'admin123') {  // Change this later to real auth
      setAuthenticated(true);
      setShowLoginModal(false);
    } else {
      alert('Wrong password!');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      axios.delete(`http://127.0.0.1:5000/cars/${id}`)
        .then(() => fetchCars())
        .catch(() => alert('Delete failed'));
    }
  };

  const openEditModal = (car) => {
    setSelectedCar(car);
    setShowEditModal(true);
  };

  if (!authenticated) {
    return (
      <Modal show={showLoginModal} centered>
        <Modal.Header><Modal.Title>Admin Login</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAuth}>
            <Form.Control
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3"
            />
            <Button type="submit" variant="success" className="w-100">Login</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Container className="my-5">
      <Alert variant="success">
        <h2>Admin Dashboard</h2>
        <p>Welcome! You are logged in as admin.</p>
      </Alert>

      <h3 className="mb-4">Add New Car</h3>
      <AddCarForm onAdd={fetchCars} />

      <hr className="my-5" />

      <h3>Manage Existing Cars ({cars.length})</h3>
      <Row>
        {cars.map(car => (
          <Col md={6} lg={4} key={car.id} className="mb-4">
            <CarCard car={car} />
            <div className="d-flex gap-2 mt-2">
              <Button variant="warning" size="sm" onClick={() => openEditModal(car)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(car.id)}>
                Delete
              </Button>
            </div>
          </Col>
        ))}
      </Row>

      {/* Edit Modal */}
      <EditCarModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        car={selectedCar}
        onUpdated={fetchCars}
      />
    </Container>
  );
};

export default Admin;