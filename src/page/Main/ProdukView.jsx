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
import NotFound from "@/component/Admin/NotFound";

export default function ProdukView() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [filterText, setFilterText] = useState("Semua");

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

  const applyFilter = (produkList, kategori) => {
    switch (kategori) {
      case "PO":
        return produkList.filter((item) => item.stok === 0);
      case "READY":
        return produkList.filter((item) => item.stok > 0);
      case "Hampers":
        return produkList.filter((item) => item.id_hampers !== undefined);
      case "CK":
      case "RT":
      case "MNM":
      case "TP":
        return produkList.filter((item) => item.id_kategori === kategori);
      case "Semua":
      default:
        return produkList;
    }
  };

  const searchProduk = async (e) => {
    e.preventDefault();

    let filteredProduk = backupProduk;

    if (search) {
      const searchRegex = new RegExp(`\\b${search}`, "i");
      filteredProduk = filteredProduk.filter(
        (item) =>
          searchRegex.test(item.nama_produk) ||
          searchRegex.test(item.nama_hampers)
      );
    }

    setProduk(applyFilter(filteredProduk, filter));
  };

  const filterProduk = (kategori) => {
    setFilter(kategori);

    const filteredProduk = applyFilter(backupProduk, kategori);

    if (search) {
      const searchRegex = new RegExp(`\\b${search}`, "i");
      const searchedProduk = filteredProduk.filter(
        (item) =>
          searchRegex.test(item.nama_produk) ||
          searchRegex.test(item.nama_hampers)
      );
      setProduk(searchedProduk);
    } else {
      setProduk(filteredProduk);
    }
  };

  useEffect(() => {
    if (search === "") {
      setProduk(applyFilter(backupProduk, filter));
    }
    // eslint-disable-next-line
  }, [search, filter]);

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
        <Row className="text-center pb-5">
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
                    if (e.key === "Enter") {
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
                  {filterText}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      setFilterText("Semua");
                      filterProduk("Semua");
                    }}
                  >
                    Semua
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setFilterText("Pre Order");
                      filterProduk("PO");
                    }}
                  >
                    Pre Order
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setFilterText("Ready");
                      filterProduk("READY");
                    }}
                  >
                    Ready
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setFilterText("Cake");
                      filterProduk("CK");
                    }}
                  >
                    Cake
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setFilterText("Roti");
                      filterProduk("RT");
                    }}
                  >
                    Roti
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setFilterText("Minuman");
                      filterProduk("MNM");
                    }}
                  >
                    Minuman
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setFilterText("Titipan");
                      filterProduk("TP");
                    }}
                  >
                    Titipan
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setFilterText("Hampers");
                      filterProduk("Hampers");
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
            ) : produk.length !== 0 ? (
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
            ) : (
              <NotFound
                text={
                  search
                    ? "Produk Tidak Ditemukan"
                    : "Tidak Ada Produk Tersedia"
                }
              />
            )}
          </Row>
        </Row>
      </Container>
    </>
  );
}
