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

export default function ProdukPage() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            <tr>
              <td>Lapis Legit</td>
              <td>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur
              </td>
              <td>Cake</td>
              <td>1</td>
              <td>350000</td>
              <td>10</td>
              <td>
                <Badge bg="primary">Pre Order</Badge>
              </td>
              <td>0</td>
              <td className="text-start">
                <Button variant="primary" className="me-1">
                  <BsJournalText className="mb-1" /> Resep{" "}
                </Button>
                <Button variant="secondary" className="mx-1">
                  <BsPencilSquare className="mb-1" /> Ubah
                </Button>
                <Button
                  variant="danger"
                  style={{ backgroundColor: "#FF5B19" }}
                  className="mx-1"
                  onClick={handleShow}
                >
                  <BsFillTrash3Fill className="mb-1" /> Hapus
                </Button>
              </td>
            </tr>
            <tr>
              <td>Lapis Legit</td>
              <td>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </td>
              <td>Titipan</td>
              <td>1/2</td>
              <td>200000</td>
              <td>10</td>
              <td>
                <Badge bg="success">Ready Stock</Badge>
              </td>
              <td>0</td>
              <td className="text-start">
                <Button variant="primary" className="me-1">
                  <BsJournalText className="mb-1" /> Resep{" "}
                </Button>
                <Button variant="secondary" className="mx-1">
                  <BsPencilSquare className="mb-1" /> Ubah
                </Button>
                <Button
                  variant="danger"
                  style={{ backgroundColor: "#FF5B19" }}
                  className="mx-1"
                  onClick={handleShow}
                >
                  <BsFillTrash3Fill className="mb-1" /> Hapus
                </Button>
              </td>
            </tr>
            {/* nanti abis ini perulangan -- */}
          </tbody>
        </Table>

        <Modal
          show={show}
          onHide={handleClose}
          animation={false}
          centered
          size="lg"
          style={{ border: "none" }}
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
