import APIProduk from "@/api/APIProduk";
import Formatter from "@/assets/Formatter";
import CardProduk from "@/component/Main/CardProduk";
import CardProdukSkeleton from "@/component/Main/CardProdukSkeleton";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import "./css/ProdukView.css";
import APIHampers from "@/api/APIHampers";

export default function ProdukView() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const [produk, setProduk] = useState([]);
  const [backupProduk, setBackupProduk] = useState([]);

  const fetchProduk = useCallback(async (signal) => {
    setIsLoading(true);
    try {
      const response = await APIProduk.getAllProduk(signal);
      const response2 = await APIHampers.getAllHampers(signal);
      const response3 = response.concat(response2);
      setProduk(response3);
      setBackupProduk(response3);
    } catch (error) {
      setProduk([]);
      setBackupProduk([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchProduk = async (e) => {
    e.preventDefault();

    if (search === "") {
      setProduk(backupProduk);
      return;
    }

    const filteredProduk = backupProduk.filter(
      (item) =>
        item.nama_produk?.toLowerCase().includes(search.toLowerCase()) ||
        item.nama_hampers?.toLowerCase().includes(search.toLowerCase())
    );

    setProduk(filteredProduk);
  };

  const filterProduk = async (kategori) => {
    if (kategori === "Semua") {
      setProduk(backupProduk);
      return;
    }

    if (kategori === "PO") {
      const filteredProduk = backupProduk.filter((item) => item.stok === 0);
      setProduk(filteredProduk);
      return;
    }

    if (kategori === "READY") {
      const filteredProduk = backupProduk.filter((item) => item.stok > 0);
      setProduk(filteredProduk);
      return;
    }

    if (kategori === "Hampers") {
      const filteredProduk = backupProduk.filter(
        (item) => item.id_hampers !== undefined
      );
      setProduk(filteredProduk);
      return;
    }

    const filteredProduk = backupProduk.filter(
      (item) => item.id_kategori === kategori
    );

    setProduk(filteredProduk);
  };

  useEffect(() => {
    if (search === "") {
      setProduk(backupProduk);
    }
    // eslint-disable-next-line
  }, [search]);

  // Pas masuk load produk
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchProduk(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchProduk]);

  const kategoriConverter = (id_kategori) => {
    switch (id_kategori) {
      case "CK":
        return "Cake";
      case "RT":
        return "Roti";
      case "MNM":
        return "Minuman";
      case "TP":
        return "Titipan";
      default:
        return "Hampers";
    }
  };

  const ukuranConverter = (ukuran, id_kategori) => {
    switch (id_kategori) {
      case "CK":
        return ukuran + " Loyang";
      case "RT":
        return "Isi 10/Box";
      case "MNM":
        return "Per Liter";
      case "TP":
        return "Per Bungkus";
      default:
        return "Per Box";
    }
  };

  return (
    <>
      <Container>
        <Row className="text-center pt-3 pb-5">
          <h5
            style={{
              color: "#F48E28",
            }}
            className="pb-0 mb-0"
          >
            Produk
          </h5>
          <h1
            style={{ fontWeight: "600", fontSize: "1.85rem" }}
            className="pt-0"
          >
            Produk Atma Bakery
          </h1>
          <Row className="py-2 mx-auto">
            <Col
              lg={10}
              md={9}
              sm={12}
              className="py-sm-2 py-2 py-lg-0 py-md-0"
            >
              <InputGroup>
                <Form.Control
                  type="text"
                  className="input-search"
                  placeholder="Cari Produk Disini"
                  name="search"
                  value={search || ""}
                  disabled={isLoading}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search) {
                      searchProduk(e);
                    }
                  }}
                />
                <Button
                  variant="secondary"
                  className="input-search-btn"
                  disabled={isLoading}
                  onClick={searchProduk}
                >
                  <BsSearch />
                </Button>
              </InputGroup>
            </Col>
            <Col
              lg={2}
              md={3}
              sm={12}
              className="text-end py-sm-2 py-2 py-lg-0 py-md-0"
            >
              <Dropdown>
                <Dropdown.Toggle
                  variant="danger"
                  className="dropdown-menu-custom w-100"
                >
                  {filter}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      filterProduk("Semua");
                      setFilter("Semua");
                    }}
                  >
                    Semua
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      filterProduk("PO");
                      setFilter("Pre Order");
                    }}
                  >
                    Pre Order
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      filterProduk("READY");
                      setFilter("Ready");
                    }}
                  >
                    Ready
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      filterProduk("CK");
                      setFilter("Cake");
                    }}
                  >
                    Cake
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      filterProduk("RT");
                      setFilter("Roti");
                    }}
                  >
                    Roti
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      filterProduk("MNM");
                      setFilter("Minuman");
                    }}
                  >
                    Minuman
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      filterProduk("TP");
                      setFilter("Titipan");
                    }}
                  >
                    Titipan
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      filterProduk("Hampers");
                      setFilter("Hampers");
                    }}
                  >
                    Hampers
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          <Row className="pt-2 pt-sm-2 pt-lg-4 pt-mt-4 mx-auto">
            {isLoading ? (
              <CardProdukSkeleton amount={6} />
            ) : (
              produk.map((item, index) => (
                <Col key={index} xl={4} lg={4} md={6} sm={12} className="mb-3">
                  <CardProduk
                    id={item.id_produk ?? item.id_hampers}
                    image={item?.gambar[0]?.url}
                    nama={item.nama_produk ?? item.nama_hampers}
                    ukuran={
                      ukuranConverter(item.ukuran, item.id_kategori) || "N/A"
                    }
                    harga={Formatter.moneyFormatter(item.harga).substring(3)}
                    kategori={kategoriConverter(item.id_kategori)}
                  />
                </Col>
              ))
            )}
          </Row>
        </Row>
      </Container>
    </>
  );
}
