import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  BsSearch,
  BsPlusSquare,
  BsPencilSquare,
  BsFillTrash3Fill,
  BsJournalText,
  BsPrinterFill,
} from "react-icons/bs";
import OutlerHeader from "@/component/Admin/OutlerHeader";

export default function PenitipPage() {
  const [showDelModal, setShowDelModal] = useState(false);
  const [showPrintModal, setshowPrintModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);

  const handleCloseDelModal = () => setShowDelModal(false);
  const handleShowDelModal = () => setShowDelModal(true);

  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const handleShowAddEditModal = () => setShowAddEditModal(true);

  const handleClosePrintModal = () => setshowPrintModal(false);
  const handleShowPrintModal = () => setshowPrintModal(true);

  return (
    <>
      <OutlerHeader
        title="Kelola Data Pentip"
        desc="Lakukan pengelolaan data penitip Atma Bakery"
        breadcrumb="Penitip"
      />
      <section className="content px-3">
        <Row className="pb-3">
          <Col
            xs="12"
            sm="6"
            lg="6"
            md="6"
            className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
          >
            <Button variant="success" onClick={handleShowAddEditModal} className="me-2">
              <BsPlusSquare className="mb-1 me-2" />
              Tambah Data
            </Button>
            <Button variant="secondary" onClick={handleShowPrintModal}>
              <BsPrinterFill className="mb-1 me-2" />
              Print Laporan
            </Button>
          </Col>
          <Col
            xs="12"
            sm="6"
            lg="6"
            md="6"
            className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
          >
            <InputGroup>
              <Form.Control type="text" placeholder="Cari Penitip disini" />
              <Button variant="secondary">
                <BsSearch />
              </Button>
            </InputGroup>
          </Col>
        </Row>

        <Table className="table-striped">
          <thead>
            <tr>
              <th style={{ width: "25%" }} className="th-style">
                ID Penitip
              </th>
              <th style={{ width: "25%" }} className="th-style">
                Nama
              </th>
              <th style={{ width: "25%" }} className="th-style">
                Nomor Telepon
              </th>
              <th style={{ width: "25%" }} className="th-style">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Penitip01</td>
              <td>Celine Hartono</td>
              <td>0812345678901</td>
              <td className="text-start">
                <Button
                  variant="primary"
                  style={{ width: "40%" }}
                  className="mx-2"
                  onClick={handleShowAddEditModal}
                >
                  <BsPencilSquare className="mb-1" /> Ubah
                </Button>
                <Button
                  variant="danger"
                  style={{ backgroundColor: "#FF5B19", width: "40%" }}
                  className="mx-2"
                  onClick={handleShowDelModal}
                >
                  <BsFillTrash3Fill className="mb-1" /> Hapus
                </Button>
              </td>
            </tr>
            <tr>
              <td>Penitip02</td>
              <td>Clayton Pakuwon</td>
              <td>0898765432122</td>
              <td className="text-start">
                <Button
                  variant="primary"
                  style={{ width: "40%" }}
                  className="mx-2"
                  onClick={handleShowAddEditModal}
                >
                  <BsPencilSquare className="mb-1" /> Ubah
                </Button>
                <Button
                  variant="danger"
                  style={{ backgroundColor: "#FF5B19", width: "40%" }}
                  className="mx-2"
                  onClick={handleShowDelModal}
                >
                  <BsFillTrash3Fill className="mb-1" /> Hapus
                </Button>
              </td>
            </tr>
            {/* nanti abis ini perulangan -- */}
          </tbody>
        </Table>

        {/* ini modal modalnya */}
        <Modal
          show={showDelModal}
          onHide={handleCloseDelModal}
          animation={false}
          centered
          size="lg"
          style={{ border: "none" }}
        >
          <Modal.Body className="text-center p-5">
            <h3 style={{ fontWeight: "bold" }}>
              Anda Yakin Ingin Menghapus Data Penitip Ini?
            </h3>
            <p
              style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
              className="mt-3"
            >
              <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
              <p className="m-0 p-0">
                Semua data yang terkait dengan penitip tersebut akan hilang.
              </p>
            </p>
            <Row className="py-2 pt-3">
              <Col sm>
                <Button
                  style={{ backgroundColor: "#FF5B19", border: "none" }}
                  className="mx-2 w-100 p-1"
                  onClick={handleCloseDelModal}
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

        <Modal
          show={showPrintModal}
          onHide={handleClosePrintModal}
          animation={false}
          centered
          style={{ border: "none" }}
        >
          <Form>
            <Modal.Body className="text-center p-4 m-2">
              <h5 style={{ fontWeight: "bold" }}>
                Print Laporan Bulanan Penitip
              </h5>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                className="mt-1"
              >
                Pilih bulan dan cetak laporan bulanan penitip
              </p>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Pilih Bulan
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="month"
                  placeholder="Month YYYY"
                />
              </Form.Group>
              <Row className="py-2 pt-3 mt-4">
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#FF5B19", border: "none" }}
                    className="w-100"
                    onClick={handleClosePrintModal}
                  >
                    Batal
                  </Button>
                </Col>
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#F48E28", border: "none" }}
                    className="w-100"
                    type="submit"
                  >
                    Simpan
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Form>
        </Modal>

        <Modal
          show={showAddEditModal}
          onHide={handleCloseAddEditModal}
          animation={false}
          centered
          style={{ border: "none" }}
        >
          <Form>
            <Modal.Body className="text-center p-4 m-2">
              <h4 style={{ fontWeight: "bold" }}>Tambah Data Penitip</h4>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                className="mt-1"
              >
                Pastikan data penitip yang Anda tambahkan benar
              </p>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nama
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="text"
                  placeholder="Masukkan nama penitip"
                />
              </Form.Group>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nomor Telepon
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="text"
                  placeholder="Masukkan nomor telepon"
                />
              </Form.Group>
              <Row className="py-2 pt-3 mt-4">
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#FF5B19", border: "none" }}
                    className="w-100"
                    onClick={handleCloseAddEditModal}
                  >
                    Batal
                  </Button>
                </Col>
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#F48E28", border: "none" }}
                    className="w-100"
                    type="submit"
                  >
                    Simpan
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Form>
        </Modal>
      </section>
    </>
  );
}
