import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import propTypes from "prop-types";
import "@/page/Admin/Page/css/Admin.css";

const PrintModal = ({
  show,
  onHide,
  title,
  text,
  children,
  onSubmit,
  submitButtonText = "Print",
  cancelButtonText = "Batal",
  submitButtonVariant = "danger",
  cancelButtonVariant = "danger",
}) => {
  return (
    <Modal show={show} centered keyboard={false} backdrop="static">
      <Form onSubmit={onSubmit}>
        <Modal.Body className="text-center p-4 m-2">
          <h5 style={{ fontWeight: "bold" }}>{title}</h5>
          <p
            style={{ color: "rgb(18,19,20,70%)", fontSize: "1em" }}
            className="mt-1"
          >
            {text}
          </p>
          <div className="mt-3">
            {children} {/* Render the form elements passed as children */}
          </div>
          <Row className="pt-3 gap-2 gap-lg-0 gap-md-0 flex-row-reverse">
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                variant={submitButtonVariant}
                className="custom-agree-btn w-100"
                type="submit"
              >
                {submitButtonText}
              </Button>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                variant={cancelButtonVariant}
                className="custom-danger-btn w-100"
                onClick={onHide}
              >
                {cancelButtonText}
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Form>
    </Modal>
  );
};

PrintModal.propTypes = {
  show: propTypes.bool.isRequired,
  onHide: propTypes.func.isRequired,
  title: propTypes.string.isRequired,
  text: propTypes.string,
  children: propTypes.node.isRequired,
  onSubmit: propTypes.func.isRequired,
  submitButtonText: propTypes.string,
  cancelButtonText: propTypes.string,
  submitButtonVariant: propTypes.string,
  cancelButtonVariant: propTypes.string,
};

export default PrintModal;
