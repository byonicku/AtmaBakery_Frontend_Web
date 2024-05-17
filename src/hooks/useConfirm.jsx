import ConfirmationModal from "@/component/Admin/Modal/ConfirmationModal";
import { useState, useRef } from "react";

export function useConfirm() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    header: "",
    secondP: "",
    submitBtnText: "",
  });

  const resolveRef = useRef(null);

  function showModal(
    header,
    secondP,
    submitBtnText,
    isDelete,
    validate = false
  ) {
    if (validate && validate() === 0) return Promise.resolve(false);

    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModalContent({ header, secondP, submitBtnText, isDelete });
      setModalVisible(true);
    });
  }

  function handleChoice(isConfirmed) {
    setModalVisible(false);
    resolveRef.current(isConfirmed);
  }

  return {
    confirm: showModal,
    modalElement: (
      <ConfirmationModal
        header={modalContent.header}
        secondP={modalContent.secondP}
        show={isModalVisible}
        size="md"
        onCancel={() => handleChoice(false)}
        onSubmit={() => handleChoice(true)}
        del={{ isPending: false }}
        isDelete={modalContent.isDelete}
        submitBtnText={modalContent.submitBtnText}
      />
    ),
  };
}
