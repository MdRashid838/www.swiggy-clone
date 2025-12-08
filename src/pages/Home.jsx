import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";
import Filter from "./Filter";
import { useDispatch } from "react-redux";
import { addItem } from "../store/slices/cartSlice";
import { ShoppingCart } from "lucide-react";

export default function MenuItemPage() {
  const [menuItem, setMenuItem] = useState([]);
  const [q, setQ] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    isVeg: "",
    priceSort: "",
  });

  const dispatch = useDispatch();

  // Fetch Menu Items
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
  try {
    const res = await api.get("/menuitem");

    const data = res.data.data || res.data || [];
    setMenuItem(Array.isArray(data) ? data : []);

  } catch (err) {
    console.error(err);
  }
}


  // Search Filter Logic
  const search = menuItem.filter((r) =>
    r.name?.toLowerCase().includes(q.toLowerCase())
  );

  // Apply All Filters
  const finalList = search
    .filter((item) =>
      filters.category ? item.category === filters.category : true
    )
    .filter((item) =>
      filters.isVeg !== "" ? item.isVeg.toString() === filters.isVeg : true
    )
    .sort((a, b) => {
      if (filters.priceSort === "low") return a.price - b.price;
      if (filters.priceSort === "high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="flex flex-row gap-6">
      {/* Left Filter Section */}
      <div className="w-1/4 h-screen sticky top-20">
        <Filter onFilterChange={(f) => setFilters(f)} />
      </div>

      {/* Right Menu List Section */}
      <div className="w-full">
        {/* Search Box */}
        <div className="mb-4 sticky top-20">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search menu item"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Menu Grid */}
        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {finalList.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded shadow">
              <div>
                {/* <span className="z-10 text-right w-full">
                  {" "}
                  <ShoppingCart />{" "}
                </span> */}
                <img
                  src={`https://swiggy-backend-fyo3.onrender.com/${r.images?.[0]}`}
                  alt={r.name}
                  className="h-40 w-full object-cover rounded "
                />
              </div>
              <div className="flex flex-row justify-between items-center">
                <h3 className="mt-2 font-semibold">
                  {r.name}
                  <span className="ps-2 text-sm">{r.isVeg ? "🟢" : "🔴"}</span>
                </h3>
                <p className="text-sm text-gray-600">★★★★</p>
              </div>

              <p className="text-sm text-gray-600">{r.description}</p>
              <button className="text-sm border border-gray-400 px-2 py-1 rounded-full bg-green-600 hover:bg-green-700 text-white" onClick={() => dispatch(addItem(r))}>
                Add to cart
              </button>

              <div className="mt-2 flex justify-between items-center">
                <Link
                  to={`/menuitem/${r._id}`}
                  className="text-sm text-blue-600"
                >
                  View
                </Link>

                <div className="text-sm flex flex-row gap-2">
                  <p className="font-bold">₹{r.price}</p>
                  {r.discount && (
                    <p className="line-through text-green-900 font-medium">
                      {r.discount}% off
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {finalList.length === 0 && (
            <p className="text-gray-600 text-center min-w-full col-span-4">
              No items found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
