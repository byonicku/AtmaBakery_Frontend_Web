import { useCallback, useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Row,
  Spinner,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Formatter from "@/assets/Formatter";
import APICart from "@/api/APICart";

export default function Keranjang() {
  const [isLoading, setIsLoading] = useState(false);
  const [produk, setProduk] = useState(null);

  const fetchKeranjang = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await APICart.getAllCart();
      setProduk(response);
    } catch (error) {
      setProduk([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeranjang();
  }, [fetchKeranjang]);

  return (
    <Container>
      {isLoading ? (
        <div className="text-center">
          <Spinner
            as="span"
            className="spinner-custom"
            animation="border"
            variant="primary"
            size="lg"
            role="status"
            aria-hidden="true"
          />
          <h6 className="mt-2 mb-0">Loading...</h6>
        </div>
      ) : (
        <>
          <div className="produk-slug">
            <Link to="/produk">Produk</Link> {">"}{" "}
            <Link className="nama-produk" to=".">
              Keranjang
            </Link>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Ringkasan Pesanan
          </div>
          <div
            className="text-muted"
            style={{
              fontSize: "1rem",
            }}
          >
            *Produk yang anda masukan ke keranjang akan dihapus apabila tidak
            melanjutkan checkout H-1 tanggal pengambilan
          </div>
          <Row className="pb-5">
            <Col></Col>
          </Row>
        </>
      )}
    </Container>
  );
}
