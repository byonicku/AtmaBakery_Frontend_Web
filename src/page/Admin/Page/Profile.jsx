import {
  Spinner,
  Button,
  Form,
  InputGroup,
  Image,
  Col,
  Row,
} from "react-bootstrap";

import { BsPencilSquare } from "react-icons/bs";

import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import InputHelper from "@/page/InputHelper";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIUser from "@/api/APIUser";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";
import ConfirmationModal from "@/component/Admin/Modal/ConfirmationModal";

import { useRefresh } from "@/component/RefreshProvider";
import { FaCamera, FaTrash } from "react-icons/fa";
import Formatter from "@/assets/Formatter";
import APIAuth from "@/api/APIAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [eyeToggle, setEyeToggle] = useState(true);
  const [eyeToggle1, setEyeToggle1] = useState(true);
  const [eyeToggle2, setEyeToggle2] = useState(true);

  const handleToggle = () => setEyeToggle(!eyeToggle);
  const handleToggle1 = () => setEyeToggle1(!eyeToggle1);
  const handleToggle2 = () => setEyeToggle2(!eyeToggle2);

  const [mode, setMode] = useState("edit");

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const handleCloseAddEditModal = () => setShowAddEditModal(false);

  const [showAddEditModalProfil, setShowAddEditModalProfil] = useState(false);
  const handleCloseAddEditModalProfil = () => setShowAddEditModalProfil(false);

  const [showAddEditModalGambar, setShowAddEditModalGambar] = useState(false);
  const handleCloseAddEditModalGambar = () => setShowAddEditModalGambar(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  const { handleRefresh } = useRefresh();

  const fetchUser = useCallback(async (signal) => {
    setIsLoading(true);
    try {
      const data = await APIUser.getSelf(signal);
      sessionStorage.setItem("nama", data.nama);
      sessionStorage.setItem("tanggal_lahir", data.tanggal_lahir);
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("no_telp", data.no_telp);
      sessionStorage.setItem("jenis_kelamin", data.jenis_kelamin);
      sessionStorage.setItem("foto_profil", data.foto_profil);
      sessionStorage.setItem("saldo", data.saldo);
      sessionStorage.setItem("poin", data.poin);
      handleRefresh();
      setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetch = async () => {
      await fetchUser(signal);
    };

    fetch();
    setImage(null);

    return () => {
      abortController.abort();
    };
  }, [fetchUser]);

  const [formData, setFormData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  const validationSchema = {
    old_password: {
      required: true,
      alias: "Password Lama",
    },
    password: {
      required: true,
      alias: "Password Baru",
      minLength: 8,
    },
    password_confirmation: {
      required: true,
      alias: "Konfirmasi Password Baru",
    },
  };

  const handleMutationSuccess = () => {
    setIsLoading(true);
    fetchUser();
    setTimeout(() => {
      setFormData({
        old_password: "",
        password: "",
        password_confirmation: "",
      });
      setImage(null);
    }, 125);
  };

  const edit = useMutation({
    mutationFn: (data) => APIUser.updateSelfPassword(data),
    onSuccess: async () => {
      toast.success("Edit Password Berhasil! Silahkan login kembali!");
      handleCloseAddEditModal();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const editGambar = useMutation({
    mutationFn: () => APIUser.updateUserSelfGambar(image),
    onSuccess: async () => {
      toast.success("Edit Gambar Berhasil!");
      handleCloseAddEditModalGambar();
      handleMutationSuccess();
      handleRefresh();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const delGambar = useMutation({
    mutationFn: () => APIUser.deleteUserSelfGambar(),
    onSuccess: async () => {
      toast.success("Hapus Gambar Berhasil!");
      handleCloseDeleteModal();
      handleMutationSuccess();
      sessionStorage.setItem("foto_profil", null);
      handleRefresh();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (formData) => {
    if (isLoading) return;

    try {
      if (mode === "edit") {
        const data = {
          old_password: formData.old_password,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        };

        if (data.password !== data.password_confirmation) {
          toast.error("Password baru dan konfirmasi password baru tidak sama!");
          return;
        }

        await edit.mutateAsync(data);
        await APIAuth.logout();
        navigate("/");
        return;
      }

      if (mode === "edit-profil") {
        if (
          formDataProfil.jenis_kelamin === "" ||
          formDataProfil.jenis_kelamin === null
        ) {
          delete formDataProfil.jenis_kelamin;
        }

        await editProfil.mutateAsync(formDataProfil);
        return;
      }

      if (mode === "delete") {
        await delGambar.mutateAsync();

        return;
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

  const handleEditPasswordClick = (user) => {
    setMode("edit");
    setFormData({
      ...formData,
      old_password: user.old_password,
      password: user.password,
      password_confirmation: user.password_confirmation,
    });
    setShowAddEditModal(true);
  };

  const handleSubmitGambar = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Foto profil harus diisi!");
      return;
    }

    if (image?.size > 1000000) {
      toast.error("Ukuran foto profil tidak boleh lebih dari 1MB!");
      return;
    }

    await editGambar.mutateAsync();
  };

  const [formDataProfil, setFormDataProfil] = useState({
    nama: "",
    no_telp: "",
    jenis_kelamin: "",
  });

  const validationSchemaProfil = {
    nama: {
      required: true,
      alias: "Nama",
    },
    no_telp: {
      required: true,
      alias: "Nomor Telepon",
      minLength: 10,
      maxLength: 13,
      pattern: /^(?:\+?08)(?:\d{2,3})?[ -]?\d{3,4}[ -]?\d{4}$/,
    },
    jenis_kelamin: {
      required: false,
      alias: "Jenis Kelamin",
    },
  };

  const editProfil = useMutation({
    mutationFn: (data) => APIUser.updateUserSelf(data),
    onSuccess: async () => {
      toast.success("Edit Profil Berhasil!");
      handleCloseAddEditModalProfil();
      handleMutationSuccess();
      handleRefresh();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleEditProfileClick = (user) => {
    setMode("edit-profil");
    setFormDataProfil({
      ...formData,
      nama: user.nama,
      no_telp: user.no_telp,
      jenis_kelamin: user.jenis_kelamin,
    });
    setShowAddEditModalProfil(true);
  };

  const inputHelperProfil = new InputHelper(
    formDataProfil,
    setFormDataProfil,
    validationSchemaProfil,
    onSubmit
  );

  return (
    <>
      <OutlerHeader title="Profile" breadcrumb="Profile" />
      <section className="content">
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
          <Row>
            {/* Container Kiri */}
            <Col md={4}>
              {/* Photo Profil */}
              <div className="text-center mb-4 ">
                <img
                  src={
                    user?.foto_profil ||
                    "https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/r1xujbu1yfoenzked4rc"
                  }
                  alt="Profile"
                  className="img-fluid rounded-circle border border-black"
                  style={{
                    width: "200px",
                    objectFit: "cover",
                    aspectRatio: "1/1",
                  }}
                />
              </div>
              {/* Tombol Ubah Foto */}
              <div className="text-center">
                <Button
                  variant="primary"
                  className="mb-2"
                  onClick={() => {
                    setMode("edit-gambar");
                    setShowAddEditModalGambar(true);
                  }}
                >
                  <FaCamera className="mb-1 me-1" /> Ubah Foto
                </Button>
                <br />
                {user?.foto_profil && (
                  <Button
                    variant="danger"
                    className="custom-danger-btn"
                    onClick={() => {
                      setMode("delete");
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash className="mb-1 me-1" /> Hapus Foto
                  </Button>
                )}
              </div>
            </Col>
            {/* Container Kanan */}
            <Col md={8}>
              {/* Field Data Profil */}
              <div className="pe-lg-5 pe-2 ps-2 pe-md-3">
                <div className="text-start mt-3">
                  <label
                    htmlFor="nama"
                    style={{ fontWeight: "bold", fontSize: "1em" }}
                  >
                    Nama
                  </label>
                  <input
                    style={{ border: "1px solid #808080" }}
                    id="nama"
                    type="text"
                    className="form-control"
                    value={user?.nama || ""}
                    disabled
                  />
                </div>
                <div className="text-start mt-3">
                  <label
                    htmlFor="nama"
                    style={{ fontWeight: "bold", fontSize: "1em" }}
                  >
                    Tanggal Lahir
                  </label>
                  <input
                    style={{ border: "1px solid #808080" }}
                    id="tanggal_lahir"
                    type="text"
                    className="form-control"
                    value={Formatter.dateFormatter(user?.tanggal_lahir) || ""}
                    disabled
                  />
                </div>
                <div className="text-start mt-3">
                  <label
                    htmlFor="nama"
                    style={{ fontWeight: "bold", fontSize: "1em" }}
                  >
                    Nomor Telepon
                  </label>
                  <input
                    style={{ border: "1px solid #808080" }}
                    id="no_telp"
                    type="text"
                    className="form-control"
                    value={user?.no_telp || ""}
                    disabled
                  />
                </div>
                <div className="text-start mt-3">
                  <label
                    htmlFor="nama"
                    style={{ fontWeight: "bold", fontSize: "1em" }}
                  >
                    Email
                  </label>
                  <input
                    style={{ border: "1px solid #808080" }}
                    id="email"
                    type="text"
                    className="form-control"
                    value={user?.email || ""}
                    disabled
                  />
                </div>
                <div className="text-start mt-3">
                  <label
                    htmlFor="jenis_kelamin"
                    style={{ fontWeight: "bold", fontSize: "1em" }}
                  >
                    Jenis Kelamin
                  </label>
                  <input
                    style={{ border: "1px solid #808080" }}
                    id="jenis_kelamin"
                    type="text"
                    className="form-control"
                    value={
                      user?.jenis_kelamin === null ||
                      user?.jenis_kelamin === "null"
                        ? ""
                        : user?.jenis_kelamin === "L"
                        ? "Laki-laki"
                        : "Perempuan"
                    }
                    disabled
                  />
                </div>
                {sessionStorage.getItem("role") === "CUST" && (
                  <>
                    <div className="text-start mt-3">
                      <label
                        htmlFor="nama"
                        style={{ fontWeight: "bold", fontSize: "1em" }}
                      >
                        Saldo
                      </label>
                      <input
                        style={{ border: "1px solid #808080" }}
                        id="saldo"
                        type="text"
                        className="form-control"
                        value={Formatter.moneyFormatter(user?.saldo) || ""}
                        disabled
                      />
                    </div>
                    <div className="text-start mt-3">
                      <label
                        htmlFor="nama"
                        style={{ fontWeight: "bold", fontSize: "1em" }}
                      >
                        Poin
                      </label>
                      <input
                        style={{ border: "1px solid #808080" }}
                        id="poin"
                        type="text"
                        className="form-control"
                        value={user?.poin || ""}
                        disabled
                      />
                    </div>
                  </>
                )}
                <div className="text-start mt-3 d-flex mb-3">
                  <Button
                    variant="success"
                    className="w-45 mr-2"
                    onClick={() => {
                      setMode("edit-profil");
                      handleEditProfileClick(user);
                    }}
                  >
                    <BsPencilSquare className="mb-1" /> Ubah Profile
                  </Button>
                  {sessionStorage.getItem("role") !== "CUST" && (
                    <Button
                      variant="danger"
                      className="custom-agree-btn w-45"
                      onClick={() => {
                        setMode("edit");
                        handleEditPasswordClick(user);
                      }}
                    >
                      <BsPencilSquare className="mb-1" /> Ubah Password
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        )}
      </section>
      {/* Modal */}
      <AddEditModal
        show={showAddEditModal}
        onHide={() => {
          setShowAddEditModal(false);
          setTimeout(() => {
            setFormData({
              old_password: "",
              password: "",
              password_confirmation: "",
            });
          }, 125);
        }}
        title={"Ubah Password"}
        text={"Pastikan password yang Anda ubah benar"}
        edit={edit}
        onSubmit={inputHelper.handleSubmit}
      >
        <Form.Group className="text-start mt-3">
          <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
            Kata Sandi Lama
          </Form.Label>
          <InputGroup>
            <Form.Control
              type={eyeToggle ? "password" : "text"}
              style={{ border: "1px solid #808080" }}
              placeholder="Masukkan Kata Sandi Lama"
              name="old_password"
              value={formData.old_password}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending}
              required
            />
            <InputGroup.Text
              style={{
                border: "1px solid #808080",
                backgroundColor: "#FFFF",
                userSelect: "none",
              }}
              onClick={handleToggle}
            >
              {eyeToggle ? <BsEyeFill /> : <BsEyeSlashFill />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group className="text-start mt-3">
          <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
            Kata Sandi Baru
          </Form.Label>
          <InputGroup>
            <Form.Control
              type={eyeToggle1 ? "password" : "text"}
              style={{ border: "1px solid #808080" }}
              placeholder="Masukkan Kata Sandi Baru"
              name="password"
              value={formData.password}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending}
              required
            />
            <InputGroup.Text
              style={{
                border: "1px solid #808080",
                backgroundColor: "#FFFF",
                userSelect: "none",
              }}
              onClick={handleToggle1}
            >
              {eyeToggle1 ? <BsEyeFill /> : <BsEyeSlashFill />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group className="text-start mt-3">
          <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
            Konfirmasi Kata Sandi Baru
          </Form.Label>
          <InputGroup>
            <Form.Control
              type={eyeToggle2 ? "password" : "text"}
              style={{ border: "1px solid #808080" }}
              placeholder="Masukkan Kata Sandi Baru"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={inputHelper.handleInputChange}
              disabled={edit.isPending}
              required
            />
            <InputGroup.Text
              style={{
                border: "1px solid #808080",
                backgroundColor: "#FFFF",
                userSelect: "none",
              }}
              onClick={handleToggle2}
            >
              {eyeToggle2 ? <BsEyeFill /> : <BsEyeSlashFill />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
      </AddEditModal>

      <AddEditModal
        show={showAddEditModalGambar}
        onHide={() => {
          setShowAddEditModalGambar(false);
          setTimeout(() => {
            setImage(null);
          }, 125);
        }}
        title={"Ubah Foto"}
        text={"Pastikan foto profil yang Anda ubah benar"}
        edit={editGambar}
        onSubmit={handleSubmitGambar}
      >
        <Image
          src={
            image !== null
              ? URL.createObjectURL(image)
              : user?.foto_profil ||
                "https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/r1xujbu1yfoenzked4rc"
          }
          alt="Profile"
          className="img-fluid rounded-circle border"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />

        <Form.Group className="text-start mt-3">
          <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
            Foto Profil
          </Form.Label>
          <Form.Control
            type="file"
            style={{ border: "1px solid #808080" }}
            name="image"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              if (e.target.files.length === 0) {
                setImage(null);
                return;
              }

              if (e.target.files[0].size > 1000000) {
                e.target.value = null;
                toast.error("Ukuran foto profil tidak boleh lebih dari 1MB!");
                return;
              }

              setImage(e.target.files[0]);
            }}
            disabled={editGambar.isPending}
            required
          />
        </Form.Group>
      </AddEditModal>

      <ConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        header={"Hapus Foto"}
        text={"Apakah Anda yakin ingin menghapus foto profil?"}
        del={delGambar}
        onCancel={handleCloseDeleteModal}
        onSubmit={onSubmit}
      />

      <AddEditModal
        show={showAddEditModalProfil}
        onHide={() => {
          setShowAddEditModalProfil(false);
          setTimeout(() => {
            setFormDataProfil({
              nama: "",
              no_telp: "",
              jenis_kelamin: "",
            });
          }, 125);
        }}
        title={"Ubah Profile"}
        text={
          "Pastikan data profil yang Anda ubah benar, hanya dapat mengganti nama, nomor telepon dan jenis kelamin."
        }
        edit={editProfil}
        onSubmit={inputHelperProfil.handleSubmit}
      >
        <Form.Group className="text-start mt-3">
          <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
            Nama
          </Form.Label>
          <Form.Control
            type="text"
            style={{ border: "1px solid #808080" }}
            placeholder="Masukkan Nama"
            name="nama"
            value={formDataProfil.nama}
            onChange={inputHelperProfil.handleInputChange}
            disabled={editProfil.isPending}
            required
          />
        </Form.Group>
        <Form.Group className="text-start mt-3">
          <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
            Nomor Telepon
          </Form.Label>
          <Form.Control
            type="text"
            style={{ border: "1px solid #808080" }}
            placeholder="Masukkan Nomor Telepon"
            name="no_telp"
            value={formDataProfil.no_telp}
            onChange={inputHelperProfil.handleInputChange}
            disabled={editProfil.isPending}
            required
          />
        </Form.Group>
        <Form.Group className="text-start mt-3">
          <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
            Jenis Kelamin
          </Form.Label>
          <div className="d-flex ps-1">
            <Form.Check
              type="radio"
              label="Laki-laki"
              name="jenis_kelamin"
              value="L"
              checked={formDataProfil.jenis_kelamin === "L"}
              onChange={inputHelperProfil.handleInputChange}
              disabled={editProfil.isPending}
              className="me-3"
            />
            <Form.Check
              type="radio"
              label="Perempuan"
              name="jenis_kelamin"
              value="P"
              checked={formDataProfil.jenis_kelamin === "P"}
              onChange={inputHelperProfil.handleInputChange}
              disabled={editProfil.isPending}
            />
          </div>
        </Form.Group>
      </AddEditModal>
    </>
  );
}
