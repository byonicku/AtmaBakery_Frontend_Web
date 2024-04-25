import { 
  Spinner, 
  Button, 
  Modal, 
  Form 
} from "react-bootstrap";

import {
  BsSearch,
  BsPlusSquare,
  BsPencilSquare,
  BsFillTrash3Fill,
  // BsPrinterFill,
} from "react-icons/bs";

import React, { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import InputHelper from "@/page/InputHelper";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIUser from "@/api/APIUser";
import AddEditModal from "@/component/Admin/Modal/AddEditModal";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [mode, setMode] = useState("edit");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const handleCloseAddEditModal = () => setShowAddEditModal(false);
  const [user, setUser] = useState(null);
  
  const fetchUser = useCallback(async () => {
      try {
        const data = await APIUser.getSelf();
        console.log(data);
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, []
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const [formData, setFormData] = useState({
    old_password: "",
    password: "",
    password_confirmation: ""
  });

  const validationSchema = {
    old_password: {
      required: true,
      alias: "old_password",
    },
    password: {
      required: true,
      alias: "password",
    },
    password_confirmation: {
      required: true,
      alias: "password_confirmation",
    },

  };
  
  const handleMutationSuccess = () => {
    setIsLoading(true);
    fetchUser();
    setTimeout(() => {
      setFormData({
        old_password: "",
        password: "",
        password_confirmation: ""
      });
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

  const onSubmit = async (formData) => {
    if (isLoading) return;

    try {
      if (mode === "edit") {
        const data = {
          old_password: formData.old_password,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        };

        await edit.mutateAsync(data);
        return;
      }
    } catch (error) {
      toast.error(error.message);
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
      password_confirmation: user.password_confirmation
    });
    setShowAddEditModal(true);
  };
  
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
                  src={user?.photo_url || "https://i.pinimg.com/736x/44/84/b6/4484b675ec3d56549907807fccf75b81.jpg"}
                  alt="Profile"
                  className="img-fluid rounded-circle"
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
              {/* Tombol Ubah Foto */}
              <div className="text-center">
              <Button  
                variant="primary"
                className="w-50 mb-3">
                Ubah Foto
              </Button>
              <br />
              <Button 
                variant="danger"
                className="custom-danger-btn w-50 mt-2">
                Hapus Foto
              </Button>
              </div>
            </div>
            {/* Container Kanan */}
            <div className="col-md-6">
              {/* Field Data Profil */}
              <div className="text-start mt-3">
                <label htmlFor="nama" style={{ fontWeight: "bold", fontSize: "1em" }}>Nama</label>
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
              <label htmlFor="nama" style={{ fontWeight: "bold", fontSize: "1em" }}>Tanggal Lahir</label>
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
              <label htmlFor="nama" style={{ fontWeight: "bold", fontSize: "1em" }}>Nomor Telepon</label>
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
              <label htmlFor="nama" style={{ fontWeight: "bold", fontSize: "1em" }}>Email</label>
                <input
                  style={{ border: "1px solid #808080" }}
                  id="email"
                  type="text"
                  className="form-control"
                  value={user?.email || ""}
                  disabled
                />
              </div>
              <div className="text-start mt-5 d-flex mb-3">
              <Button  
                variant="danger"
                className="custom-agree-btn w-45 mr-2">
                Ubah Profile
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
                password_confirmation: ""
              });
            }, 125);
          }}
          title={"Edit Data Resep"}
          text={"Pastikan password yang Anda ubah benar"}
          edit={edit}
          isLoadingModal={isLoadingModal}
          onSubmit={inputHelper.handleSubmit}
        >
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Kata Sandi Lama
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="password"
              name="old_password"
              value={formData.old_password}
              onChange={inputHelper.handleInputChange}
              placeholder="Masukkan Kata Sandi Lama"
              disabled={edit.isPending || isLoadingModal}
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Kata Sandi Baru
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="password"
              name="password"
              value={formData.password}
              onChange={inputHelper.handleInputChange}
              placeholder="Masukkan Kata Sandi Baru"
              disabled={edit.isPending || isLoadingModal}
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Konfirmasi Kata Sandi Baru
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={inputHelper.handleInputChange}
              placeholder="Masukkan Konfirmasi Kata Sandi Baru"
              disabled={edit.isPending || isLoadingModal}
            />
          </Form.Group>
        </AddEditModal>
    </>
  );
}
