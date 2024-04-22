import { Modal, Button, Row, Col } from "react-bootstrap";
import propTypes from "prop-types";

const DeleteConfirmationModal = ({
  header,
  secondP,
  show,
  onClick,
  onHapus,
  onSubmit,
  del,
}) => {
  return (
    <Modal
      show={show}
      centered
      size="lg"
      keyboard={false}
      backdrop="static"
      onClick={onClick}
    >
      <Modal.Body className="text-center p-5">
        <h3 style={{ fontWeight: "bold" }}>{header}</h3>
        <p
          style={{ color: "rgb(18,19,20,70%)", fontSize: "1.15em" }}
          className="mt-3"
        >
          <p className="m-0 p-0">Tindakan ini tidak bisa dibatalkan.</p>
          <p className="m-0 p-0">{secondP}</p>
        </p>
        <Row className="pt-3 gap-2 gap-lg-0 gap-md-0 flex-row-reverse">
          <Col xs={12} sm={12} md={6} lg={6}>
            <Button
              variant="danger"
              className="custom-agree-btn w-100 p-1"
              onClick={onSubmit}
              disabled={del.isPending}
            >
              <h5 className="mt-2">{del.isPending ? "Loading..." : "Hapus"}</h5>
            </Button>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Button
              variant="danger"
              className="custom-danger-btn w-100 p-1"
              onClick={onHapus}
              disabled={del.isPending}
            >
              <h5 className="mt-2">Batal</h5>
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

DeleteConfirmationModal.propTypes = {
  header: propTypes.string,
  secondP: propTypes.string,
  show: propTypes.bool,
  onClick: propTypes.func,
  onHapus: propTypes.func,
  onSubmit: propTypes.func,
  selectedPenitip: propTypes.object,
  del: propTypes.object,
};

export default DeleteConfirmationModal;
