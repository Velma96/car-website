import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import AddCarForm from '../components/AddCarForm';
import CarCard from '../components/CarCard';  // Reuse for list

const Admin = () => {
  const [cars, setCars] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (authenticated) {
      axios.get('http://127.0.0.1:5000/cars').then(res => setCars(res.data));
    }
  }, [authenticated]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === 'admin123') {  // Replace with secure auth later
      setAuthenticated(true);
      setShowModal(false);
    } else {
      alert('Incorrect password');
    }
  };

  const handleAdd = () => {
    axios.get('http://127.0.0.1:5000/cars').then(res => setCars(res.data));
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:5000/cars/${id}`).then(() => {
      setCars(cars.filter(car => car.id !== id));
    });
  };

  if (!authenticated) {
    return (
      <Modal show={showModal} onHide={() => {}}>
        <Modal.Header><Modal.Title>Admin Login</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAuth}>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" className="mt-2">Login</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Container>
      <h1 className="my-4">Admin Dashboard</h1>
      <AddCarForm onAdd={handleAdd} />
      <h2 className="mt-4">Manage Cars</h2>
      {cars.map(car => (
        <div className="row">
        {cars.map(car => (
          <div className="col-md-6 mb-4" key={car.id}>
            <CarCard car={car} />
            <button 
              className="btn btn-danger btn-sm mt-2" 
              onClick={() => handleDelete(car.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      ))}
    </Container>
  );
};

export default Admin;