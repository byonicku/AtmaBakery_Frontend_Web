import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import propTypes from "prop-types";
import { useConfirm } from "@/hooks/useConfirm";

const AddEditModal = ({
  show,
  onHide,
  size,
  title,
  text,
  children,
  onSubmit,
  onEnter,
  add,
  edit,
  validate,
  isLoadingModal,
  submitButtonText = "Simpan",
  cancelButtonText = "Batal",
  submitButtonVariant = "danger",
  cancelButtonVariant = "danger",
}) => {
  const isDisabled = add?.isPending || edit?.isPending || isLoadingModal;
  const { confirm, modalElement } = useConfirm();

  return (
    <>
      <Modal
        show={show}
        centered
        size={size || "lg"}
        keyboard={false}
        onEnter={onEnter}
        backdrop="static"
      >
        <Form
          onSubmit={async (e) => {
            e.preventDefault();

            (await confirm(
              "Apakah anda yakin ingin menyimpan data ini?",
              "Pastikan data yang anda masukkan sudah benar",
              "Simpan",
              validate
            )) && onSubmit(e);
          }}
        >
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
                  disabled={isDisabled || isLoadingModal}
                >
                  {isDisabled ? "Loading..." : submitButtonText}
                </Button>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Button
                  variant={cancelButtonVariant}
                  className="custom-danger-btn w-100"
                  onClick={onHide}
                  disabled={isDisabled || isLoadingModal}
                >
                  {cancelButtonText}
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Form>
      </Modal>
      {modalElement}
    </>
  );
};

AddEditModal.propTypes = {
  show: propTypes.bool.isRequired,
  onHide: propTypes.func.isRequired,
  size: propTypes.string,
  title: propTypes.string.isRequired,
  text: propTypes.string,
  children: propTypes.node.isRequired,
  onSubmit: propTypes.func.isRequired,
  onEnter: propTypes.func,
  add: propTypes.object,
  edit: propTypes.object,
  validate: propTypes.func,
  isLoadingModal: propTypes.bool,
  submitButtonText: propTypes.string,
  cancelButtonText: propTypes.string,
  submitButtonVariant: propTypes.string,
  cancelButtonVariant: propTypes.string,
};

export default AddEditModal;
