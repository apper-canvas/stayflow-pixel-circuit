import React from 'react';
import Modal from '@/components/molecules/Modal';
import CheckInForm from '@/components/organisms/CheckInForm';

const CheckInModalOrganism = ({ room, isOpen, onClose, onSubmit }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Check-in to Room ${room?.number}`}
      modalClassName="max-w-2xl w-full"
    >
      <CheckInForm
        roomNumber={room?.number}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default CheckInModalOrganism;