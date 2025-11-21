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
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">

        {/* PREMIUM NAVBAR WITH VELMA LOGO */}
        <Navbar expand="lg" className="navbar-custom shadow-lg" sticky="top">
          <Container>
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
              <img
                src="/velma.png"                     // ← This works perfectly from public folder
                alt="Velma Car Yard Logo"
                height="55"
                width="55"
                className="me-3 rounded-circle shadow-sm logo-img"
                style={{ objectFit: 'cover', border: '3px solid #0066cc' }}
              />
              <div>
                <span className="brand-title fw-bold d-block">Velma Car Yard</span>
                <small className="text-muted fw-medium">Premium Cars • Nairobi</small>
              </div>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center fw-semibold">
                <Nav.Link as={Link} to="/" className="nav-link-custom mx-2">Home</Nav.Link>
                <Nav.Link as={Link} to="/about" className="nav-link-custom mx-2">About</Nav.Link>
                <Nav.Link as={Link} to="/contact" className="nav-link-custom mx-2">Contact</Nav.Link>
                <Nav.Link as={Link} to="/admin" className="nav-link-admin mx-2">Admin</Nav.Link>

                {/* Call/WhatsApp Button */}
                <Nav.Link
                  href="tel:+254700123456"
                  className="btn btn-success text-white px-4 py-2 rounded-pill ms-4 d-none d-lg-inline-block shadow"
                >
                  Call/WhatsApp
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        {/* Footer */}
        <footer className="footer-custom py-5 mt-auto">
          <Container className="text-center text-white">
            <p className="mb-1 fw-bold fs-5">Velma Car Yard • Nairobi, Kenya</p>
            <p className="mb-2">
              Call/WhatsApp: <strong className="fs-4">+254 700 123 456</strong>
            </p>
            <p className="mb-0 text-white-50">
              © 2025 Velma Car Yard • Open Daily 8AM–6PM
            </p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
