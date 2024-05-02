import { Spinner, Button, Form, InputGroup, Image } from "react-bootstrap";

import {
  BsSearch,
  BsPlusSquare,
  BsPencilSquare,
  BsFillTrash3Fill,
  // BsPrinterFill,
} from "react-icons/bs";

import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import InputHelper from "@/page/InputHelper";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIUser from "@/api/APIUser";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";
import DeleteConfirmationModal from "@/component/Admin/Modal/DeleteConfirmationModal";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [eyeToggle, setEyeToggle] = useState(true);
  const [eyeToggle1, setEyeToggle1] = useState(true);
  const [eyeToggle2, setEyeToggle2] = useState(true);

  const handleToggle = () => setEyeToggle(!eyeToggle);
  const handleToggle1 = () => setEyeToggle1(!eyeToggle1);
  const handleToggle2 = () => setEyeToggle2(!eyeToggle2);

  const [isLoadingModal, setIsLoadingModal] = useState(false);
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

  const fetchUser = useCallback(async () => {
    try {
      const data = await APIUser.getSelf();
      sessionStorage.setItem("foto_profil", data.foto_profil);
      sessionStorage.setItem("nama", data.nama);
      setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    setImage(null);
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
      toast.success("Edit Berhasil!");
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
      toast.success("Edit Berhasil!");
      handleCloseAddEditModalGambar();
      handleMutationSuccess();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const delGambar = useMutation({
    mutationFn: () => APIUser.deleteUserSelfGambar(),
    onSuccess: async () => {
      toast.success("Hapus Berhasil!");
      handleCloseDeleteModal();
      handleMutationSuccess();
      sessionStorage.setItem("foto_profil", null);
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

        await edit.mutateAsync(data);
        return;
      }

      if (mode === "edit-profil") {
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
      console.log(image.size);
      toast.error("Ukuran foto profil tidak boleh lebih dari 1MB!");
      return;
    }

    await editGambar.mutateAsync();
  };

  const [formDataProfil, setFormDataProfil] = useState({
    nama: "",
    no_telp: "",
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
  };

  const editProfil = useMutation({
    mutationFn: (data) => APIUser.updateUserSelf(data),
    onSuccess: async () => {
      toast.success("Edit Profil Berhasil!");
      handleCloseAddEditModalProfil();
      handleMutationSuccess();
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
          <div className="d-flex">
            {/* Container Kiri */}
            <div className="col-md-4">
              {/* Photo Profil */}
              <div className="text-center mb-5 ">
                <img
                  src={
                    user?.foto_profil ||
                    "https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/r1xujbu1yfoenzked4rc"
                  }
                  alt="Profile"
                  className="img-fluid rounded-circle"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* Tombol Ubah Foto */}
              <div className="text-center">
                <Button
                  variant="primary"
                  className="w-50 mb-3"
                  onClick={() => {
                    setMode("edit-gambar");
                    setShowAddEditModalGambar(true);
                  }}
                >
                  Ubah Foto
                </Button>
                <br />
                {user?.foto_profil && (
                  <Button
                    variant="danger"
                    className="custom-danger-btn w-50 mt-2"
                    onClick={() => {
                      setMode("delete");
                      setShowDeleteModal(true);
                    }}
                  >
                    Hapus Foto
                  </Button>
                )}
              </div>
            </div>
            {/* Container Kanan */}
            <div className="col-md-6">
              {/* Field Data Profil */}
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
                  value={user?.tanggal_lahir || ""}
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
              </div>
            </div>
          </div>
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
        isLoadingModal={isLoadingModal}
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
              disabled={edit.isPending || isLoadingModal}
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
              disabled={edit.isPending || isLoadingModal}
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
              disabled={edit.isPending || isLoadingModal}
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
        isLoadingModal={isLoadingModal}
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
          className="img-fluid rounded-circle"
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
            disabled={editGambar.isPending || isLoadingModal}
          />
        </Form.Group>
      </AddEditModal>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        header={"Hapus Foto"}
        text={"Apakah Anda yakin ingin menghapus foto profil?"}
        del={delGambar}
        onHapus={handleCloseDeleteModal}
        onSubmit={onSubmit}
        isLoadingModal={isLoadingModal}
      />

      <AddEditModal
        show={showAddEditModalProfil}
        onHide={() => {
          setShowAddEditModalProfil(false);
          setTimeout(() => {
            setFormDataProfil({
              nama: "",
              tanggal_lahir: "",
              no_telp: "",
              email: "",
            });
          }, 125);
        }}
        title={"Ubah Profile"}
        text={
          "Pastikan data profil yang Anda ubah benar, hanya dapat mengganti nama, dan nomor telepon."
        }
        edit={editProfil}
        isLoadingModal={isLoadingModal}
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
            disabled={editProfil.isPending || isLoadingModal}
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
            disabled={editProfil.isPending || isLoadingModal}
          />
        </Form.Group>
      </AddEditModal>
    </>
  );
}
