import React, { useState, useEffect } from "react";

export default function Filter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    category: "",
    isVeg: "",
    priceSort: "",
  });

  // when filters change → send data to parent (Home.jsx)
  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  return (
    <div className="p-4 bg-white w-full h-screen sticky top-20 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Category</label>
        <select
          className="w-full border p-2 rounded"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="Starter">Starter</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Dessert</option>
          <option value="Drinks">Drinks</option>
        </select>
      </div>

      {/* Veg / Non-veg */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Type</label>
        <select
          className="w-full border p-2 rounded"
          value={filters.isVeg}
          onChange={(e) =>
            setFilters({ ...filters, isVeg: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="true">Veg</option>
          <option value="false">Non Veg</option>
        </select>
      </div>

      {/* Price Sorting */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Sort by Price</label>
        <select
          className="w-full border p-2 rounded"
          value={filters.priceSort}
          onChange={(e) =>
            setFilters({ ...filters, priceSort: e.target.value })
          }
        >
          <option value="">Default</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>
    </div>
  );
}
