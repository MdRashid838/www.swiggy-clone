import React, { useState } from "react";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { X } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post("/users/register", { name, email, password });
      alert("Registered! Please login.");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <button onClick={() => nav("/")}> <X /> </button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border p-2 rounded w-full"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border p-2 rounded w-full"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="border p-2 rounded w-full"
          />
          <button className="w-full py-2 bg-green-600 text-white rounded">
            Register
          </button>
          <span className="text-sm text-gray-600 w-full items-center">
            I have Already a Acount <button className=" text-blue-600" onClick={() => nav("/login")}>Login</button>
          </span>
        </form>
      </div>
    </div>
  );
}
