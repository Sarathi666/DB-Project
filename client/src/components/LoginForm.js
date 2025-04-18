import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function LoginForm({
  showLogin,
  setShowLogin,
  setShowRegister,
  loginData,
  setLoginData,
  handleLogin,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleLogin}>
        <Modal.Body>
          {/* Email Input */}
          <Form.Group controlId="loginEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="you@example.com"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Password Input */}
          <Form.Group controlId="loginPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Buttons Layout */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            {/* Left: Create Account Button */}
            <Button
              variant="warning"
              onClick={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
            >
              Create an Account
            </Button>

            {/* Right: Cancel and Login Buttons */}
            <div className="d-flex">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowLogin(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}

export default LoginForm;
