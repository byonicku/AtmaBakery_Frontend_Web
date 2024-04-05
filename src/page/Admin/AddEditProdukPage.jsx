import {
  Container,
  Card,
  Button,
  Col,
  Row,
  Form,
} from "react-bootstrap";

export default function AddEditProdukPage() {
  const isValue = "edit";
  return (
    <Container className="bg-style">
      <Form>
        <Card>
          <Card.Header style={{ backgroundColor: "#EFAB68" }} className="p-3">
            <Card.Title>
              {isValue === "tambah" ? (
                <h3 style={{ fontWeight: "bold" }}>Tambah Produk</h3>
              ) : isValue === "edit" ? (
                <h3 style={{ fontWeight: "bold" }}>Edit Produk</h3>
              ) : null}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col sm className="my-3 mx-2">
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Nama Produk
                  </Form.Label>
                  <Form.Control
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    type="text"
                    value={isValue === "edit" ? "ini" : ""}
                    placeholder="Masukkan nama produk"
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-4">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Ukuran
                  </Form.Label>
                  <Form.Control
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    type="text"
                    value={isValue === "edit" ? "ini" : ""}
                    placeholder="Masukkan Ukuran produk"
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-4">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Limit
                  </Form.Label>
                  <Form.Control
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    type="text"
                    value={isValue === "edit" ? "ini" : ""}
                    placeholder="Masukkan Limit produk"
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-4">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Status
                  </Form.Label>
                  <Form.Select
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    required
                  >
                    <option value={"Pre Order"}>Pre Order</option>
                    <option value={"Ready Stock"}>Ready Stok</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mt-4">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Limit
                  </Form.Label>
                  <Form.Control
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    type="file"
                    multiple
                    required
                  />
                </Form.Group>
              </Col>

              <Col sm className="my-3 mx-2">
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Kategori
                  </Form.Label>
                  <Form.Select
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    value={isValue === "edit" ? "ini" : ""}
                    required
                  >
                    <option value="" disabled selected>
                      ---
                    </option>
                    <option value={"Cake"}>Cake</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mt-4">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Harga
                  </Form.Label>
                  <Form.Control
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    type="text"
                    value={isValue === "edit" ? "ini" : ""}
                    placeholder="Masukkan Harga produk"
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-4">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Stok
                  </Form.Label>
                  <Form.Control
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    type="text"
                    value={isValue === "edit" ? "ini" : ""}
                    placeholder="Masukkan Stok produk"
                    required
                  />
                </Form.Group>
                <Form.Group className="mt-4">
                  <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Penitip
                  </Form.Label>
                  <Form.Select
                    style={{
                      border: "1px #E5E5E5",
                      backgroundColor: "#F2F2F2",
                    }}
                    value={isValue === "edit" ? "ini" : ""}
                    required
                  >
                    <option value="" disabled selected>
                      ---
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="px-4 py-3">
            <Button variant="success" type="submit">
              Simpan Produk
            </Button>
            <Button className="mx-2" variant="danger">
              Batal Simpan Produk
            </Button>
          </Card.Footer>
        </Card>
      </Form>
    </Container>
  );
}
