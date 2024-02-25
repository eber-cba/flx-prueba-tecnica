import React, { useState } from "react";
import { Modal, Spin } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

export function useModalHandler() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleModalOk = (selectedUser, callback) => {
    setIsVisible(false);
    setLoading(true);
    if (selectedUser) {
      setSuccessMessage(`Usuario ${selectedUser.name} editado correctamente.`);
    } else {
      setSuccessMessage("Usuario agregado correctamente.");
    }
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("");
      callback(); // Call the callback function provided by the component
    }, 4000);
  };

  const showModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  return {
    loading,
    successMessage,
    isVisible,
    handleModalOk,
    showModal,
    hideModal,
  };
}

export function ModalWithCustomLogic({
  selectedUser,
  handleModalCancel,
  children,
}) {
  const { loading, successMessage, isVisible, handleModalOk, hideModal } =
    useModalHandler();

  return (
    <Modal
      title={selectedUser ? "Editar Usuario" : "Agregar Usuario"}
      visible={isVisible}
      onCancel={handleModalCancel}
      onOk={() => handleModalOk(selectedUser, hideModal)}
      destroyOnClose={true}
      footer={null}
    >
      {children}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <Spin style={{ marginRight: 10 }} />
          Guardando...
        </div>
      )}
      {successMessage && (
        <div style={{ marginTop: 10, display: "flex", alignItems: "center" }}>
          <CheckCircleOutlined style={{ color: "green", marginRight: 10 }} />
          {successMessage}
        </div>
      )}
    </Modal>
  );
}
