// src/pages/About.js
import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">About Velma Car Yard</h1>
        <p className="lead text-muted">
          Your trusted partner for quality pre-owned and brand-new vehicles in Kenya since 2020.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Who We Are */}
          <section className="mb-5">
            <h2 className="h3 fw-bold mb-4">Who We Are</h2>
            <p className="lead">
              Velma Car Yard is a registered Kenyan motor dealer specializing in carefully selected, 
              well-maintained vehicles. We offer flexible financing options including cash purchase, 
              bank finance, and our popular in-house Hire Purchase (HP) plans.
            </p>
            <p>
              Every car undergoes a thorough mechanical inspection and comes with a free valuation report. 
              Customer satisfaction and transparency are at the heart of everything we do.
            </p>
          </section>

          <hr className="my-5" />

          {/* Terms of Sale – Accordion for easy reading */}
          <h2 className="h3 fw-bold mb-4 text-center">Terms of Sale</h2>

          <Accordion flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header><strong>1. Payment Methods Accepted</strong></Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>Cash purchase (full payment upfront)</li>
                  <li>Bank finance (we assist with all major banks & SACCOs)</li>
                  <li>In-house Hire Purchase (HP) with flexible deposits from 30%</li>
                  <li>M-Pesa, bank transfer, RTGS, or cheque (cleared funds required before release)</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header><strong>2. Hire Purchase (HP) Terms</strong></Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>Minimum deposit: 30% of vehicle price (negotiable)</li>
                  <li>Repayment period: 12–36 months</li>
                  <li>Interest rate: 18–24% p.a. (reducing balance)</li>
                  <li>Logbook remains with Velma Car Yard until full settlement</li>
                  <li>Comprehensive insurance & tracking device mandatory (we can arrange)</li>
                  <li>Monthly instalments payable on or before the due date</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header><strong>3. Repossession Policy (Default on Instalments)</strong></Accordion.Header>
              <Accordion.Body>
                <strong>If you miss payments:</strong>
                <ul>
                  <li>First 30 days late → Courtesy reminder & late fee of KES 2,500</li>
                  <li>60 days late → Final demand notice</li>
                  <li>90+ days late → Vehicle will be repossessed without further notice</li>
                  <li>All payments made will be forfeited as liquidated damages</li>
                  <li>Any balance remaining after resale will be pursued legally</li>
                </ul>
                <p className="text-danger fw-bold">
                  We strictly enforce repossession to protect our business and other customers.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header><strong>4. Vehicle Condition & Warranty</strong></Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>All vehicles are sold as inspected and test-driven by the buyer</li>
                  <li>Engine & gearbox warranty: 3 months or 5,000 km (whichever comes first) on selected units</li>
                  <li>No warranty on bodywork, tyres, or battery unless stated</li>
                  <li>Mileage certified genuine at time of sale</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header><strong>5. General Terms</strong></Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>Prices include NTSA transfer fees</li>
                  <li>Buyer responsible for number plate & reflective fees</li>
                  <li>All vehicles sold “voetstoots” unless warranty specified</li>
                  <li>We reserve the right to refuse sale without explanation</li>
                  <li>These terms are governed by the laws of Kenya</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="text-center mt-5">
            <p className="text-muted">
              For inquiries: <strong>+254 700 123 456</strong> • 
              Email: <strong>sales@velmacaryard.co.ke</strong>
            </p>
            <small className="text-muted">
              Last updated: November 2025
            </small>
          </div>

        </div>
      </div>
    </Container>
  );
};

export default About;