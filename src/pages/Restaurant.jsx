import React, { useState, useEffect } from "react";
import api from "../lib/api";
import {Link } from "react-router-dom"
import { X } from "lucide-react"

export default function Restaurant() {
  const [showPopup, setShowPopup] = useState(false);

  const [restaurants, setRestaurants] = useState([]);

  const [createResto, setCreateResto] = useState({
    name: "",
    rating: "",
    ratingCount: "",
    isOpen: false,
    images: null,
    location: {
      address: "",
      lat: "",
      lng: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // fetch restaurants
 async function fetchRestaurants() {
  try {
    const res = await api.get("/restaurant");

    const data = res.data.data || res.data || [];
    setRestaurants(Array.isArray(data) ? data : []);

  } catch (err) {
    console.error(err);
  }
}


  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["address", "lat", "lng"].includes(name)) {
      setCreateResto({
        ...createResto,
        location: {
          ...createResto.location,
          [name]: value,
        },
      });
    } else if (name === "isOpen") {
      setCreateResto({ ...createResto, isOpen: value === "true" });
    } else {
      setCreateResto({ ...createResto, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const formData = new FormData();
      formData.append("name", createResto.name);
      formData.append("rating", createResto.rating);
      formData.append("ratingCount", createResto.ratingCount);
      formData.append("isOpen", createResto.isOpen.toString());
      formData.append("address", createResto.location.address);
      formData.append("lat", createResto.location.lat);
      formData.append("lng", createResto.location.lng);

      if (createResto.images) {
        formData.append("images", createResto.images);
      }

      const token = localStorage.getItem("token"); // fetch token

      const res = await api.post("/restaurant", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("New Restaurant added!");

      setCreateResto({
        name: "",
        rating: "",
        ratingCount: "",
        isOpen: false,
        images: null,
        location: { address: "", lat: "", lng: "" },
      });

      setShowPopup(false);
      fetchRestaurants();
    } catch (err) {
      setMsg(err.response?.data?.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {" "}
      {/* add restaurent button */}
      <div className="flex justify-between items-center mb-4">
        {" "}
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Restaurant
        </button>
      </div>
      {/* Restaurant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {restaurants.map((item) => (
          <Link
            to={`/restaurant/${item._id}`}
            key={item._id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={`https://swiggy-backend-fyo3.onrender.com/${item.images?.[0]}`}
              className="h-40 w-full object-cover"
              alt="restaurant"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600 text-sm">{item?.location?.address}</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-yellow-500 font-bold">
                  ★ {item.rating}
                </span>
                <span className="text-gray-500 ml-2">({item.ratingCount})</span>
              </div>
              <p
                className={`mt-1 text-sm font-semibold ${
                  item.isOpen ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.isOpen ? "Open Now" : "Closed"}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl relative">
            <h2 className="text-xl font-bold mb-4">Add Restaurant</h2>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-xl"
            >
              <X />
            </button>

            {msg && (
              <p className="mb-4 text-center text-sm text-green-600 font-semibold">
                {msg}
              </p>
            )}

            {/* Form */}
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                name="name"
                type="text"
                value={createResto.name}
                onChange={handleChange}
                placeholder="Restaurant Name"
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="address"
                type="text"
                value={createResto.location.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border p-2 rounded"
              />

              <input
                name="rating"
                type="number"
                value={createResto.rating}
                onChange={handleChange}
                placeholder="Rating (1-5)"
                className="w-full border p-2 rounded"
              />

              <input
                name="ratingCount"
                type="number"
                value={createResto.ratingCount}
                onChange={handleChange}
                placeholder="Rating Count"
                className="w-full border p-2 rounded"
              />

              <select
                name="isOpen"
                value={createResto.isOpen}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value={false}>Closed</option>
                <option value={true}>Open</option>
              </select>

              <input
                type="file"
                onChange={(e) =>
                  setCreateResto({ ...createResto, images: e.target.files[0] })
                }
                className="w-full border p-2 rounded"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Restaurant"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
