import React, { useState, useEffect } from 'react';
import { Container,Modal,Navbar, Nav, Button,Form } from 'react-bootstrap';
import logo from './assets/logo.jpeg';
import axios from 'axios';


//alert modal
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

//navbar
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

//register form
function RegisterForm({ show, onHide, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const newUser = { name,email, password };
    onRegister(newUser); // Register the user and show login modal
    setName('');
    // Clear form fields
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>

        <Form.Group controlId="formName">
  <Form.Label>Name</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter your name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />
</Form.Group>


          <Form.Group controlId="registerEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="registerPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

//login form
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

//profile modal

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
      const fetchUser = () => {
        const token = localStorage.getItem('token');
        fetch('/api/auth/user', {
          method: 'GET',
          headers: {
            'x-auth-token': token, // Include the token here
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('User data:', data);
            setUserData({
              name: data.name || 'No Name Provided',
              email: data.email || 'No Email Provided',
            });
          })
          .catch((error) => {
            console.error('Error fetching user:', error);
          });
      };

      fetchUser();
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
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
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




//client form

function ClientForm({ show, onHide, onSave, editingClient, userData }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [goals, setGoals] = useState(['']);
  const [bodyFat, setBodyFat] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [activityLevel, setActivityLevel] = useState('Sedentary');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name || '');
      setAge(editingClient.age || '');
      setGender(editingClient.gender || 'Male');
      setGoals(editingClient.goals && editingClient.goals.length > 0 ? editingClient.goals : ['']);

      setBodyFat(editingClient.bodyFat || '');
      setBloodSugar(editingClient.bloodSugar || '');
      setActivityLevel(editingClient.activityLevel || 'Sedentary');
      setMedicalConditions(editingClient.medicalConditions || '');
      setEmail(editingClient.email || '');
    } else {
      setName('');
      setAge('');
      setGender('Male');
      setGoals(['']);
      setBodyFat('');
      setBloodSugar('');
      setActivityLevel('Sedentary');
      setMedicalConditions('');
      setEmail('');
    }
  }, [editingClient]);


  const handleSubmit =  async(e) => {
    e.preventDefault();
    const clientData = {
      name,
      age,
      gender,
      goals, 
      bodyFat,
      bloodSugar,
      activityLevel,
      medicalConditions,
      email,
      consultantEmail: userData.email,  // ✅ attach the logged-in consultant's email
    };
    console.log("🚀 Submitting client data:", clientData);
    const token = localStorage.getItem('token');

  if (!token) {
    console.error("No token found, user might not be logged in.");
    return;
  }
  onSave(e, clientData);
 
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingClient ? 'Update Client' : 'Add Client'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Client name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
  <Form.Label>Email</Form.Label>
  <Form.Control
    type="email"
    placeholder="Enter client's email"
    value={email}  // New state for email
    onChange={(e) => setEmail(e.target.value)}  // Update the email state
    required
  />
</Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
  <Form.Label>Goal</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter your goal"
    value={goals[0]}  // Always use the first goal as there's only one
    onChange={(e) => setGoals([e.target.value])}  // Update only the first goal
    required
  />
</Form.Group>


          {/* Additional Fields */}
          <Form.Group className="mb-3">
            <Form.Label>Body Fat %</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="60"
              placeholder="e.g., 20"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Blood Sugar (mg/dL)</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 90"
              value={bloodSugar}
              onChange={(e) => setBloodSugar(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Activity Level</Form.Label>
            <Form.Select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
              <option>Sedentary</option>
              <option>Lightly Active</option>
              <option>Moderately Active</option>
              <option>Very Active</option>
              <option>Extra Active</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Medical Conditions</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Diabetes, Hypertension"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
            />
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {editingClient ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}




//home page
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
  const [showDeletecliConfirm, setShowDeletecliConfirm] = useState(false);

const [showClientDeleteAlert, setShowClientDeleteAlert] = useState(false); // New Alert for Client deleted
const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    if (isAuthenticated && userData?.email) {
      fetchClients(userData.email);
    }
  }, [isAuthenticated, userData]);
  
 
  const fetchClients = async (email) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/api/clients?email=${email}`, {
        headers: {
          'x-auth-token': token,
        },
      });
  
      if (response.status === 200) {
        setClients(response.data);
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error fetching clients:', error.response?.data || error.message);
    }
  };
  

//client table
function ClientTable({ clients, onEdit,onDelete }) {
  if (!clients || clients.length === 0) {
    return <p>No clients found.</p>;
  }

  return (
    <table className="table table-bordered mt-4">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Goal</th>
          <th>Body Fat</th>
          <th>Blood Sugar</th>
          <th>Activity Level</th>
          <th>Medical Conditions</th>
          <th>Workout Plan</th> {/* 🏋️ New Column */}
          <th>Diet Plan</th>    {/* 🥗 New Column */}
          
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client, idx) => (
          <tr key={idx}>
            <td>{client.name}</td>
            <td>{client.email}</td> {/* Updated field */}
            <td>{client.age}</td>
            <td>{client.gender}</td>
            <td>{client.goals?.[0] || '-'}</td> 

            <td>{client.bodyFat}</td> {/* Updated field */}
            <td>{client.bloodSugar}</td> {/* Updated field */}
            <td>{client.activityLevel}</td> {/* Updated field */}
            <td>{client.medicalConditions || 'N/A'}</td> {/* Updated field */}
            <td>{client.workoutPlan || 'Not Matched'}</td> {/* 🏋️ Show matched workout */}
            <td>{client.dietPlan || 'Not Matched'}</td>     {/* 🥗 Show matched diet */}
            <td>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => onEdit(client)}
              >
                Update
              </button><hr/>

        {/* 🗑️ Delete Button */}
       <button
  className="btn btn-sm btn-danger"
  onClick={() => {
    setSelectedClientId(client._id);
    setShowDeletecliConfirm(true);
  }}
>
  Delete
</button>

            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


  const handleSubmit = async (e, clientData) => {
    e.preventDefault();
      const token = localStorage.getItem('token');
    
      if (!token) {
        console.error("No token found, user might not be logged in.");
        return;
      }
    
      try {
        let response; // define response first
      
        if (editingClient) {
          // ✏️ UPDATE existing client
          console.log('Trying to update client:', editingClient._id);
          console.log('With data:', clientData);
          response = await axios.put(
            `http://localhost:5000/api/clients/${editingClient._id}`,
            clientData,
            {
              headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
              },
            }
          );
        } else {
          // ➕ ADD new client
          response = await axios.post(
            'http://localhost:5000/api/clients',
            clientData,
            {
              headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
              },
            }
          );
        }
      
        if (response.status === 200 || response.status === 201) {
          console.log('Client saved successfully:', response.data);
          fetchClients(userData.email); // refresh updated clients from server
          setShowClientForm(false);     // close the form modal
          setEditingClient(null);       // clear editing client
          
        }
      } catch (err) {
        console.error("Client creation error:", err.message || err);
       
      }
      
    };      

   const handleDeleteClient = (clientId) => {
  setSelectedClientId(clientId);      // Save the ID of the client you want to delete
  setShowDeleteConfirm(true);          // Open the confirm modal
};

const handleConfirmDelete = async () => {
  const token = localStorage.getItem('token');
  
  try {
    await axios.delete(`http://localhost:5000/api/clients/${selectedClientId}`, {
      headers: { 'x-auth-token': token }
    });
    fetchClients(userData.email);    // Refresh the client table
    setShowDeletecliConfirm(false);  
    setSelectedClientId(null)
    setShowClientDeleteAlert(true)   // Close the modal after deletion
  } catch (error) {
    console.error('Error deleting client:', error.response?.data || error.message);
    setShowDeletecliConfirm(false);   
    setSelectedClientId(null)    // Close the modal even on error
  }
};


  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    })
      .then(async res => {
        const contentType = res.headers.get("content-type");
  
        // Handle non-OK responses (like 400/401/500)
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Login failed");
        }
  
        // Safely parse JSON if content-type is correct
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          throw new Error("Server did not return JSON");
        }
      })
      .then(data => {
        if (data.token) {
          // ✅ Save token to localStorage for future authenticated requests
          localStorage.setItem('token', data.token);
  
          // ✅ Optionally store user info
          setUserData({ name: data.user.name, email: data.user.email });
  
          // ✅ Auth state management
          setIsAuthenticated(true);
          setShowLogin(false);
          fetchClients(data.user.email);
          setShowSuccessAlert(true);
        } else {
          setShowErrorAlert(true);
        }
      })
      .catch(error => {
        console.error("Login error:", error.message);
        setShowErrorAlert(true);
      });
  };
  

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setClients([]);
    setIsAuthenticated(false);
    setShowLogoutAlert(true);
    setShowProfileModal(false);
    setTimeout(() => setShowLogoutAlert(false), 1000);
  };

 
  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleDeleteAccount = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/auth/delete', {
      method: 'DELETE',
      headers: { 'x-auth-token': token },
    } )
      .then(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setShowDeleteConfirm(true);
        setShowDeleteAlert(true);
        setShowProfileModal(false);
        setTimeout(() => setShowDeleteAlert(false), 3000);
        setTimeout(() => setShowDeleteConfirm(false), 1000);
      });
      
  };

  const handleRegister = (newUser) => {
    fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          console.error(`Registration error: ${res.statusText}`);
          throw new Error('Network response was not ok');
        }
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        } else {
          throw new Error('Invalid JSON response from server');
        }
      })
      .then(data => {
        if (data.token) {
          setShowRegister(false);
          setShowLogin(true);
          setShowRegisterSuccessAlert(true);
        } else {
          setShowRegisterFailureAlert(true);
        }
      })
      .catch(err => {
        console.error('Registration error:', err);
        setShowRegisterFailureAlert(true);
      });
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
            <ClientTable clients={clients} onEdit={handleEditClient}   onDelete={handleDeleteClient} />
            <ClientForm
              show={showClientForm}
              onHide={() => {
                setShowClientForm(false);
                setEditingClient(null);
              }}
             
              onSave={handleSubmit} 
              editingClient={editingClient}
              userData={userData} // ✅ pass this
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

      <AlertModal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} message="Account deleted successfully!" />
      <AlertModal show={showLogoutAlert} onHide={() => setShowLogoutAlert(false)} message="Logout successful!" />
      <AlertModal show={showRegisterSuccessAlert} onHide={() => setShowRegisterSuccessAlert(false)} message="Registration Successful! Please log in now." />
      <AlertModal show={showRegisterFailureAlert} onHide={() => setShowRegisterFailureAlert(false)} message="Registration Failed! Email already exists." />
      <AlertModal show={showSuccessAlert} onHide={() => setShowSuccessAlert(false)} message="Login Successful!" />
      <AlertModal show={showErrorAlert} onHide={() => setShowErrorAlert(false)} message="Invalid credentials! Please register or try again" />
 <AlertModal
  show={showClientDeleteAlert}
  onHide={() => setShowClientDeleteAlert(false)}
  message="Client deleted successfully!"
/>

<Modal show={showDeletecliConfirm} onHide={() => setShowDeletecliConfirm(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Deletion</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to delete this client?</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDeletecliConfirm(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleConfirmDelete}>
      Confirm
    </Button>
  </Modal.Footer>
</Modal>


   </>
  );
}

export default HomePage;
