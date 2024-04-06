import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";

export default function OutlerHeader({ title, desc = "", breadcrumb }) {
  return (
    <div className="content-header">
      <Container fluid>
        <Row className="mb-0">
          <Col sm="6" md="6" lg="6">
            <h1 className="m-0">{title}</h1>
            <p className="m-0">{desc}</p>
          </Col>
          <Col sm="6" md="6" lg="6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <Link to='/admin'>Beranda</Link>
              </li>
              <li className="breadcrumb-item active">{breadcrumb}</li>
            </ol>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

OutlerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  breadcrumb: PropTypes.string.isRequired,
};
