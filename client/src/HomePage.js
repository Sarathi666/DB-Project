import React, { useState, useEffect } from 'react';
import { Container,Modal,Navbar, Nav, Button,Form, Table } from 'react-bootstrap';
import logo from './assets/logo.jpeg';
import axios from 'axios';
import { IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';



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

function ProfileModal({ show, onHide, onLogoutClick, onDeleteClick, name, email }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleDelete = () => {
    onDeleteClick();
    setShowDeleteConfirm(false);
  };

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
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
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
            onClick={handleDelete}
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

// Add this new component after the SaveAlertModal component
function PlanDetailsModal({ show, onHide, title, items, type }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>{type === 'workout' ? 'Exercises:' : 'Meals:'}</h6>
        <ul style={{ paddingLeft: '20px' }}>
          {items?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

//client table
function ClientTable({ clients, onEdit, onDelete }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Goals</th>
            <th>Body Fat %</th>
            <th>Blood Sugar</th>
            <th>Activity Level</th>
            <th>Medical Conditions</th>
            <th>Workout Plan</th>
            <th>Diet Plan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.age}</td>
              <td>{client.gender}</td>
              <td>{Array.isArray(client.goals) ? client.goals.join(', ') : client.goals}</td>
              <td>{client.bodyFat}%</td>
              <td>{client.bloodSugar} mg/dL</td>
              <td>{client.activityLevel}</td>
              <td>{client.medicalConditions || 'None'}</td>
              <td>
                {client.matchedWorkoutPlan ? (
                  typeof client.matchedWorkoutPlan === 'string' ? (
                    client.matchedWorkoutPlan
                  ) : (
                    <div>
                      <strong>{client.matchedWorkoutPlan.title}</strong>
                      <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        {client.matchedWorkoutPlan.exercises?.map((exercise, index) => (
                          <li key={index}>{exercise}</li>
                        ))}
                      </ul>
                    </div>
                  )
                ) : (
                  'No plan matched'
                )}
              </td>
              <td>
                {client.matchedDietPlan ? (
                  typeof client.matchedDietPlan === 'string' ? (
                    client.matchedDietPlan
                  ) : (
                    <div>
                      <strong>{client.matchedDietPlan.title}</strong>
                      <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        {client.matchedDietPlan.meals?.map((meal, index) => (
                          <li key={index}>{meal}</li>
                        ))}
                      </ul>
                    </div>
                  )
                ) : (
                  'No plan matched'
                )}
              </td>
              <td>
                <IconButton onClick={() => onEdit(client)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(client._id)}>
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PlanDetailsModal
        show={selectedPlan !== null}
        onHide={() => setSelectedPlan(null)}
        title={selectedPlan?.title || ''}
        items={selectedPlan?.items || []}
        type={selectedPlan?.type || ''}
      />
    </>
  );
}

//client form
function ClientForm({ 
  show, 
  onHide, 
  onSave, 
  editingClient, 
  userData,
  setShowLogin,
  setMatchedPlans,
  setPendingClientData,
  setShowMatchConfirmation,
  setShowClientForm,
  fetchClients,
  setShowSaveAlert
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'Male',
    goals: [''],
    bodyFat: '',
    bloodSugar: '',
    activityLevel: 'Sedentary',
    medicalConditions: '',
    consultantEmail: userData?.email || ''
  });

  useEffect(() => {
    if (editingClient) {
      setFormData({
        name: editingClient.name || '',
        email: editingClient.email || '',
        age: editingClient.age || '',
        gender: editingClient.gender || 'Male',
        goals: editingClient.goals && editingClient.goals.length > 0 ? editingClient.goals : [''],
        bodyFat: editingClient.bodyFat || '',
        bloodSugar: editingClient.bloodSugar || '',
        activityLevel: editingClient.activityLevel || 'Sedentary',
        medicalConditions: editingClient.medicalConditions || '',
        consultantEmail: userData?.email || ''
      });
    }
  }, [editingClient, userData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave(
      e,
      formData,
      setShowLogin,
      setMatchedPlans,
      setPendingClientData,
      setShowMatchConfirmation,
      setShowClientForm,
      fetchClients,
      setShowSaveAlert,
      editingClient?._id
    );
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingClient ? 'Update Client' : 'Add Client'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Client name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
  <Form.Label>Email</Form.Label>
  <Form.Control
    type="email"
              name="email"
    placeholder="Enter client's email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
    required
  />
</Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              min="1"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select 
              name="gender"
              value={formData.gender} 
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
  <Form.Label>Goal</Form.Label>
            <Form.Select
              name="goals"
              value={formData.goals[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, goals: [e.target.value] }))}
    required
            >
              <option value="">Select a goal</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Fat Loss">Fat Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Toning">Toning</option>
              <option value="Mobility">Mobility</option>
              <option value="Performance">Performance</option>
            </Form.Select>
</Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Body Fat %</Form.Label>
            <Form.Control
              type="number"
              name="bodyFat"
              min="1"
              max="60"
              placeholder="e.g., 20"
              value={formData.bodyFat}
              onChange={(e) => setFormData(prev => ({ ...prev, bodyFat: e.target.value }))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Blood Sugar (mg/dL)</Form.Label>
            <Form.Control
              type="number"
              name="bloodSugar"
              placeholder="e.g., 90"
              value={formData.bloodSugar}
              onChange={(e) => setFormData(prev => ({ ...prev, bloodSugar: e.target.value }))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Activity Level</Form.Label>
            <Form.Select 
              name="activityLevel"
              value={formData.activityLevel} 
              onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value }))}
            >
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
              name="medicalConditions"
              placeholder="e.g., Diabetes, Hypertension"
              value={formData.medicalConditions}
              onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
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

// Add this new component after the ClientForm component
function MatchConfirmationModal({ show, onHide, onConfirm, clientData, matchedPlans }) {
  // Add null checks and default values
  const name = clientData?.name || '';
  const goals = Array.isArray(clientData?.goals) ? clientData.goals.join(', ') : clientData?.goals || '';
  const activityLevel = clientData?.activityLevel || '';
  const workoutPlan = matchedPlans?.workoutPlan || 'No matching workout plan found';
  const dietPlan = matchedPlans?.dietPlan || 'No matching diet plan found';

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Match</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h6>Client Details:</h6>
          <p className="mb-1"><strong>Name:</strong> {name}</p>
          <p className="mb-1"><strong>Goal:</strong> {goals}</p>
          <p className="mb-1"><strong>Activity Level:</strong> {activityLevel}</p>
        </div>
        <div className="mb-3">
          <h6>Matched Plans:</h6>
          <div className="p-3 bg-light rounded">
            <p className="mb-2">
              <strong>Workout Plan:</strong><br />
              {workoutPlan}
            </p>
            <p className="mb-0">
              <strong>Diet Plan:</strong><br />
              {dietPlan}
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm & Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// Add this new component after the MatchConfirmationModal component
function SaveAlertModal({ show, onHide, clientData, matchedPlans }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show || !clientData || !matchedPlans) {
    return null;
  }

  const dialogStyle = {
    position: 'fixed',
    top: '15px',
    left: '50%',
    transform: 'translateX(-50%)',
    margin: 0,
    zIndex: 1060,
  };

  const contentStyle = {
    backgroundColor: '#d1e7dd',
    border: '1px solid #badbcc',
    borderRadius: '8px',
    padding: '15px 20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    textAlign: 'left',
    minWidth: '300px',
  };

  // Get plan titles, handling both string and object formats
  const getPlanTitle = (plan) => {
    if (!plan) return 'No matching plan';
    return typeof plan === 'string' ? plan : plan.title || 'Untitled Plan';
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
        <h6 className="mb-2">Client Saved Successfully!</h6>
        <p className="mb-1"><strong>Name:</strong> {clientData?.name || 'N/A'}</p>
        <p className="mb-1"><strong>Goal:</strong> {Array.isArray(clientData?.goals) ? clientData.goals.join(', ') : clientData?.goals || 'N/A'}</p>
        <p className="mb-2"><strong>Activity Level:</strong> {clientData?.activityLevel || 'N/A'}</p>
        <div className="mt-2">
          <p className="mb-1"><strong>Workout Plan:</strong> {getPlanTitle(matchedPlans?.workoutPlan)}</p>
          <p className="mb-0"><strong>Diet Plan:</strong> {getPlanTitle(matchedPlans?.dietPlan)}</p>
        </div>
      </div>
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
  const [showClientDeleteAlert, setShowClientDeleteAlert] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showMatchConfirmation, setShowMatchConfirmation] = useState(false);
  const [pendingClientData, setPendingClientData] = useState(null);
  const [matchedPlans, setMatchedPlans] = useState({ workoutPlan: null, dietPlan: null });
  const [showSaveAlert, setShowSaveAlert] = useState(false);

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
  
  const handleSubmit = async (e, formData, setShowLogin, setMatchedPlans, setPendingClientData, setShowMatchConfirmation, setShowClientForm, fetchClients, setShowSaveAlert, clientId) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("No token found");
      setShowLogin(true);
      return;
    }
    
    try {
      // Get user data from token
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userEmail = tokenData.user.email;
      const userId = tokenData.user.id; // Get the user ID from token

      // Map activity level to server expected values
      const activityLevelMap = {
        'Sedentary': 'Low',
        'Lightly Active': 'Low',
        'Moderately Active': 'Medium',
        'Very Active': 'High',
        'Extra Active': 'High'
      };

      // Format the data
      const formattedData = {
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        goals: Array.isArray(formData.goals) ? formData.goals : [formData.goals],
        bodyFat: parseFloat(formData.bodyFat),
        bloodSugar: parseFloat(formData.bloodSugar),
        activityLevel: activityLevelMap[formData.activityLevel] || 'Low',
        medicalConditions: formData.medicalConditions || '',
        consultantEmail: userEmail,
        createdBy: userId // Use user ID instead of email
      };

      console.log('Sending data to server:', formattedData);

      let response;
      if (clientId) {
        // For updates, send all fields to ensure proper update
        console.log('Updating client with ID:', clientId);
        response = await axios.put(
          `http://localhost:5000/api/clients/${clientId}`,
          formattedData,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          }
        );
      } else {
        // Create new client
        response = await axios.post(
          'http://localhost:5000/api/clients',
          formattedData,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          }
        );
      }
      
      console.log('Server response:', response.data);

      if (response.data) {
        // First set the client data
        setPendingClientData(formData);
        
        // Get the matched plans from the server response
        const serverResponse = response.data;
        const newMatchedPlans = {
          workoutPlan: serverResponse.matchedWorkoutPlan || null,
          dietPlan: serverResponse.matchedDietPlan || null
        };
        
        // Store the matched plans
        setMatchedPlans(newMatchedPlans);
        
        // Close the form
        setShowClientForm(false);
        
        // Refresh the client list
        fetchClients(userEmail);
        
        // Show the alert after a short delay to ensure state updates are complete
        setTimeout(() => {
          setShowSaveAlert(true);
        }, 100);
      }
    } catch (err) {
      console.error("Error getting matches:", err);
      if (err.response?.status === 401) {
        setShowLogin(true);
      } else if (err.response?.data) {
        // Log the specific error message from the server
        console.error("Server error details:", err.response.data);
      }
    }
  };      

   const handleDeleteClient = (clientId) => {
    setSelectedClientId(clientId);
    setShowDeletecliConfirm(true);
};

const handleConfirmDelete = async () => {
  const token = localStorage.getItem('token');
  
  try {
    await axios.delete(`http://localhost:5000/api/clients/${selectedClientId}`, {
      headers: { 'x-auth-token': token }
    });
      fetchClients(userData.email);
    setShowDeletecliConfirm(false);  
      setSelectedClientId(null);
      setShowClientDeleteAlert(true);
  } catch (error) {
    console.error('Error deleting client:', error.response?.data || error.message);
    setShowDeletecliConfirm(false);   
      setSelectedClientId(null);
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
    })
      .then(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setShowProfileModal(false);
        setShowDeleteConfirm(false);
        setShowDeleteAlert(true);
        setTimeout(() => setShowDeleteAlert(false), 3000);
      })
      .catch(error => {
        console.error('Error deleting account:', error);
        setShowDeleteConfirm(false);
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
            <ClientTable clients={clients} onEdit={handleEditClient} onDelete={handleDeleteClient} />
            <ClientForm
              show={showClientForm}
              onHide={() => {
                setShowClientForm(false);
                setEditingClient(null);
              }}
              onSave={handleSubmit} 
              editingClient={editingClient}
              userData={userData}
              setShowLogin={setShowLogin}
              setMatchedPlans={setMatchedPlans}
              setPendingClientData={setPendingClientData}
              setShowMatchConfirmation={setShowMatchConfirmation}
              setShowClientForm={setShowClientForm}
              fetchClients={fetchClients}
              setShowSaveAlert={setShowSaveAlert}
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
        onDeleteClick={handleDeleteAccount}
        name={userData.name}
        email={userData.email}
      />

      {showDeleteAlert && (
        <AlertModal 
          show={showDeleteAlert} 
          onHide={() => setShowDeleteAlert(false)} 
          message="Account deleted successfully!" 
        />
      )}
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

      <MatchConfirmationModal
        show={showMatchConfirmation}
        onHide={() => {
          setShowMatchConfirmation(false);
          setPendingClientData(null);
          setMatchedPlans({ workoutPlan: null, dietPlan: null });
        }}
        onConfirm={handleSubmit}
        clientData={pendingClientData}
        matchedPlans={matchedPlans}
      />

      <SaveAlertModal
        show={showSaveAlert}
        onHide={() => setShowSaveAlert(false)}
        clientData={pendingClientData}
        matchedPlans={matchedPlans}
      />
   </>
  );
}

export default HomePage;
