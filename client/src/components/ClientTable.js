// src/components/ClientTable.js
import React from 'react';

function ClientTable({ clients, onEdit }) {
    if (!clients || clients.length === 0) {
      return <p>No clients found.</p>;
    }
  
    return (
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Goals</th>
            <th>Workout Plan</th>
            <th>Diet Plan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, idx) => (
            <tr key={idx}>
              <td>{client.name}</td>
              <td>{client.age}</td>
              <td>{client.gender}</td>
              <td>{client.goals.join(', ')}</td>
              <td>{client.workoutPlan}</td>
              <td>{client.dietPlan}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => onEdit(client)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  
  export default ClientTable;
  