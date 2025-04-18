import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';

function AlertModal({ show, onHide, message }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();  // Automatically hide after 1 second
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  const dialogStyle = {
    position: 'fixed',
    top: '15px',
    left: '50%',
    transform: 'translateX(-50%)',
    margin: 0,
    zIndex: 1060,
  };

  const contentStyle = {
    backgroundColor: '#d1e7dd', // success green
    border: '1px solid #badbcc',
    borderRadius: '8px',
    padding: '10px 20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    textAlign: 'center',
    fontWeight: 'bold',
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop={false}
      keyboard={false}
      style={dialogStyle}
      dialogClassName=""
    >
      <div style={contentStyle}>
        {message}
      </div>
    </Modal>
  );
}

export default AlertModal;
