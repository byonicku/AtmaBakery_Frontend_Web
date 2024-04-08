import {
    Button,
    Col,
    Row,
    Form,
    Table,
    Modal,
    InputGroup,
    Container,
  } from "react-bootstrap";
  import { useState } from "react";
  import {
    BsSearch,
    BsPlusSquare,
    BsPencilSquare,
    BsFillTrash3Fill,
    BsPrinterFill,
  } from "react-icons/bs";
  import OutlerHeader from "@/component/Admin/OutlerHeader";
import NotFound from "@/component/Admin/NotFound";
  
  export default function BahanBakuPage() {
    const [showDelModal, setShowDelModal] = useState(false);
    const [showPrintModal, setshowPrintModal] = useState(false);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
  
    const handleCloseDelModal = () => setShowDelModal(false);
    const handleShowDelModal = () => setShowDelModal(true);
  
    const handleCloseAddEditModal = () => setShowAddEditModal(false);
    const handleShowAddEditModal = () => setShowAddEditModal(true);
  
    const handleClosePrintModal = () => setshowPrintModal(false);
    const handleShowPrintModal = () => setshowPrintModal(true);
  
    
    const listBahanBaku=[
    {
      nama: "Butter",
      stok: "3950",
      satuan: "gram",
    },
    {
        nama: "Creamer",
        stok: "345",
        satuan: "gram",
    }
    ];
  
    return (
      <>
        <OutlerHeader
          title="Kelola Data Bahan Baku"
          desc="Lakukan pengelolaan data bahan baku Atma Bakery"
          breadcrumb="Bahan Baku"
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
            </Col>
            <Col
              xs="12"
              sm="6"
              lg="6"
              md="6"
              className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
            >
              <InputGroup>
                <Form.Control type="text" placeholder="Cari Bahan Baku disini" />
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
                  Nama
                </th>
                <th style={{ width: "25%" }} className="th-style">
                  Stok
                </th>
                <th style={{ width: "25%" }} className="th-style">
                  Satuan
                </th>
                <th style={{ width: "25%" }} className="th-style">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {listBahanBaku.map((bahanBaku, index) => (
                <tr key={index}>
                  <td>{bahanBaku.nama}</td>
                  <td>{bahanBaku.stok}</td>
                  <td>{bahanBaku.satuan}</td>
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
              ))}
            </tbody>
          </Table>
          {listBahanBaku.length == 0 ?
             <NotFound />
              : null}
  
          {/* ini modal modalnya */}
          <Modal
            show={showDelModal}
            onHide={handleCloseDelModal}
            centered
            size="lg"
            style={{ border: "none" }}
            keyboard={false}
            backdrop="static"
          >
            <Modal.Body className="text-center p-5">
              <h3 style={{ fontWeight: "bold" }}>
                Anda Yakin Ingin Menghapus Data Bahan Baku Ini?
              </h3>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
                className="mt-3"
              >
                <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
                <p className="m-0 p-0">
                  Semua data yang terkait dengan Bahan Baku tersebut akan hilang.
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
            centered
            style={{ border: "none" }}
            keyboard={false}
            backdrop="static"
          >
            <Form>
              <Modal.Body className="text-center p-4 m-2">
                <h5 style={{ fontWeight: "bold" }}>
                  Print Laporan Penggunaan Bahan Baku
                </h5>
                <p
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                  className="mt-1"
                >
                  Pilih tanggal awal Penggunaan Bahan Baku
                </p>
                <Form.Group className="text-start mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Pilih Tanggal Awal
                  </Form.Label>
                  <Form.Control
                    style={{ border: "1px solid #808080" }}
                    type="date"
                    placeholder="Month YYYY"
                  />
                </Form.Group>
                <Form.Group className="text-start mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Pilih Tanggal Akhir
                  </Form.Label>
                  <Form.Control
                    style={{ border: "1px solid #808080" }}
                    type="date"
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
            centered
            style={{ border: "none" }}
            keyboard={false}
            backdrop="static"
          >
            <Form>
              <Modal.Body className="text-center p-4 m-2">
                <h4 style={{ fontWeight: "bold" }}>Tambah Data Bahan Baku</h4>
                <p
                  style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                  className="mt-1"
                >
                  Pastikan data Bahan Baku yang Anda tambahkan benar
                </p>
                <Form.Group className="text-start mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Nama
                  </Form.Label>
                  <Form.Control
                    style={{ border: "1px solid #808080" }}
                    type="text"
                    placeholder="Masukkan nama bahan baku"
                  />
                </Form.Group>
                <Form.Group className="text-start mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Stok
                  </Form.Label>
                  <Form.Control
                    style={{ border: "1px solid #808080" }}
                    type="number"
                    placeholder="Masukkan stok bahan baku"
                  />
                </Form.Group>
                <Form.Group className="text-start mt-3">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Satuan
                  </Form.Label>
                  <Form.Control
                    style={{ border: "1px solid #808080" }}
                    type="text"
                    placeholder="Masukkan satuan bahan baku"
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
  