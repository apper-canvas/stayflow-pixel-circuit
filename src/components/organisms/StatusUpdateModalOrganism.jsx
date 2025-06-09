import React from 'react';
import Modal from '@/components/molecules/Modal';
import StatusUpdateForm from '@/components/organisms/StatusUpdateForm';

const StatusUpdateModalOrganism = ({ room, isOpen, onClose, onSubmit }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Room ${room?.number} Status`}
      modalClassName="max-w-md w-full"
    >
      <StatusUpdateForm
        initialStatus={room?.status}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default StatusUpdateModalOrganism;