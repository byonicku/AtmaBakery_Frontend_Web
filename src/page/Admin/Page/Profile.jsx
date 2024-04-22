import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIUser from "@/api/APIUser";
import { useEffect, useState } from "react";
import { Spinner, Button, Modal, Form } from "react-bootstrap";
import { toast } from "sonner";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    password: "",
    password_confirmation: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await APIUser.getSelf();
        console.log(data);
        setUser(data);
      } catch (error) {
        console.error(error);
        toast.error(
          error?.data?.message ||
            error?.message ||
            "Sesuatu sedang bermasalah pada server!"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePasswordSubmit = async () => {
    try {
      await APIUser.updateSelfPassword(passwordData);
      setPasswordData({
        old_password: "",
        password: "",
        password_confirmation: ""
      });
      setShowModal(false);
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Sesuatu sedang bermasalah pada server!"
      );
    }
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
                onClick={() => setShowModal(true)}>
                Ubah Password
              </Button>
            </div>
            </div>
          </div>
        )}
      </section>
      
       {/* Modal */}
       <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)}
          backdrop="static"
          centered
          size="lg"
          style={{ border: "none" }}
          >
        <Modal.Body className="text-center p-5">
            <h3 style={{ fontWeight: "bold" }}>
              Ubah Kata Sandi
            </h3>
            <p
              style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
              className="mt-3"
            >
              <p className="m-0 p-0">Pastikan kata sandi yang Anda ubahkan benar</p>
            </p>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Kata Sandi Lama
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="password"
              placeholder="Masukkan Kata Sandi Lama"
              name="old_password"
              value={passwordData.old_password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Kata Sandi Baru
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="password"
              placeholder="Masukkan Kata Sandi Baru"
              name="password"
              value={passwordData.password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Form.Group className="text-start mt-3">
            <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
              Konfirmasi Kata Sandi
            </Form.Label>
            <Form.Control
              style={{ border: "1px solid #808080" }}
              type="password"
              placeholder="Masukkan Konfirmasi Kata Sandi"
              name="password_confirmation"
              value={passwordData.password_confirmation}
              onChange={handlePasswordChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            className="custom-danger-btn w-100"
            onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button 
            variant="danger"
            className="custom-agree-btn w-100" 
            onClick={handlePasswordSubmit}>
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
