import OutlerHeader from "@/component/Admin/OutlerHeader";
import { Button, Col, Row, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import APIProduk from "@/api/APIProduk";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import InputHelper from "@/page/InputHelper";
import APIPenitip from "@/api/APIPenitip";

AddEditProdukPage.propTypes = {
  isEdit: PropTypes.bool,
};

export default function AddEditProdukPage({ isEdit }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(isEdit ? true : false);
  const [id_produk, setIdProduk] = useState(null);
  const [penitip, setPenitip] = useState([{}]);
  const [image_preview, setImagePreview] = useState(null);
  const [isTitipan, setIsTitipan] = useState(false);

  const [formData, setFormData] = useState({
    nama_produk: "",
    deskripsi: "",
    ukuran: "",
    limit: "",
    status: "",
    id_kategori: "",
    harga: "",
    stok: "",
    id_penitip: "",
    gambar: [],
  });

  useEffect(() => {
    const fetchPenitip = async () => {
      try {
        const response = await APIPenitip.getAllPenitip();
        setPenitip(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPenitip();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchProduk = async (id) => {
        setIsLoading(true);
        try {
          const response = await APIProduk.showProduk(id);

          setIdProduk(response.id_produk);

          setFormData({
            nama_produk: response.nama_produk,
            deskripsi: response.deskripsi,
            ukuran: response.ukuran,
            limit: `${response.limit}`,
            status: response.status,
            id_kategori: response.id_kategori,
            harga: response.harga,
            stok: response.stok,
            id_penitip: response.id_penitip,
          });

          setIsTitipan(response.id_kategori === "TP" ? true : false);
        } catch (error) {
          toast.error("Data tidak ditemukan, kembali ke halaman produk!");
          navigate("/admin/produk");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduk(id);
    }
  }, [isEdit, id, navigate]);

  const validationSchema = {
    nama_produk: {
      required: true,
      alias: "Nama Produk",
    },
    deskripsi: {
      required: true,
      alias: "Deskripsi",
    },
    ukuran: {
      required: true,
      alias: "Ukuran",
      minValue: 0,
    },
    limit: {
      required: true,
      alias: "Limit",
    },
    status: {
      required: true,
      alias: "Status",
    },
    foto: {
      required: false,
      alias: "Gambar",
    },
    id_kategori: {
      required: true,
      alias: "Kategori",
    },
    harga: {
      required: true,
      alias: "Harga",
      minValue: 0,
    },
    stok: {
      required: true,
      alias: "Stok",
      minValue: 0,
    },
    id_penitip: {
      required: formData.id_kategori === "TP" ? true : false,
      alias: "Penitip",
    },
  };

  const handleMutationSuccess = () => {
    setTimeout(() => {
      navigate("/admin/produk");
    }, 125);
  };

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APIProduk.createProduk(data),
    onSuccess: async () => {
      toast.success("Tambah Produk berhasil!");
      handleMutationSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Edit Data
  const edit = useMutation({
    mutationFn: (data) => APIProduk.updateProduk(data, id_produk),
    onSuccess: async () => {
      toast.success("Edit Produk berhasil!");
      handleMutationSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (formData) => {
    if (isLoading) return;

    if (formData.gambar?.length > 3) {
      toast.error("Gambar maksimal 3!");
      return;
    }

    try {
      if (isEdit) {
        await edit.mutateAsync(formData, id_produk);
      } else {
        if (formData.id_penitip === "") {
          delete formData.id_penitip;
        }

        await add.mutateAsync(formData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const inputHelper = new InputHelper(
    formData,
    setFormData,
    validationSchema,
    onSubmit
  );

  return (
    <>
      <OutlerHeader
        title={isEdit ? "Edit Produk" : "Tambah Produk"}
        breadcrumb="Produk"
      />
      <section className="content px-3">
        <Form onSubmit={inputHelper.handleSubmit}>
          <Row>
            {isLoading ? (
              <div className="text-center">
                <Spinner
                  as="span"
                  animation="border"
                  variant="primary"
                  size="lg"
                  role="status"
                  aria-hidden="true"
                />
                <h6 className="mt-2 mb-0">Loading...</h6>
              </div>
            ) : (
              <>
                <Col md={12} sm={12} lg={12} className="mt-3">
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Nama Produk
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="nama_produk"
                      defaultValue={formData.nama_produk}
                      onChange={inputHelper.handleInputChange}
                      placeholder="Masukkan nama produk"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12} sm={12} lg={12} className="mt-3">
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Deskripsi Produk
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="deskripsi"
                      defaultValue={formData.deskripsi}
                      onChange={inputHelper.handleInputChange}
                      placeholder="Masukkan deskripsi produk"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12} sm={12} lg={12} className="mt-3">
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Gambar
                    </Form.Label>
                    <Form.Control
                      name="foto"
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      multiple
                      max={5}
                      onChange={(e) => {
                        if (e.target.files.length > 5) {
                          toast.error("Gambar maksimal 5!");
                          return;
                        }

                        inputHelper.handleFileChange(e);
                        setImagePreview(e.target.files);
                      }}
                    />
                  </Form.Group>
                  {image_preview != null && (
                    <div>
                      {Array.from(image_preview).map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          width="200"
                          height="200"
                          className="img-thumbnail my-2 mx-1"
                        />
                      ))}
                    </div>
                  )}
                </Col>

                <Col lg={6} md={6} sm={12} className="my-3">
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Kategori
                    </Form.Label>
                    <Form.Select
                      name="id_kategori"
                      onChange={(e) => {
                        inputHelper.handleInputChange(e);
                        if (e.target.value === "TP") {
                          setIsTitipan(true);
                        } else {
                          setIsTitipan(false);
                          document.getElementsByName("id_penitip")[0].value = "";
                        }
                      }}
                      defaultValue={formData.id_kategori}
                      required
                    >
                      <option value="" disabled selected hidden>
                        ---
                      </option>
                      <option value={"CK"}>Cake</option>
                      <option value={"MNM"}>Roti</option>
                      <option value={"RT"}>Roti</option>
                      <option value={"TP"}>Titipan</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mt-4">
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Ukuran
                    </Form.Label>
                    <Form.Select
                      name="ukuran"
                      defaultValue={formData.ukuran}
                      onChange={inputHelper.handleInputChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        ---
                      </option>
                      <option value={"1"}>1</option>
                      <option value={"1/2"}>1/2</option>
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
                      onChange={inputHelper.handleInputChange}
                      placeholder="Masukkan Harga produk"
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
                      onChange={inputHelper.handleInputChange}
                      placeholder="Masukkan Limit produk"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col lg={6} md={6} sm={12} className="my-3">
                <Form.Group>
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Status
                    </Form.Label>
                    <Form.Select
                      name="status"
                      defaultValue={formData.status}
                      onChange={inputHelper.handleInputChange}
                      required
                    >
                      <option value="" disabled selected hidden>
                        ---
                      </option>
                      <option value={"PO"}>Pre Order</option>
                      <option value={"READY"}>Ready Stok</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mt-4">
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Stok
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="stok"
                      defaultValue={formData.stok}
                      onChange={inputHelper.handleInputChange}
                      placeholder="Masukkan Stok produk"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mt-4">
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Penitip
                    </Form.Label>
                    <Form.Select
                      name="id_penitip"
                      defaultValue={formData.id_penitip}
                      onChange={inputHelper.handleInputChange}
                      disabled={!isTitipan}
                    >
                      <option value="" disabled hidden selected>
                        ---
                      </option>
                      {penitip.map((penitip, index) => (
                        <option key={index} value={penitip.id_penitip}>
                          {penitip.id_penitip} - {penitip.nama}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Row>
                  <Col>
                    <Button
                      variant="success"
                      type="submit"
                      disabled={add.isPending || edit.isPending}
                    >
                      Simpan Produk
                    </Button>
                    <Link
                      to="/admin/produk"
                      className={
                        add.isPending || edit.isPending
                          ? "btn btn-danger mx-2 disabled"
                          : "btn btn-danger mx-2"
                      }
                    >
                      Batal Simpan Produk
                    </Link>
                  </Col>
                </Row>
              </>
            )}
          </Row>
        </Form>
      </section>
    </>
  );
}
