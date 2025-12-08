import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function RestaurentEditDelete({ restaurentId, fetchRestaurant }) {
  console.log(restaurentId, fetchRestaurant)
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    rating: "",
    ratingCount: "",
    isOpen: false,
    imageFile: null,
    location: {
      address: "",
      lat: "",
      lng: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // ============================
  // Fetch Restaurant to update
  // ============================
  const fetchToUpdate = async () => {
    if (!restaurentId) return;

    try {
      const res = await api.get(`/restaurant/${restaurentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const i = res.data.data || res.data;

      setForm({
        name: i.name || "",
        rating: i.rating || "",
        ratingCount: i.ratingCount || "",
        isOpen: i.isOpen || false,
        imageFile: null,
        location: {
          address: i.location?.address || "",
          lat: i.location?.lat || "",
          lng: i.location?.lng || "",
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchToUpdate();
  }, [restaurentId]);

  // ============================
  // Handle Input Change
  // ============================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile") {
      setForm((prev) => ({ ...prev, imageFile: files[0] || null }));
      return;
    }

    if (["address", "lat", "lng"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
      return;
    }

    if (name === "isOpen") {
      setForm((prev) => ({ ...prev, isOpen: value === "true" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  // Handle Update Submit
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const formData = new FormData();

      // Type casting for backend safety
      formData.append("name", form.name);
      formData.append("rating", Number(form.rating));
      formData.append("ratingCount", Number(form.ratingCount));
      formData.append("isOpen", form.isOpen ? "true" : "false");

      // Nested location
      formData.append("location[address]", form.location.address);
      formData.append("location[lat]", form.location.lat);
      formData.append("location[lng]", form.location.lng);

      // Image
      if (form.imageFile && form.imageFile instanceof File) {
        formData.append("images", form.imageFile);
      }

      await api.put(`/restaurant/${restaurentId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMsg("Updated Successfully!");
      fetchRestaurant();
    } catch (err) {
      console.error(err);
      setMsg("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Handle Delete Restaurant
  // ============================
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    if (!token) {
      alert("Token missing. Please login again.");
      return;
    }

    try {
      await api.delete(`/restaurant/${restaurentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Restaurant deleted successfully!");
      navigate("/profile");
      fetchRestaurant();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  // ============================
  // UI
  // ============================
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl relative">
            <h2 className="text-xl font-bold mb-4">Update Restaurant</h2>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-xl"
            >
              ✖
            </button>

            {msg && <p className="text-center text-green-600">{msg}</p>}

            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="address"
                type="text"
                value={form.location.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="rating"
                type="number"
                value={form.rating}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="ratingCount"
                type="number"
                value={form.ratingCount}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <select
                name="isOpen"
                value={form.isOpen ? "true" : "false"}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="false">Closed</option>
                <option value="true">Open</option>
              </select>

              <div>
                <label>Replace Image</label>
                <input
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                <small>If you leave this blank, the current image stays.</small>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                {loading ? "Updating..." : "Update Restaurant"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
