import PropTypes from "prop-types";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CardProduk({
  id,
  image = "https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/dyc1n9feqhbetyfxe5o5",
  nama = "...",
  ukuran = "...",
  harga = "...",
  kategori = "...",
}) {
  const navigate = useNavigate();

  const navigatorMaker = () => {
    switch (kategori) {
      case "Hampers":
        return "/produk/hampers/";
      default:
        return "/produk/";
    }
  };

  return (
    <Card className="card-fav rounded-5 shadow">
      <Card.Img
        variant="top"
        src={image}
        className="img-product rounded-top-5"
        style={{
          aspectRatio: "4/3",
          objectFit: "cover",
        }}
      />
      <Card.Body>
        <Row>
          <Col md={8} lg={8} xl={8} sm={8} xs={7}>
            <Card.Text className="text-left card-judul">{nama}</Card.Text>
          </Col>
          <Col md={4} lg={4} xl={4} sm={4} xs={5}>
            <Card.Text className="text-right card-font-ukuran">
              {ukuran}
            </Card.Text>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card.Text className="text-right card-font-uang mb-0">
              <span style={{ color: "#BE1008" }}>Rp </span>
              {harga}
            </Card.Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card.Text className="text-left">
              <Button
                className="card-pesan-btn rounded-5"
                variant="danger"
                onClick={() => navigate(navigatorMaker() + id)}
              >
                Pesan
              </Button>
            </Card.Text>
          </Col>
          <Col
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
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
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  nama: PropTypes.string.isRequired,
  ukuran: PropTypes.string.isRequired,
  harga: PropTypes.string.isRequired,
  kategori: PropTypes.string.isRequired,
};
