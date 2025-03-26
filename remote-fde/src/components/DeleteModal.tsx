import React, { useState } from "react";
import { Button, Modal, ModalProps } from "antd";

interface DeleteModalProps {
  // Content props
  title?: string;
  content?: React.ReactNode;
  okText?: string;
  cancelText?: string;

  // Style props
  buttonText?: string;
  buttonType?: "primary"  | "dashed" | "link" | "text" | "default";
  danger?: boolean;

  // Event handlers
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;

  // Modal props
  modalProps?: Omit<ModalProps, "open" | "onOk" | "onCancel" | "title">;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  title = "Confirm Delete",
  content = <h3>Are you sure you want to delete this item?</h3>,
  okText = "Delete",
  cancelText = "Cancel",
  buttonText = "Delete",
  buttonType = "primary",
  danger = true,
  onConfirm,
  onCancel,
  modalProps = {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (onConfirm) {
      try {
        setIsLoading(true);
        await onConfirm();
      } finally {
        setIsLoading(false);
        setIsModalOpen(false);
      }
    } else {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type={buttonType} onClick={showModal} danger={danger}>
        {buttonText}
      </Button>

      <Modal
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isLoading}
        okText={okText}
        cancelText={cancelText}
        okButtonProps={{ danger }}
        {...modalProps}
      >
        {content}
      </Modal>
    </>
  );
};

export default DeleteModal;
