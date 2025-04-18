// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import logo from '../assets/logo.jpeg';

function NavbarComponent({
  isAuthenticated,
  onLoginClick,
  onLogoutClick,
  onAddClientClick
}) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
      <Navbar.Brand href="/">
      <img
  src={logo}
  alt="CalorieFit Logo"
  height="30"
  className="d-inline-block align-top me-2"
/>
{' '}
  CalorieFit
</Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
          {isAuthenticated && (
    <Button
      variant="success"
      className="me-2"
      onClick={onAddClientClick}
    >
      Add Client
    </Button>
  )}
  <Button
    variant={isAuthenticated ? 'outline-warning' : 'outline-light'}
    onClick={isAuthenticated ? onLogoutClick : onLoginClick}
  >
    {isAuthenticated ? 'Profile' : 'Login'}
  </Button>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
