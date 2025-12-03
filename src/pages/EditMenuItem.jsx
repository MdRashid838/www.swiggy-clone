// EditMenuItem.jsx
import React, { useState, useEffect } from "react";
import api from "../lib/api"; // axios instance with baseURL

export default function EditMenuItem({ itemId, onClose,fetchResMenuItem }) {
  const [item, setItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    isVeg: false,
    deliveryTime: { min: "", max: "" },
    imageFile: null, // new file if user chooses to replace
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchToUpdate = async () => {
    try {
      const res = await api.get(`/menuitem/${itemId}`);
      setItem(res.data.item || res.data); // adjust depending on response
      const i = res.data.item || res.data;
      setForm({
        name: i.name || "",
        description: i.description || "",
        price: i.price || "",
        isVeg: !!i.isVeg,
        deliveryTime: {
          min: i.deliveryTime?.min || "",
          max: i.deliveryTime?.max || "",
        },
        imageFile: null,
      });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchToUpdate();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "imageFile") {
      setForm((s) => ({ ...s, imageFile: files[0] || null }));
    } else if (name === "min" || name === "max") {
      setForm((s) => ({
        ...s,
        deliveryTime: { ...s.deliveryTime, [name]: value },
      }));
    } else if (type === "checkbox") {
      setForm((s) => ({ ...s, [name]: checked }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("isVeg", form.isVeg);
      fd.append("deliveryTime[min]", form.deliveryTime.min);
      fd.append("deliveryTime[max]", form.deliveryTime.max);
      // only append image if user selected a new file
      if (form.imageFile) fd.append("images", form.imageFile);

      // Use PUT or PATCH depending on your backend. If using PUT and sending FormData,
      // don't set Content-Type header manually — axios will set boundary for multipart.
      const res = await api.put(`/menuitem/${itemId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("Updated!");
      // onUpdated && onUpdated(res.data.item || res.data); // notify parent to refresh
      fetchResMenuItem()
      onClose && onClose();
    } catch (err) {
      setMsg(err.response?.data?.error || "Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // if (!item) return <div>Loading...</div>;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-2xl max-h-[90%] overflow-y-scroll scrollbar-hide p-6 rounded-xl shadow-lg relative">
        <form onSubmit={handleSubmit} className="space-y-4">
          {msg && <div className="text-sm text-red-600">{msg}</div>}

          <div>
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Price</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>
              <input
                name="isVeg"
                type="checkbox"
                checked={form.isVeg}
                onChange={handleChange}
              />
              Veg
            </label>
          </div>

          <div>
            <label>Replace Image</label>
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
            <small>If you leave this blank, the current image stays.</small>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
