import React, { useState } from "react";
import api from "../lib/api";

const CreateMenuItem = () => {
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
      const res = await api.post(
        "/",  // ⭐ apna backend route daalna
        form
      );

      setMsg("Menu item added successfully!");
      setForm({
        restaurant: "",
        name: "",
        description: "",
        price: "",
        image: "",
        isVeg: false,
        deliveryTime: "",
      });
    } catch (err) {
      setMsg(err.response?.data?.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center py-10 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Menu Item</h2>

        {msg && (
          <p className="mb-4 text-center text-sm text-green-600 font-semibold">
            {msg}
          </p>
        )}

        {/* Restaurant ID */}
        <label className="block mb-2 text-gray-700 text-sm font-semibold">
          Restaurant ID
        </label>
        <input
          type="text"
          name="restaurant"
          value={form.restaurant}
          onChange={handleChange}
          placeholder="Enter restaurant ID"
          className="w-full mb-4 p-2 border rounded focus:ring focus:ring-blue-300"
          required
        />

        {/* Name */}
        <label className="block mb-2 text-gray-700 text-sm font-semibold">
          Item Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter item name"
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Description */}
        <label className="block mb-2 text-gray-700 text-sm font-semibold">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter description"
          className="w-full mb-4 p-2 border rounded"
        ></textarea>

        {/* Price */}
        <label className="block mb-2 text-gray-700 text-sm font-semibold">
          Price
        </label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Image URL */}
        <label className="block mb-2 text-gray-700 text-sm font-semibold">
          Image URL
        </label>
        <input
          type="text"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Enter image link"
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Delivery Time */}
        <label className="block mb-2 text-gray-700 text-sm font-semibold">
          Delivery Time (mins)
        </label>
        <input
          type="number"
          name="deliveryTime"
          value={form.deliveryTime}
          onChange={handleChange}
          placeholder="Ex: 30"
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Veg / Non-Veg */}
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Create Item"}
        </button>
      </form>
    </div>
  );
};

export default CreateMenuItem;
