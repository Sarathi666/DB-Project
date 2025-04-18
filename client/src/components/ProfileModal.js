import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function ProfileModal({ show, onHide, onLogoutClick, onDeleteClick }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    if (show) {
      const user = JSON.parse(sessionStorage.getItem('user')) || {};
      setUserData({
        name: user.name || '',
        email: user.email || '',
      });
    } else {
      setShowDeleteConfirm(false);
    }
  }, [show]);

  return (
    <>
      {/* Profile Modal */}
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'left' }}>
          {/* User info */}
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Name:</strong> {userData.name || 'No Name Provided'}</p>
            <p><strong>Email:</strong> {userData.email || 'No Email Provided'}</p>
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            {/* Left side */}
            <div>
              <Button
                variant="warning"
                onClick={handleDeleteConfirmation}
                style={{ margin: '5px' }}
              >
                Delete Account
              </Button>
            </div>

            {/* Right side */}
            <div>
              <Button
                variant="secondary"
                onClick={onHide}
                style={{ margin: '5px' }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={onLogoutClick}
                style={{ margin: '5px' }}
              >
                Logout
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center' }}>
          <p>Are you sure you want to delete your account?<br /><strong>This action cannot be undone.</strong></p>
          <Button
            variant="danger"
            onClick={onDeleteClick}
            style={{ margin: '5px' }}
          >
            Yes, Delete
          </Button>
          <Button
            variant="secondary"
            onClick={handleCancelDelete}
            style={{ margin: '5px' }}
          >
            Cancel
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProfileModal;
