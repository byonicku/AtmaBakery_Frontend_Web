import { FaEnvelope, FaPhone } from "react-icons/fa";
import { Col, Container, Row } from "react-bootstrap";

import logo from "@/assets/images/atma-bakery.png";

import "./css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-main">
      <Container>
        <Row>
          <Col md={4} className="mt-4">
            <h3 className="footer-title">About</h3>
            <p className="desc">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum
              repellat expedita vel a voluptatem praesentium ducimus quia eum
              architecto autem reprehenderit ut, cupiditate at itaque, vitae
              minima omnis. Saepe, dolore?
            </p>
          </Col>
          <Col md={4} className="mt-4">
            <h3 className="footer-title">Contact</h3>
            <ul className="list-unstyled footer-contact mb-0">
              <li>
                <div className="footer-text desc">
                  <FaPhone />
                  (+62) 897 4432 484
                </div>
              </li>
              <li>
                <div className="footer-text desc">
                  <FaEnvelope />
                  nicoherlim@gmail.com
                </div>
              </li>
            </ul>
          </Col>
          <Col md={4} className="mb-2 mt-0">
            <img src={logo} alt="Logo" className="footer-logo" />
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
