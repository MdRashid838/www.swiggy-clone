import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useParams, Link } from "react-router-dom";
import EditMenuItem from "./EditMenuItem";

export default function RestaurantDetails() {
  const { id } = useParams();
  const restaurantId = id;
  // const auth = useSelector((s) => s.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [allitems, setAllItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [menuItems, setMenuItems] = useState([]);

  //   console.log(id)
  const [createItems, setCreateItems] = useState({
    restaurant: restaurantId,
    name: "",
    description: "",
    price: "",
    images: null,
    isVeg: false,
    deliveryTime: { min: "", max: "" },
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // fetch restaurants
  const fetchMenuItems = async () => {
    try {
      const res = await api.get(`/restaurant/${restaurantId}`);
      setMenuItems(res.data.data);
    } catch (err) {
      console.log("Error fetching:", err);
    }
  };

  // get restaurent item from restaurent id
  async function fetchResMenuItem() {
    try {
      const res = await api.get(`/menuitem/restaurant/${restaurantId}`);
      setAllItems(res.data); // CORRECT
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchMenuItems();
    fetchResMenuItem();
  }, []);

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;

  //     if (["address", "lat", "lng"].includes(name)) {
  //       setCreateResto({
  //         ...createResto,
  //         location: {
  //           ...createResto.location,
  //           [name]: value,
  //         },
  //       });
  //     } else if (name === "isOpen") {
  //       setCreateResto({ ...createResto, isOpen: value === "true" });
  //     } else {
  //       setCreateResto({ ...createResto, [name]: value });
  //     }
  //   };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "images") {
      setCreateItems({
        ...createItems,
        images: files[0],
      });
    } else if (name === "min" || name === "max") {
      setCreateItems({
        ...createItems,
        deliveryTime: {
          ...createItems.deliveryTime,
          [name]: value,
        },
      });
    } else if (type === "checkbox") {
      setCreateItems({ ...createItems, [name]: checked });
    } else {
      setCreateItems({ ...createItems, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("restaurant", restaurantId);
      fd.append("name", createItems.name);
      fd.append("description", createItems.description);
      fd.append("price", createItems.price);
      fd.append("isVeg", createItems.isVeg);

      fd.append("deliveryTime[min]", createItems.deliveryTime.min);
      fd.append("deliveryTime[max]", createItems.deliveryTime.max);
      // fd.append("images", createItems.images);

      if (createItems.images) {
        fd.append("images", createItems.images);
      }

      // DEBUG: Console me check karein ki FormData me kya ja raha hai
      for (var pair of fd.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      await api.post("/menuitem", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("New Restaurant added!");

      setCreateItems({
        restaurant: restaurantId,
        name: "",
        description: "",
        price: "",
        images: null,
        isVeg: true,
        deliveryTime: { min: "", max: "" },
      });

      setIsOpen(false);
      fetchMenuItems();
      fetchResMenuItem();
    } catch (err) {
      setMsg(err.response?.data?.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {" "}
      <div className="flex justify-between items-center mb-4">
        {" "}
        <h1 className="text-2xl font-bold">{menuItems.name}</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add New Item
        </button>
      </div>
      {/* Restaurant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <img
            src={`${menuItems.images?.[0]}`}
            className="h-40 w-full object-cover"
            alt="restaurant"
          />

          <div className="p-4">
            <h2 className="text-lg font-semibold">{menuItems.name}</h2>
            <p className="text-gray-600 text-sm">
              {menuItems?.location?.address}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-yellow-500 font-bold">
                ★ {menuItems.rating}
              </span>
              <span className="text-gray-500 ml-2">
                ({menuItems.ratingCount})
              </span>
            </div>
            <p
              className={`mt-1 text-sm font-semibold ${
                menuItems.isOpen ? "text-green-600" : "text-red-600"
              }`}
            >
              {menuItems.isOpen ? "Open Now" : "Closed"}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {allitems.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            <img
              src={`https://swiggy-backend-fyo3.onrender/${item.images?.[0]}`}
              alt={item.name}
              className="h-40 w-full object-cover rounded"
            />

            <div className="flex flex-row justify-between items-center">
              <h3 className="mt-2 font-semibold">
                {item.name}
                <span className="ps-2 text-sm">{item.isVeg ? "🟢" : "🔴"}</span>
              </h3>
              <p className="text-sm text-gray-600">★★★★</p>
            </div>

            <p className="text-sm text-gray-600">{item.description}</p>

            <div className="mt-2 flex justify-between items-center">
              <Link
                to={`/menuitem/${item._id}`}
                className="text-sm text-blue-600"
              >
                View
              </Link>

              <div className="text-sm flex flex-row gap-2">
                <p className="font-bold">₹{item.price}</p>
                {item.discount && (
                  <p className="line-through text-green-900 font-medium">
                    {item.discount}% off
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={() => {
                    setSelectedItemId(item._id);
                    setItemOpen(true);
                  }}
                >
                  Edit
                </button>

                {/* <button onClick={() => setIsOpen(true)}>Delete</button> */}
              </div>
            </div>
          </div>
        ))}

        {allitems.length === 0 && (
          <p className="text-gray-600 text-center min-w-full col-span-4">
            No items found
          </p>
        )}
      </div>
      {/* POPUP */}
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

            <h2 className="text-2xl font-bold mb-6 text-center">
              Create Menu Item
            </h2>

            {msg && (
              <p className="mb-4 text-center text-sm text-green-600 font-semibold">
                {msg}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <input type="hidden" value={restaurantId} />

              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={createItems.name}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Description
              </label>
              <textarea
                name="description"
                value={createItems.description}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              ></textarea>

              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={createItems.price}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                images
              </label>
              <input
                type="file"
                name="images"
                onChange={(e) =>
                  setCreateItems({ ...createItems, images: e.target.files[0] })
                }
                className="w-full mb-4 p-2 border rounded"
              />

              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Delivery Time (min)
              </label>
              <input
                type="number"
                name="min"
                value={createItems.deliveryTime.min}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              />
              <label className="block mb-2 text-gray-700 text-sm font-semibold">
                Delivery Time (mix)
              </label>
              <input
                type="number"
                name="max"
                value={createItems.deliveryTime.max}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
              />

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={createItems.isVeg}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-semibold">
                  Veg Item
                </label>
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
      {itemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <EditMenuItem
            itemId={selectedItemId}
            onClose={() => setItemOpen(false)}
            fetchResMenuItem={fetchResMenuItem}
          />
        </div>
      )}
    </div>
  );
}
