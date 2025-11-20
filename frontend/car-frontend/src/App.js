// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // We'll create this next

function App() {
  return (
    <Router>
      <div className="App">
        {/* Premium Navbar with Logo */}
        <Navbar expand="lg" className="navbar-custom shadow-sm">
          <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
  <img
    src="https://i.imgur.com/8vN9KjF.png"
    alt="Velma Car Yard Logo"
    height="50"
    className="me-3"
  />
  <span className="brand-text fw-bold">Velma Car Yard</span>
</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto fw-semibold">
                <Nav.Link as={Link} to="/" className="text-white mx-2">Home</Nav.Link>
                <Nav.Link as={Link} to="/about" className="text-white mx-2">About</Nav.Link>
                <Nav.Link as={Link} to="/contact" className="text-white mx-2">Contact</Nav.Link>
                <Nav.Link as={Link} to="/admin" className="text-primary mx-2">Admin</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        {/* Premium Footer */}
        <footer className="footer-custom py-4 mt-5">
          <Container className="text-center text-white">
            <p className="mb-1">
              <strong>Velma Car Yard</strong> • Nairobi, Kenya
            </p>
            <p className="mb-0">
              Call/WhatsApp: <strong>+254 700 123 456</strong> • Open Daily 8AM–6PM
            </p>
            <small className="text-white-50">© 2025 Velma Car Yard. All rights reserved.</small>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;

