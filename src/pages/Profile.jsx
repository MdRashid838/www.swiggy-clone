import React, { useState } from "react";
import api from "../lib/api";
import { useSelector } from 'react-redux'
import Restaurant from "./Restaurant";

export default function Profile() {
  const auth = useSelector(s => s.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    restaurant: "",
    name: "",
    description: "",
    price: "",
    image: "",
    isVeg: false,
    deliveryTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/", form); // apna backend route
      setMsg("Menu item added successfully!");
      setForm({
        restaurant: "",
        name: "",
        description: "",
        price: "",
        image: null,
        isVeg: false,
        deliveryTime: "",
      });
      setIsOpen(false); // close modal after submit
    } catch (err) {
      setMsg(err.response?.data?.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="relative">
      {/* Profile Section */}
      <div className='max-w-lg mx-auto bg-white p-6 rounded shadow mt-5'>
        <h2 className='text-xl font-bold mb-4'>Profile</h2>
        <div><strong>Name:</strong> {auth.user?.name}</div>
        <div><strong>Email:</strong> {auth.user?.email}</div>
        <div><strong>Role:</strong> {auth.user?.role}</div>
      </div>

      {/* Add Item Button */}
      {auth.user?.role == "admin" ?
      <div>
      <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white mt-5 ml-5 rounded hover:bg-blue-700 transition"
      >
        Add Item
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-2xl max-h-[90%] overflow-y-scroll scrollbar-hide p-6 rounded-xl shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">Create Menu Item</h2>

            {msg && (
              <p className="mb-4 text-center text-sm text-green-600 font-semibold">
                {msg}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Restaurant ID
              </label>
              <input
                type="text"
                name="restaurant"
                value={form.restaurant}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              ></textarea>

              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Image
              </label>
              <input
                type="file"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Delivery Time (mins)
              </label>
              <input
                type="number"
                name="deliveryTime"
                value={form.deliveryTime}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              />

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={form.isVeg}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-semibold">Veg Item</label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Item"}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
      <div>
        <Restaurant/>
      </div>
      </div>
      :""
      }
    </div>
  );
}
