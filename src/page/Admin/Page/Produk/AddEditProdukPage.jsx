import OutlerHeader from "@/component/Admin/OutlerHeader";
import { Button, Col, Row, Form } from "react-bootstrap";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

AddEditProdukPage.propTypes = {
  isEdit: PropTypes.bool,
};

export default function AddEditProdukPage({ isEdit }) {
  const [formData, setFormData] = useState({
    namaProduk: "",
    ukuran: "",
    limit: "",
    status: "",
    gambar: "",
    kategori: "",
    harga: "",
    stok: "",
    penitip: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  useEffect(() => {
    if (isEdit) {
      setFormData({
        namaProduk: "ini",
        ukuran: "ini",
        limit: "ini",
        status: "ini",
        gambar: "ini",
        kategori: "ini",
        harga: "ini",
        stok: "ini",
        penitip: "ini",
      });
    }
  }, [isEdit]);

  return (
    <>
      <OutlerHeader
        title={isEdit ? "Edit Produk" : "Tambah Produk"}
        breadcrumb="Produk"
      />
      <section className="content px-3">
        <Form>
          <Row>
            <Col sm className="my-3 mx-2">
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nama Produk
                </Form.Label>
                <Form.Control
                  type="text"
                  name="namaProduk"
                  defaultValue={formData.namaProduk}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama produk"
                  required
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Ukuran
                </Form.Label>
                <Form.Control
                  type="text"
                  name="ukuran"
                  defaultValue={formData.ukuran}
                  onChange={handleInputChange}
                  placeholder="Masukkan Ukuran produk"
                  required
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Limit
                </Form.Label>
                <Form.Control
                  type="text"
                  name="limit"
                  defaultValue={formData.limit}
                  onChange={handleInputChange}
                  placeholder="Masukkan Limit produk"
                  required
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Status
                </Form.Label>
                <Form.Select
                  name="status"
                  selected={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value={"Pre Order"}>Pre Order</option>
                  <option value={"Ready Stock"}>Ready Stok</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Gambar
                </Form.Label>
                <Form.Control type="file" multiple required max={5} />
              </Form.Group>
            </Col>

            <Col sm className="my-3 mx-2">
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Kategori
                </Form.Label>
                <Form.Select
                  name="kategori"
                  onChange={handleInputChange}
                  selected={formData.kategori}
                  required
                >
                  <option hidden defaultValue="" disabled selected>
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
                  type="text"
                  name="harga"
                  defaultValue={formData.harga}
                  onChange={handleInputChange}
                  placeholder="Masukkan Harga produk"
                  required
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Stok
                </Form.Label>
                <Form.Control
                  type="text"
                  name="stok"
                  defaultValue={formData.stok}
                  onChange={handleInputChange}
                  placeholder="Masukkan Stok produk"
                  required
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Penitip
                </Form.Label>
                <Form.Select
                  name="penitip"
                  selected={formData.penitip}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled selected>
                    ---
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Row>
              <Col>
                <Button variant="success" type="submit">
                  Simpan Produk
                </Button>
                <Button className="mx-2" variant="danger">
                  Batal Simpan Produk
                </Button>
              </Col>
            </Row>
          </Row>
        </Form>
      </section>
    </>
  );
}
