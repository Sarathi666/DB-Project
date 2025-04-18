import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import NavbarComponent from './components/Navbar';
import ClientTable from './components/ClientTable';
import ClientForm from './components/ClientForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AlertModal from './components/AlertModal';
import ProfileModal from './components/ProfileModal';

function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showRegisterSuccessAlert, setShowRegisterSuccessAlert] = useState(false);
  const [showRegisterFailureAlert, setShowRegisterFailureAlert] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  
  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    const storedUser = sessionStorage.getItem('user');
    
    if (authStatus && storedUser) {
      setIsAuthenticated(true);
      const parsedUser = JSON.parse(storedUser);
      setUserData({ name: parsedUser.name, email: parsedUser.email });
  
      // Fetch clients specific to the logged-in user
      const storedClients = JSON.parse(sessionStorage.getItem('clients')) || [];
      const userClients = storedClients.filter(client => client.consultantId === parsedUser.email);
      setClients(userClients); // Set only the client's data that matches the current user
    }
  }, []); // This runs once when the component is mounted or updated
  
  const handleLogin = (e) => {
    e.preventDefault();
    const isValid = validateLogin(loginData);
    if (isValid) {
      const users = JSON.parse(sessionStorage.getItem('users')) || [];
      const loggedInUser = users.find(
        (user) =>
          user.email === loginData.email &&
          user.password === loginData.password
      );
  
      setIsAuthenticated(true);
      setShowLogin(false);
      sessionStorage.setItem('isAuthenticated', true);
      sessionStorage.setItem(
        'user',
        JSON.stringify({ name: loggedInUser.name, email: loggedInUser.email })
      );
      setUserData({ name: loggedInUser.name, email: loggedInUser.email });
  
      // After login, fetch clients specific to the logged-in user
      const storedClients = JSON.parse(sessionStorage.getItem('clients')) || [];
      const userClients = storedClients.filter(client => client.consultantId === loggedInUser.email);
      setClients(userClients); // Update clients state
      setShowSuccessAlert(true);
    } else {
      setShowErrorAlert(true);
    }
  };

  const validateLogin = (userData) => {
    const users = JSON.parse(sessionStorage.getItem('users')) || [];
    return users.some(
      (user) => user.email === userData.email && user.password === userData.password
    );
  };

  const handleLogout = () => {
    setClients([]);
    setShowLogoutAlert(true);
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    setShowProfileModal(false);
    setTimeout(() => {
      setShowLogoutAlert(false);
    }, 1000);
  };

  const handleSaveClient = (clientData, isEdit = false) => {
    const storedClients = JSON.parse(sessionStorage.getItem('clients')) || [];
  
    let updatedClients;
  
    if (isEdit) {
      updatedClients = storedClients.map(c =>
        c.consultantId === userData.email && c.name === editingClient.name
          ? { ...clientData, consultantId: userData.email }
          : c
      );
    } else {
      const fullClientData = { ...clientData, consultantId: userData.email };
      updatedClients = [...storedClients, fullClientData];
    }
  
    sessionStorage.setItem('clients', JSON.stringify(updatedClients));
    setClients(updatedClients.filter(c => c.consultantId === userData.email));
    setEditingClient(null); // clear editing state
    setShowClientForm(false);
  };
  
  
  const handleEditClient = (client) => {
    setEditingClient(client); // Set the client to be edited
    setShowClientForm(true); // Open the form for editing
  };

  const handleDeleteAccount = () => {
    const users = JSON.parse(sessionStorage.getItem('users')) || [];
    const updatedUsers = users.filter(
      (user) => user.email !== loginData.email
    );
    sessionStorage.setItem('users', JSON.stringify(updatedUsers));
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setShowDeleteConfirm(true);
    setShowProfileModal(false);

    setShowDeleteAlert(true);
    setTimeout(() => {
      setShowDeleteAlert(false);
    }, 3000);

    setTimeout(() => {
      setShowDeleteConfirm(false);
    }, 1000);
  };

  const handleRegister = (newUser) => {
    const users = JSON.parse(sessionStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.email === newUser.email);

    if (existingUser) {
      setShowRegisterFailureAlert(true);
      return;
    }

    users.push(newUser);
    sessionStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('isAuthenticated', true);
    sessionStorage.setItem('user', JSON.stringify({ name: newUser.name, email: newUser.email }));

    setShowRegister(false);
    setShowLogin(true);
    setShowRegisterSuccessAlert(true);
  };

  return (
    <>
      <NavbarComponent
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={() => setShowProfileModal(true)}
        onAddClientClick={() => setShowClientForm(true)}
      />

      <Container className="mt-4">
        {isAuthenticated ? (
          <>
            <ClientTable clients={clients} onEdit={handleEditClient} />
            <ClientForm
  show={showClientForm}
  onHide={() => {
    setShowClientForm(false);
    setEditingClient(null); // clear on close
  }}
  onSave={handleSaveClient}
  editingClient={editingClient}
/>
          </>
        ) : (
          <h5 className="text-center">Please log in or register to get started.</h5>
        )}
      </Container>

      <LoginForm
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setShowRegister={setShowRegister}
        loginData={loginData}
        setLoginData={setLoginData}
        handleLogin={handleLogin}
      />

      <RegisterForm
        show={showRegister}
        onHide={() => setShowRegister(false)}
        onRegister={handleRegister}
      />

      <ProfileModal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        onLogoutClick={handleLogout}
        showDeleteAlert={showDeleteAlert}
        onDeleteClick={handleDeleteAccount}
        name={userData.name}
        email={userData.email}
      />

      <AlertModal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        message="Account deleted successfully!"
      />

      <AlertModal
        show={showLogoutAlert}
        onHide={() => setShowLogoutAlert(false)}
        message="Logout successful!"
      />

      <AlertModal
        show={showRegisterSuccessAlert}
        onHide={() => setShowRegisterSuccessAlert(false)}
        message="Registration Successful! Please log in now."
      />

      <AlertModal
        show={showRegisterFailureAlert}
        onHide={() => setShowRegisterFailureAlert(false)}
        message="Registration Failed! Email already exists."
      />

      <AlertModal
        show={showSuccessAlert}
        onHide={() => setShowSuccessAlert(false)}
        message="Login Successful!"
      />

      <AlertModal
        show={showErrorAlert}
        onHide={() => setShowErrorAlert(false)}
        message="Invalid credentials! Please register or try again"
      />
    </>
  );
}

export default HomePage;
