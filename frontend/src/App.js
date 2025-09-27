import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

const fetchUsers = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`); 
  setUsers(res.data);
};

const addUser = async (e) => {
  e.preventDefault();
  await axios.post(`${process.env.REACT_APP_API_URL}/users`, form); 
  setForm({ name: "", email: "", age: "" });
  fetchUsers();
};

const deleteUser = async (id) => {
  await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`);
  fetchUsers();
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>

      {/* Add User Form */}
      <form onSubmit={addUser}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <button type="submit">Add User</button>
      </form>

      {/* User List */}
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} ({u.email}, {u.age} years)
            <button onClick={() => deleteUser(u._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
