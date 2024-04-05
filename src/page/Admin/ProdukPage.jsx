import { Container, Card, Button, Col, Row, Form,Table } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function ProdukPage() {
    return (
      <Container className="bg-style" >
        <Container>
          <h1>Produk</h1>
        </Container>
        <Card>
          <Card.Header style={{ backgroundColor: "#FFFFFF" }}>
            <Row>
              <Col sm>
                <Card.Title><h3>Produk</h3></Card.Title>
              </Col>
              <Col sm>
                <Row>
                  <Col sm="3" className="text-end">
                    <Button variant="success">
                      <Link to='./tambah' style={{ textDecoration: 'none', color: 'white' }}>
                        Tambah Produk
                      </Link>
                    </Button>
                  </Col>
                  <Col sm="8">
                    <Form.Control style={{ border:"1px #E5E5E5", backgroundColor:"#F2F2F2" }} type="text" placeholder="Cari Produk disini"/>
                  </Col>
                  <Col sm="1">
                    <Button variant="secondary"></Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body p-0>
            <Table className="table-striped">
              <thead>
                <tr>
                  <th style={{ width:"25%" }}>Nama Produk</th>
                  <th style={{ width:"14%" }}>Kategori</th>
                  <th style={{ width:"14%" }}>Ukuran</th>
                  <th style={{ width:"14%" }}>Harga</th>
                  <th style={{ width:"33%" }}></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lapis Legit</td>
                  <td>Cake</td>
                  <td>1</td>
                  <td>350000</td>
                  <td className="text-end">
                    <Button variant="primary" className="mx-2">Lihat Resep</Button>
                    <Button variant="secondary" className="mx-2">Ubah Produk</Button>
                    <Button variant="danger" className="mx-2">Hapus Produk</Button>
                  </td>
                </tr>
                <tr>
                  <td>Lapis Legit</td>
                  <td>Cake</td>
                  <td>1/2</td>
                  <td>200000</td>
                  <td className="text-end">
                    <Button variant="primary" className="mx-2">Lihat Resep</Button>
                    <Button variant="secondary" className="mx-2">Ubah Produk</Button>
                    <Button variant="danger" className="mx-2">Hapus Produk</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    )
  }