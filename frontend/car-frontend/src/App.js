// src/App.js — PRESTIGE MOTORS FINAL LUXURY EDITION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import About from './pages/About';
import ScheduleVisit from './pages/ScheduleVisit';  // ← NEW PAGE
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="luxury-app">
        {/* LUXURY NAVBAR */}
        <Navbar expand="lg" fixed="top" className="luxury-navbar">
          <Container>
            <Navbar.Brand as={Link} to="/" className="luxury-brand">
              <span className="brand-p">P</span> Prestige Motors
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="luxury-nav" />
            <Navbar.Collapse id="luxury-nav">
              <Nav className="ms-auto luxury-nav">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/about">Services</Nav.Link>
                <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                <Nav.Link as={Link} to="/admin" className="admin-link">Admin</Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/schedule-visit" 
                  className="btn-schedule"
                >
                  Schedule Visit
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/schedule-visit" element={<ScheduleVisit />} /> {/* ← NEW ROUTE */}
        </Routes>

        {/* LUXURY FOOTER */}
        <footer className="luxury-footer">
          <Container>
            <div className="footer-content">
              <div>
                <h4><span className="brand-p">P</span> Prestige Motors</h4>
                <p>Curating the finest luxury vehicles for discerning collectors since 2025.</p>
              </div>
              <div>
                <h6>Contact</h6>
                <p><strong>Call / WhatsApp:</strong> +254 720 789 084</p>
                <p><strong>Email:</strong> sales@prestigemotors.co.ke</p>
              </div>
              <div>
                <h6>Hours</h6>
                <p>Monday – Friday: 9 AM – 6 PM<br/>Saturday: 10 AM – 5 PM<br/>Sunday: By Appointment</p>
              </div>
            </div>
            <hr className="footer-line" />
            <p className="text-center mb-0">© 2025 Prestige Motors. All rights reserved.</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
