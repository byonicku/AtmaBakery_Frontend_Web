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
import APIGambar from "@/api/APIGambar";

import "./css/Produk.css";
import "@/page/Admin/Page/css/Admin.css";

import { FaTrash } from "react-icons/fa";

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
  const [image, setImage] = useState(null);
  const [isTitipan, setIsTitipan] = useState(false);

  const [deleteImage, setDeleteImage] = useState([]);

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
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchPenitip = async () => {
      try {
        const response = await APIPenitip.getAllPenitip(signal);
        setPenitip(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPenitip();

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (isEdit) {
      const abortController = new AbortController();
      const signal = abortController.signal;

      const fetchProduk = async (id) => {
        setIsLoading(true);
        try {
          const response = await APIProduk.showProduk(id, signal);

          setIdProduk(response.id_produk);

          setFormData({
            nama_produk: response.nama_produk,
            deskripsi: response.deskripsi,
            ukuran: response.ukuran,
            limit: `${response.limit}`,
            status: response.status,
            id_kategori: response.id_kategori,
            harga: `${response.harga}`,
            stok: `${response.stok}`,
            id_penitip: response.id_penitip,
          });

          setImage(response.gambar);

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

      return () => {
        abortController.abort();
      };
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
      required: formData.status === "READY" ? false : true,
      alias: "Limit",
    },
    status: {
      required: formData.id_kategori === "TP" ? false : true,
      alias: "Status",
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
      required: formData.status === "PO" ? false : true,
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

  const handleDeleteImage = async () => {
    try {
      const result = {};

      if (deleteImage.length === 0) return result;

      for (const image of deleteImage) {
        await APIGambar.deleteGambar(image.id_gambar);
        result[image.public_id] = image.public_id;
      }

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async (id) => {
    try {
      const result = {};

      if (image_preview == null) return result;

      for (const image of image_preview) {
        const formData = new FormData();
        const filename = new Date().getTime() + "-produk";
        formData.append("file", image);
        const response = await APIGambar.uploadImage(formData, filename);
        const url = response.secure_url;
        const public_id = filename;
        const insertData = await APIGambar.createGambar({
          id_produk: id,
          url,
          public_id,
        });
        result[public_id] = insertData;
      }

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  // Add Data
  const add = useMutation({
    mutationFn: (data) => APIProduk.createProduk(data, uploadImage),
    onSuccess: async () => {
      toast.success("Tambah Produk berhasil!");
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Edit Data
  const edit = useMutation({
    mutationFn: (data) =>
      APIProduk.updateProduk(data, id_produk, uploadImage, handleDeleteImage),
    onSuccess: async () => {
      toast.success("Edit Produk berhasil!");
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (formData) => {
    if (isLoading) return;

    if (image?.length + formData.gambar?.length > 5) {
      toast.error("Gambar maksimal 5!");
      return;
    }

    if (formData.id_kategori === "TP" && formData.id_penitip === "") {
      toast.error("Penitip tidak boleh kosong!");
      return;
    }

    if ((image_preview?.length === 0 || image?.length === 0) && !isEdit) {
      toast.error("Gambar tidak boleh kosong!");
      return;
    }

    if (parseInt(formData.limit) < 0) {
      toast.error("Limit tidak boleh kurang dari 0!");
      return;
    }

    if (parseFloat(formData.harga) < 0) {
      toast.error("Harga tidak boleh kurang dari 0!");
      return;
    }

    if (parseInt(formData.stok) < 0) {
      toast.error("Stok tidak boleh kurang dari 0!");
      return;
    }

    try {
      if (formData.status === "READY") {
        formData.limit = 0;
      }

      if (formData.status === "PO") {
        formData.stok = 0;
      }

      if (isTitipan) {
        formData.status = "READY";
      }

      if (isEdit) {
        if (formData.id_kategori !== "TP") {
          formData.id_penitip = "";
        }

        await edit.mutateAsync(formData, id_produk);
      } else {
        if (formData.id_penitip === "") {
          delete formData.id_penitip;
        }

        await add.mutateAsync(formData);
      }
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
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
                      disabled={isLoading || add.isPending || edit.isPending}
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
                      disabled={isLoading || add.isPending || edit.isPending}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12} sm={12} lg={12} className="mt-3">
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Gambar (Max 5 Gambar, Max 1MB/Gambar)
                    </Form.Label>
                    <Form.Control
                      name="foto"
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      multiple
                      disabled={
                        image?.length >= 5 ||
                        image_preview?.length > 5 ||
                        isLoading ||
                        add.isPending ||
                        edit.isPending
                      }
                      onClick={() => {
                        if (image?.length >= 5 || image_preview?.length) {
                          document.getElementsByName("foto")[0].value = "";
                          toast.error("Gambar maksimal 5!");
                          return;
                        }
                      }}
                      onChange={(e) => {
                        if (
                          e.target.files.length > 5 ||
                          image?.length + e.target.files.length > 5 ||
                          image_preview?.length > 5
                        ) {
                          toast.error("Gambar maksimal 5!");
                          document.getElementsByName("foto")[0].value = "";
                          return;
                        }

                        for (const image of e.target.files) {
                          if (image.size > 1000000) {
                            document.getElementsByName("foto")[0].value = "";
                            toast.error("Ukuran gambar maksimal 1MB!");
                            return;
                          }
                        }

                        setImagePreview(e.target.files);
                      }}
                    />
                  </Form.Group>
                  <div>
                    {image != null &&
                      image.map((img, index) => (
                        <div key={index} className="image-container">
                          <img
                            draggable="false"
                            src={img.url}
                            alt="preview"
                            width="200"
                            height="200"
                            className={`img-thumbnail my-2 mx-1 ${
                              deleteImage.includes(img) && "selected-delete"
                            }`}
                          />
                          <div className="action-icons">
                            <label
                              className={`remove-icon text-white`}
                              onClick={() => {
                                if (
                                  isLoading ||
                                  add.isPending ||
                                  edit.isPending
                                )
                                  return;

                                const updatedDeleteImage = deleteImage.includes(
                                  img
                                )
                                  ? deleteImage.filter((image) => image !== img)
                                  : [...deleteImage, img];
                                setDeleteImage(updatedDeleteImage);
                              }}
                            >
                              <FaTrash />
                            </label>
                          </div>
                        </div>
                      ))}

                    {image_preview != null &&
                      Array.from(image_preview).map((file, index) => (
                        <>
                          <div className="image-container">
                            <img
                              key={index}
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              width="200"
                              height="200"
                              className="img-thumbnail my-2 mx-1 selected-new"
                            />
                            <div className="action-icons">
                              <label
                                className="remove-icon text-white"
                                onClick={() => {
                                  if (
                                    isLoading ||
                                    add.isPending ||
                                    edit.isPending
                                  )
                                    return;

                                  setImagePreview(
                                    Array.from(image_preview).filter(
                                      (image) => image !== file
                                    )
                                  );

                                  if (image_preview?.length === 1) {
                                    URL.revokeObjectURL(image_preview[index]);
                                    document.getElementsByName(
                                      "foto"
                                    )[0].value = "";
                                  }
                                }}
                              >
                                <FaTrash />
                              </label>
                            </div>
                          </div>
                        </>
                      ))}
                  </div>
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
                          document.getElementsByName("id_penitip")[0].value =
                            "";
                        }
                      }}
                      defaultValue={formData.id_kategori}
                      disabled={isLoading || add.isPending || edit.isPending}
                      required
                    >
                      <option value="" disabled selected hidden>
                        ---
                      </option>
                      <option value={"CK"}>Cake</option>
                      <option value={"MNM"}>Minuman</option>
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
                      disabled={isLoading || add.isPending || edit.isPending}
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
                      type="number"
                      name="harga"
                      defaultValue={formData.harga}
                      onChange={inputHelper.handleInputChange}
                      placeholder="Masukkan Harga produk"
                      disabled={isLoading || add.isPending || edit.isPending}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mt-4">
                    <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Limit
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="limit"
                      value={formData.status === "READY" ? 0 : formData.limit}
                      onChange={inputHelper.handleInputChange}
                      placeholder="Masukkan Limit produk"
                      disabled={
                        isLoading ||
                        add.isPending ||
                        edit.isPending ||
                        formData.status === "READY" ||
                        formData.status === ""
                      }
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
                      defaultValue={
                        formData.id_kategori === "TP"
                          ? "READY"
                          : formData.status
                      }
                      value={
                        formData.id_kategori === "TP"
                          ? "READY"
                          : formData.status
                      }
                      onChange={inputHelper.handleInputChange}
                      disabled={
                        isLoading ||
                        add.isPending ||
                        edit.isPending ||
                        formData.id_kategori === "TP"
                      }
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
                      type="number"
                      name="stok"
                      value={formData.status === "PO" ? 0 : formData.stok}
                      onChange={inputHelper.handleInputChange}
                      placeholder="Masukkan Stok produk"
                      disabled={
                        isLoading ||
                        add.isPending ||
                        edit.isPending ||
                        formData.status === "PO" ||
                        formData.status === ""
                      }
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
                      disabled={
                        !isTitipan ||
                        isLoading ||
                        add.isPending ||
                        edit.isPending
                      }
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
                <Row className="pb-3 gap-2 text-center">
                  <Col xs={12} sm={12} md={12} lg={12} className="p-0">
                    <Button
                      className="w-50"
                      variant="success"
                      type="submit"
                      disabled={isLoading || add.isPending || edit.isPending}
                    >
                      {isLoading || add.isPending || edit.isPending
                        ? "Loading"
                        : "Simpan Produk"}
                    </Button>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} className="m-0 p-0">
                    <Link
                      to="/admin/produk"
                      className={
                        isLoading || add.isPending || edit.isPending
                          ? "btn btn-danger custom-danger-btn w-50 disabled"
                          : "btn btn-danger custom-danger-btn w-50"
                      }
                    >
                      Batal
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
