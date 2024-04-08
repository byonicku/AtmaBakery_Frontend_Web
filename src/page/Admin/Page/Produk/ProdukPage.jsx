import { Button, Col, Row, Form, Table, Modal, Badge, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  BsSearch,
  BsPlusSquare,
  BsPencilSquare,
  BsFillTrash3Fill,
  BsJournalText,
} from "react-icons/bs";
import OutlerHeader from "@/component/Admin/OutlerHeader";
import NotFound from "@/component/Admin/NotFound";

export default function ProdukPage() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const listProduk=[
    {
      nama: "Lapis Legit",
      deskripsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      kategori: "cake",
      ukuran: "1",
      harga: "350000",
      limit:"10",
      status:"Pre Order",
      stok: "0",
    },
    {
      nama: "Lapis Legit",
      deskripsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      kategori: "cake",
      ukuran: "1/2",
      harga: "200000",
      limit:"10",
      status:"Ready Stock",
      stok: "2",
    }
    ];

  return (
    <>
      <OutlerHeader
        title="Kelola Data Produk"
        desc="Lakukan pengelolaan data produk Atma Bakery"
        breadcrumb="Produk"
      />
      <section className="content px-3">
        <Row className="pb-3">
          <Col xs="12" sm="6" lg="6" md="6" className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1">
            <Link to='./tambah' className="btn btn-success me-2">
              <BsPlusSquare className="mb-1 me-2" />
              Tambah Data
            </Link>
          </Col>
          <Col xs="12" sm="6" lg="6" md="6" className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Cari Produk disini"
              />
              <Button variant="secondary">
                <BsSearch />
              </Button>
            </InputGroup>
          </Col>
        </Row>

        <Table responsive className="table-striped elevation-1">
          <thead>
            <tr>
              <th style={{ width: "14%" }} className="th-style">
                Nama Produk
              </th>
              <th style={{ width: "24%" }} className="th-style">
                Deskripsi
              </th>
              <th style={{ width: "6.5%" }} className="th-style">
                Kategori
              </th>
              <th style={{ width: "5%" }} className="th-style">
                Ukuran
              </th>
              <th style={{ width: "7%" }} className="th-style">
                Harga
              </th>
              <th style={{ width: "5%" }} className="th-style">
                Limit
              </th>
              <th style={{ width: "8.5%" }} className="th-style">
                Status
              </th>
              <th style={{ width: "5%" }} className="th-style">
                Stok
              </th>
              <th style={{ width: "30%" }} className="th-style">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {listProduk.map((produk, index) => (
              <tr key={index}>
                <td>{produk.nama}</td>
                <td>{produk.deskripsi}</td>
                <td>{produk.kategori}</td>
                <td>{produk.ukuran}</td>
                <td>{produk.harga}</td>
                <td>{produk.limit}</td>
                <td>
                  {produk.status == "Pre Order" ?
                    <Badge bg="primary">{produk.status}</Badge>
                  :
                    <Badge bg="success">{produk.status}</Badge>
                  }
                </td>
                <td>{produk.stok}</td>
                <td className="text-start">
                  <Button variant="primary" className="me-2">
                    <BsJournalText className="mb-1" /> Resep
                  </Button>
                  <Link to='./edit' className="btn btn-secondary me-2">
                    <BsPencilSquare className="mb-1" /> Ubah
                  </Link>
                  <Button
                    variant="danger"
                    style={{ backgroundColor: "#FF5B19" }}
                    onClick={handleShow}
                  >
                    <BsFillTrash3Fill className="mb-1" /> Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {listProduk.length == 0 ?
            <NotFound />
            : null}
        <Modal
          show={show}
          onHide={handleClose}
          centered
          size="lg"
          style={{ border: "none" }}
          keyboard={false}
          backdrop="static"
        >
          <Modal.Body className="text-center p-5">
            <h3 style={{ fontWeight: "bold" }}>
              Anda Yakin Ingin Menghapus Data Produk Ini?
            </h3>
            <p
              style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
              className="mt-3"
            >
              <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
              <p className="m-0 p-0">
                Semua data yang terkait dengan produk tersebut akan hilang.
              </p>
            </p>
            <Row className="py-2 pt-3">
              <Col sm>
                <Button
                  style={{ backgroundColor: "#FF5B19", border: "none" }}
                  className="mx-2 w-100 p-1"
                  onClick={handleClose}
                >
                  <h5 className="mt-2">Batal</h5>
                </Button>
              </Col>
              <Col sm>
                <Button
                  style={{ backgroundColor: "#F48E28", border: "none" }}
                  className="mx-2 w-100 p-1"
                >
                  <h5 className="mt-2">Hapus</h5>
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </section>
    </>
  );
}
