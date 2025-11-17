import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Car Yard Kenya</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
              <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <footer className="bg-dark text-white text-center py-3 mt-4">
        &copy; 2025 Car Yard Kenya. All rights reserved.
      </footer>
    </Router>
  );
}

export default App;

