import { Container, Card, Button, Col, Row, Form,Table, Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import "./css/ProdukPage.css";
import { useState } from 'react';
import { BsSearch, BsPlusSquare, BsPencilSquare, BsFillTrash3Fill, BsJournalText  } from "react-icons/bs";

export default function ProdukPage() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    return (
      <Container className="bg-style" >
        <Card>
          <Card.Header style={{ backgroundColor: "#FFFFFF" }}>
            <Row>
              <Col sm>
                <Card.Title className="pt-3">
                  <h3>Kelola Data Produk</h3>
                  <p style={{ fontWeight: "normal", fontSize:"0.85em" }}> Lakukan pengelolaan data produk Atma Bakery</p>
                </Card.Title>
              </Col>
              <Col sm className="align-self-center">
                <Row>
                  <Col sm="4" className="text-end">
                    <Button variant="success">
                      <BsPlusSquare className="mb-1 me-2"/>
                      <Link to='./tambah' style={{ textDecoration: 'none', color: 'white' }}>
                        Tambah Data
                      </Link>
                    </Button>
                  </Col>
                  <Col sm="7" className="m-0">
                    <Form.Control style={{ border:"1px #E5E5E5", backgroundColor:"#F2F2F2" }} type="text" placeholder="Cari Produk disini"/>
                  </Col>
                  <Col sm="1" className="text-start p-0">
                    <Button variant="secondary"><BsSearch/></Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body p-0>
            <Table className="table-striped">
              <thead>
                <tr>
                  <th style={{ width:"25%" }} className="th-style">Nama Produk</th>
                  <th style={{ width:"14%" }} className="th-style">Kategori</th>
                  <th style={{ width:"14%" }} className="th-style">Ukuran</th>
                  <th style={{ width:"14%" }} className="th-style">Harga</th>
                  <th style={{ width:"33%" }} className="th-style"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lapis Legit</td>
                  <td>Cake</td>
                  <td>1</td>
                  <td>350000</td>
                  <td className="text-end">
                    <Button variant="primary" className="mx-2"><BsJournalText className="mb-1"/> Lihat </Button>
                    <Button variant="secondary" className="mx-2"><BsPencilSquare className="mb-1"/> Ubah</Button>
                    <Button variant="danger" style={{ backgroundColor:"#FF5B19" }} className="mx-2" onClick={handleShow}><BsFillTrash3Fill className="mb-1" /> Hapus</Button>
                  </td>
                </tr>
                <tr>
                  <td>Lapis Legit</td>
                  <td>Cake</td>
                  <td>1/2</td>
                  <td>200000</td>
                  <td className="text-end">
                    <Button variant="primary" className="mx-2"><BsJournalText className="mb-1"/> Lihat </Button>
                    <Button variant="secondary" className="mx-2"><BsPencilSquare className="mb-1"/> Ubah</Button>
                    <Button variant="danger" style={{ backgroundColor:"#FF5B19" }} className="mx-2"  onClick={handleShow}><BsFillTrash3Fill className="mb-1" /> Hapus</Button>
                  </td>
                </tr>
                {/* nanti abis ini perulangan -- */}

              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <Modal show={show} onHide={handleClose} animation={false} centered size="lg" style={{ border:"none" }}>
          <Modal.Body className="text-center p-5" >
            <h3 style={{ fontWeight:"bold" }}>Anda Yakin Ingin Menghapus Data Produk Ini?</h3>
            <p style={{ color:"rgb(18,19,20,70%)", fontSize:"1.15em" }} className="mt-3">
              <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
              <p className="m-0 p-0">Semua data yang terkait dengan produk tersebut akan hilang.</p> 
            </p>
            <Row className="py-2 pt-3">
              <Col sm>
                <Button style={{ backgroundColor:"#FF5B19", border:"none" }} className="mx-2 w-100 p-1"  onClick={handleClose}>
                  <h5 className="mt-2">Batal</h5>
                </Button>
              </Col>
              <Col sm>
                <Button style={{ backgroundColor:"#F48E28", border:"none" }} className="mx-2 w-100 p-1" >
                  <h5 className="mt-2">Hapus</h5>
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Container>
    )
  }