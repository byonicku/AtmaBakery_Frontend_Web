import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
  Container,
  Spinner,
} from "react-bootstrap";
import { useEffect,useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { toast } from "sonner";

import InputHelper from "@/page/InputHelper";
import {
  BsSearch,
  BsPlusSquare,
  BsPencilSquare,
  BsFillTrash3Fill,
  BsPrinterFill,
} from "react-icons/bs";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIPenitip from "@/api/APIPenitip";

export default function PenitipPage() {
  const [showDelModal, setShowDelModal] = useState(false);
  const [showPrintModal, setshowPrintModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  
  const [Penitip, setPenitip] = useState([]); 
  const [selectedPenitipId, setSelectedPenitipId] = useState(null);


  const handleCloseDelModal = () => {
    setShowDelModal(false);
    setSelectedPenitipId(null);
  }
  const handleShowDelModal = () => setShowDelModal(true);

  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
    {selectedPenitipId ? 
      setSelectedPenitipId(null)
      :
      null
    }
    setFormData({
      nama: "",
      no_telp: ""
    });
  }
  const handleShowAddEditModal = () => setShowAddEditModal(true);

  const handleClosePrintModal = () => setshowPrintModal(false);
  const handleShowPrintModal = () => setshowPrintModal(true);

  const [formData, setFormData] = useState({
    nama: "",
    no_telp: "",
  });

  const validationSchema = {
    nama: {
      required: true,
      alias: "Nama Penitip",
    },
    no_telp: { required: true, alias: "Nomor Telepon" },
  };

  //ini tambah dan edit penitip nya
  const result = useMutation({
    mutationFn: (data) => {
      if (selectedPenitipId) {
        return APIPenitip.UpdatePenitip(data, selectedPenitipId);
      } else {
        return APIPenitip.CreatePenitip(data); 
      }
    },
    onSuccess: () => {
      if (selectedPenitipId) {
        toast.success("Edit Penitip berhasil!"); 
      } else {
        toast.success("Tambah Penitip berhasil!");
      }
      handleCloseAddEditModal();
      setFormData({
        nama: "",
        no_telp: ""
      });
      fetchPenitip();
      setTimeout(() => {
      }, 250);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onMutate: () => {
      setIsLoading(true);
    },
  });

  const onSubmit = async (formData) => {
    if (isLoading) return;
    
    try {
      await result.mutateAsync(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  
  const inputHelper = new InputHelper(
    formData,
    setFormData,
    validationSchema,
    onSubmit
  );

  const fetchPenitip = async () => {
    try{
      setIsLoading(true);
      APIPenitip.GetAllPenitip()
        .then((data) => {
          setPenitip(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
    
  };

  //ini delete data penitip
  const deletePenitip = (id) => { 
    setIsLoading(true); 
    APIPenitip.DeletePenitip(id).then(() => { 
      setIsLoading(false); 
      toast.success("Delete Penitip Berhasil"); 
      handleCloseDelModal();
      fetchPenitip();
    }).catch((error) => { 
      console.log(error); 
      setIsLoading(false); 
      toast.error(error.message); 
    }) 
  } 

  // ini read data penitip
  useEffect(() => { 
    setIsLoading(true); 
    APIPenitip.GetAllPenitip() 
      .then((data) => { 
        setPenitip(data); 
        setIsLoading(false); 
      }) 
      .catch((err) => { 
        console.log(err); 
      }); 
  }, []);

  return (
    <>
      <OutlerHeader
        title="Kelola Data Pentip"
        desc="Lakukan pengelolaan data penitip Atma Bakery"
        breadcrumb="Penitip"
      />
      <section className="content px-3">
        <Row className="pb-3">
          <Col
            xs="12"
            sm="6"
            lg="6"
            md="6"
            className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
          >
            <Button variant="success" onClick={handleShowAddEditModal} className="me-2">
              <BsPlusSquare className="mb-1 me-2" />
              Tambah Data
            </Button>
            <Button variant="secondary" onClick={handleShowPrintModal}>
              <BsPrinterFill className="mb-1 me-2" />
              Print Laporan
            </Button>
          </Col>
          <Col
            xs="12"
            sm="6"
            lg="6"
            md="6"
            className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
          >
            <InputGroup>
              <Form.Control type="text" placeholder="Cari Penitip disini" />
              <Button variant="secondary">
                <BsSearch />
              </Button>
            </InputGroup>
          </Col>
        </Row>
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
      ) : Penitip?.length > 0 ? ( 
        <Table className="table-striped">
          <thead>
            <tr>
              <th style={{ width: "25%" }} className="th-style">
                ID Penitip
              </th>
              <th style={{ width: "25%" }} className="th-style">
                Nama
              </th>
              <th style={{ width: "25%" }} className="th-style">
                Nomor Telepon
              </th>
              <th style={{ width: "25%" }} className="th-style">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {Penitip?.map((penitip, index) => (
              <tr key={index}>
                <td>{penitip.id_penitip}</td>
                <td>{penitip.nama}</td>
                <td>{penitip.no_telp}</td>
                <td className="text-start">
                  <Button
                    variant="primary"
                    style={{ width: "40%" }}
                    className="mx-2"
                    onClick={() => {
                      setSelectedPenitipId(penitip.id_penitip);
                      setFormData({
                        nama: penitip.nama,
                        no_telp: penitip.no_telp
                      });
                      handleShowAddEditModal();
                    }}
                  >
                    <BsPencilSquare className="mb-1" /> Ubah
                  </Button>
                  <Button
                    variant="danger"
                    style={{ backgroundColor: "#FF5B19", width: "40%" }}
                    className="mx-2"
                    onClick={() => {
                      setSelectedPenitipId(penitip.id_penitip);
                      handleShowDelModal();
                    }}
                  >
                    <BsFillTrash3Fill className="mb-1" /> Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        ) : (
          <Container className="text-center p-5">
            <h1 style={{ fontWeight:"bold" }}>Belum Ada Penitip Disini</h1>
              <img 
                src="https://stickerly.pstatic.net/sticker_pack/av92AOiHUVOzBhObB66Aw/KS87PY/22/393b3119-d2cd-43e5-8f35-c53692674917.png"
                style={{ 
                  width:"15em",
                 }}
              />
            </Container>
        )}
          
        {/* ini modal modalnya */}
        <Modal
          show={showDelModal}
          onHide={handleCloseDelModal}
          animation={false}
          centered
          size="lg"
          style={{ border: "none" }}
        >
          <Modal.Body className="text-center p-5">
            <h3 style={{ fontWeight: "bold" }}>
              Anda Yakin Ingin Menghapus Data Penitip Ini?
            </h3>
            <p
              style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
              className="mt-3"
            >
              <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
              <p className="m-0 p-0">
                Semua data yang terkait dengan penitip tersebut akan hilang.
              </p>
            </p>
            <Row className="py-2 pt-3">
              <Col sm>
                <Button
                  style={{ backgroundColor: "#FF5B19", border: "none" }}
                  className="mx-2 w-100 p-1"
                  onClick={handleCloseDelModal}
                  disabled={isLoading}
                >
                  <h5 className="mt-2">Batal</h5>
                </Button>
              </Col>
              <Col sm>
                <Button
                  style={{ backgroundColor: "#F48E28", border: "none" }}
                  className="mx-2 w-100 p-1"
                  onClick={() => {
                    deletePenitip(selectedPenitipId);
                  }}
                  disabled={isLoading}
                  >
                    <h5 className="mt-2">{isLoading ? "Loading..." : "Hapus"}</h5>
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>

        <Modal
          show={showPrintModal}
          onHide={handleClosePrintModal}
          animation={false}
          centered
          style={{ border: "none" }}
        >
          <Form>
            <Modal.Body className="text-center p-4 m-2">
              <h5 style={{ fontWeight: "bold" }}>
                Print Laporan Bulanan Penitip
              </h5>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                className="mt-1"
              >
                Pilih bulan dan cetak laporan bulanan penitip
              </p>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Pilih Bulan
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="month"
                  placeholder="Month YYYY"
                />
              </Form.Group>
              <Row className="py-2 pt-3 mt-4">
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#FF5B19", border: "none" }}
                    className="w-100"
                    onClick={handleClosePrintModal}
                  >
                    Batal
                  </Button>
                </Col>
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#F48E28", border: "none" }}
                    className="w-100"
                    type="submit"
                  >
                    Simpan
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Form>
        </Modal>

        <Modal
          show={showAddEditModal}
          onHide={() => {
            
            handleCloseAddEditModal();
          }}
          animation={false}
          centered
          style={{ border: "none" }}
        >
          <Form onSubmit={inputHelper.handleSubmit}>
            <Modal.Body className="text-center p-4 m-2">
              <h4 style={{ fontWeight: "bold" }}>{selectedPenitipId ? "Edit Data Penitip" : "Tambah Data Penitip"}</h4>
              <p
                style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
                className="mt-1"
              >
                {selectedPenitipId ? "Pastikan data penitip yang Anda tambahkan benar" : "Pastikan data penitip yang Anda ubahkan benar" }
              </p>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nama
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="text"
                  placeholder="Masukkan nama penitip"
                  name="nama"
                  disabled={isLoading}
                  value={formData.nama || ""}
                  onChange={inputHelper.handleInputChange}
                />
              </Form.Group>
              <Form.Group className="text-start mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>
                  Nomor Telepon
                </Form.Label>
                <Form.Control
                  style={{ border: "1px solid #808080" }}
                  type="text"
                  placeholder="Masukkan nomor telepon"
                  name="no_telp"
                  disabled={isLoading}
                  value={formData.no_telp || ""}
                  onChange={inputHelper.handleInputChange}
                />
              </Form.Group>
              <Row className="py-2 pt-3 mt-4">
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#FF5B19", border: "none" }}
                    className="w-100"
                    onClick={handleCloseAddEditModal}
                    disabled={isLoading}
                  >
                    Batal
                  </Button>
                </Col>
                <Col sm>
                  <Button
                    style={{ backgroundColor: "#F48E28", border: "none" }}
                    className="w-100"
                    type="submit"
                    disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Simpan"}
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Form>
        </Modal>
      </section>
    </>
  );
}
