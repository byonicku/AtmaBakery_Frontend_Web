import PropTypes from "prop-types";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CardProduk({
  image = "https://via.placeholder.com/150",
  nama = "...",
  ukuran = "...",
  harga = "...",
  kategori = "...",
}) {
  const navigate = useNavigate();
  return (
    <Card className="card-fav rounded-5 shadow">
      <Card.Img
        variant="top"
        src={image}
        className="img-product rounded-top-5"
        style={{
          aspectRatio: "4/3",
        }}
      />
      <Card.Body>
        <Row>
          <Col>
            <Card.Text className="text-left card-judul">{nama}</Card.Text>
          </Col>
          <Col>
            <Card.Text className="text-right card-font-ukuran mb-2">
              {ukuran}
            </Card.Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card.Text className="text-right card-font-uang mb-1">
              <span style={{ color: "#BE1008" }}>Rp </span>
              {harga}
            </Card.Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card.Text className="text-left ">
              <Button
                className="card-pesan-btn rounded-5"
                variant="danger"
                onClick={() => navigate("/pesan")}
              >
                Pesan
              </Button>
            </Card.Text>
          </Col>
          <Col>
            <Card.Text className="text-right m-0">
              <Badge className="card-badge rounded-5">{kategori}</Badge>
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

CardProduk.propTypes = {
  image: PropTypes.string.isRequired,
  nama: PropTypes.string.isRequired,
  ukuran: PropTypes.string.isRequired,
  harga: PropTypes.number.isRequired,
  kategori: PropTypes.string.isRequired,
};
