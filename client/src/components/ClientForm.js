// src/components/ClientForm.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ClientForm({ show, onHide, onSave, editingClient }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [goals, setGoals] = useState(['']);
  const [workoutPlan, setWorkoutPlan] = useState('');
  const [dietPlan, setDietPlan] = useState('');

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name || '');
      setAge(editingClient.age || '');
      setGender(editingClient.gender || 'Male');
      setGoals(editingClient.goals || ['']);
      setWorkoutPlan(editingClient.workoutPlan || '');
      setDietPlan(editingClient.dietPlan || '');
    } else {
      setName('');
      setAge('');
      setGender('Male');
      setGoals(['']);
      setWorkoutPlan('');
      setDietPlan('');
    }
  }, [editingClient]);

  const handleGoalChange = (index, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = value;
    setGoals(updatedGoals);
  };

  const addGoalField = () => {
    if (goals.length < 3) setGoals([...goals, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clientData = {
      name,
      age,
      gender,
      goals,
      workoutPlan,
      dietPlan,
    };

    if (typeof onSave === 'function') {
      onSave(clientData, !!editingClient);
    } else {
      console.error("onSave is not defined or not a function");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingClient ? 'Edit Client' : 'Add Client'}</Modal.Title>
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

          <Form.Label>Goals (Max 3)</Form.Label>
          {goals.map((goal, index) => (
            <Form.Group className="mb-2" key={index}>
              <Form.Control
                type="text"
                placeholder={`Goal ${index + 1}`}
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                required
              />
            </Form.Group>
          ))}
          {goals.length < 3 && (
            <Button variant="outline-secondary" size="sm" onClick={addGoalField}>
              + Add Goal
            </Button>
          )}

          <Form.Group className="mt-3 mb-3">
            <Form.Label>Workout Plan</Form.Label>
            <Form.Control
              type="text"
              placeholder="Recommended workout plan"
              value={workoutPlan}
              onChange={(e) => setWorkoutPlan(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Diet Plan</Form.Label>
            <Form.Control
              type="text"
              placeholder="Recommended diet plan"
              value={dietPlan}
              onChange={(e) => setDietPlan(e.target.value)}
              required
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

export default ClientForm;
