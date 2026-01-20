// import React, { useState } from "react";
// import api from "../lib/api";
// import { useSelector } from 'react-redux'
// import Restaurant from "./Restaurant";

// export default function Profile() {
//   const auth = useSelector(s => s.auth);

//   const [isOpen, setIsOpen] = useState(false);
//   const [form, setForm] = useState({
//     restaurant: "",
//     name: "",
//     description: "",
//     price: "",
//     image: "",
//     isVeg: false,
//     deliveryTime: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMsg("");

//     try {
//       const res = await api.post("/", form); // apna backend route
//       setMsg("Menu item added successfully!");
//       setForm({
//         restaurant: "",
//         name: "",
//         description: "",
//         price: "",
//         image: null,
//         isVeg: false,
//         deliveryTime: "",
//       });
//       setIsOpen(false); // close modal after submit
//     } catch (err) {
//       setMsg(err.response?.data?.error || "Something went wrong");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="relative">
//       {/* Profile Section */}
//       <div className='max-w-lg mx-auto bg-white p-6 rounded shadow mt-5'>
//         <h2 className='text-xl font-bold mb-4'>Profile</h2>
//         <div><strong>Name:</strong> {auth.user?.name}</div>
//         <div><strong>Email:</strong> {auth.user?.email}</div>
//         <div><strong>Role:</strong> {auth.user?.role}</div>
//       </div>

//       {/* Add Item Button */}
//       {auth.user?.role == "admin" ?
//       <div>
//       <div>
//       {/* Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white w-full max-w-2xl max-h-[90%] overflow-y-scroll scrollbar-hide p-6 rounded-xl shadow-lg relative">
//             {/* Close Button */}
//             <button
//               onClick={() => setIsOpen(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
//             >
//               &times;
//             </button>

//             <h2 className="text-2xl font-bold mb-6 text-center">Create Menu Item</h2>

//             {msg && (
//               <p className="mb-4 text-center text-sm text-green-600 font-semibold">
//                 {msg}
//               </p>
//             )}

//             <form onSubmit={handleSubmit}>
//               <label className="block mb-2 text-gray-700 text-sm font-semibold">
//                 Restaurant ID
//               </label>
//               <input
//                 type="text"
//                 name="restaurant"
//                 value={form.restaurant}
//                 onChange={handleChange}
//                 className="w-full mb-4 p-2 border rounded"
//                 required
//               />

//               <label className="block mb-2 text-gray-700 text-sm font-semibold">
//                 Item Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 className="w-full mb-4 p-2 border rounded"
//                 required
//               />

//               <label className="block mb-2 text-gray-700 text-sm font-semibold">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 className="w-full mb-4 p-2 border rounded"
//               ></textarea>

//               <label className="block mb-2 text-gray-700 text-sm font-semibold">
//                 Price
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 value={form.price}
//                 onChange={handleChange}
//                 className="w-full mb-4 p-2 border rounded"
//                 required
//               />

//               <label className="block mb-2 text-gray-700 text-sm font-semibold">
//                 Image
//               </label>
//               <input
//                 type="file"
//                 name="image"
//                 value={form.image}
//                 onChange={handleChange}
//                 className="w-full mb-4 p-2 border rounded"
//                 required
//               />

//               <label className="block mb-2 text-gray-700 text-sm font-semibold">
//                 Delivery Time (mins)
//               </label>
//               <input
//                 type="number"
//                 name="deliveryTime"
//                 value={form.deliveryTime}
//                 onChange={handleChange}
//                 className="w-full mb-4 p-2 border rounded"
//               />

//               <div className="flex items-center mb-4">
//                 <input
//                   type="checkbox"
//                   name="isVeg"
//                   checked={form.isVeg}
//                   onChange={handleChange}
//                   className="mr-2"
//                 />
//                 <label className="text-gray-700 text-sm font-semibold">Veg Item</label>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//                 disabled={loading}
//               >
//                 {loading ? "Creating..." : "Create Item"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//       </div>
//       <div>
//         <Restaurant/>
//       </div>
//       </div>
//       :""
//       }
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import api from "../lib/api";
// import { useSelector } from "react-redux";
// import Restaurant from "./Restaurant";
// import ProfileCard from "./ProfileCard";

// export default function Profile() {
//   const auth = useSelector((s) => s.auth);

//   // NEW: profile data from backend
//   const [profileData, setProfileData] = useState(null);

//   const [isOpen, setIsOpen] = useState(false);
//   const [form, setForm] = useState({
//     restaurant: "",
//     name: "",
//     description: "",
//     price: "",
//     image: "",
//     isVeg: false,
//     deliveryTime: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   /* =========================
//      GET PROFILE (ADMIN / USER)
//      ========================= */
//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const res = await api.get("/users/profile");

//       // backend role based response
//       setProfileData(res.data);
//     } catch (err) {
//       console.error("Profile fetch error", err);
//     }
//   };

//   /* =========================
//      UPDATE PROFILE (NAME / IMAGE)
//      ========================= */
//   // const updateProfile = async (data) => {
//   //   try {
//   //     await api.patch("/users/profile", data);
//   //     setMsg("Profile updated successfully");
//   //     fetchProfile();
//   //   } catch (err) {
//   //     setMsg("Profile update failed");
//   //   }
//   // };

//   /* =========================
//      EXISTING HANDLERS (UNCHANGED)
//      ========================= */
//   // const handleChange = (e) => {
//   //   const { name, value, type, checked } = e.target;
//   //   setForm({
//   //     ...form,
//   //     [name]: type === "checkbox" ? checked : value,
//   //   });
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMsg("");

//     try {
//       await api.post("/", form); // existing backend route
//       setMsg("Menu item added successfully!");
//       setForm({
//         restaurant: "",
//         name: "",
//         description: "",
//         price: "",
//         image: "",
//         isVeg: false,
//         deliveryTime: "",
//       });
//       setIsOpen(false);
//     } catch (err) {
//       setMsg(err.response?.data?.error || "Something went wrong");
//     }

//     setLoading(false);
//   };

//   if (!profileData) {
//     return <div>Loading profile...</div>;
//   }

//   console.log("profileData:", profileData);
//   console.log("restaurant:", profileData?.restaurant);
//   console.log(
//     "restaurant keys:",
//     profileData?.restaurant && Object.keys(profileData.restaurant)
//   );
//   console.log(profileData.profile);
//   console.log(profileData.profile.restaurant);

//   return (
//     <div className="flex flex-row">
//       {/* ================= PROFILE SECTION ================= */}
//       <div className=" bg-white p-6 rounded shadow mt-5">
//         <ProfileCard />
//         {/* <h2 className="text-xl font-bold mb-4">Profile</h2>

//         <div>
//           <strong>Name:</strong> {profileData?.profile?.name}
//         </div>
//         <div>
//           <strong>Email:</strong> {profileData?.profile?.email}
//         </div>
//         <div>
//           <strong>Role:</strong> {profileData?.profile?.role}
//         </div> */}
//       </div>

//       <div className="w-full">
//         {/* ================= ADMIN VIEW ================= */}
//         {auth.user?.role === "admin" && (
//           <>
//             {/* All Users */}
//             {/* <div className="max-w-lg mx-auto mt-4 bg-white p-4 rounded shadow">
//             <h3 className="font-semibold mb-2">All Users</h3>
//             {profileData?.users?.map((u) => (
//               <div key={u._id} className="text-sm border-b py-1">
//                 {u.email}
//               </div>
//             ))}
//           </div> */}

//             {/* All Restaurants */}
//             {/* <div className="max-w-lg mx-auto mt-4 bg-white p-4 rounded shadow">
//             <h3 className="font-semibold mb-2">All Restaurants</h3>
//             {profileData?.restaurants?.map((r) => (
//               <div key={r._id} className="text-sm border-b py-1">
//                 {r.name}
//               </div>
//             ))}
//           </div> */}

//             {/* Existing Restaurant Component */}
//             <Restaurant />
//           </>
//         )}

//         {/* ================= USER VIEW ================= */}
//         {/* {auth.user?.role === "user" && (
//           <>

//             {profileData?.restaurant && (
//               <div className="max-w-lg mx-auto mt-4 bg-white p-4 rounded shadow">
//                 <h3 className="font-semibold">My Restaurant</h3>
//                 <p>{profileData.restaurant.name}</p>
//               </div>
//             )}

//             {profileData?.items && (
//               <div className="max-w-lg mx-auto mt-4 bg-white p-4 rounded shadow">
//                 <h3 className="font-semibold mb-2">My Items</h3>
//                 {profileData.items.map((item) => (
//                   <div key={item._id} className="text-sm border-b py-1">
//                     {item.name} – ₹{item.price}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )} */}

//         {auth.user?.role === "user" && (
//           <>
//             {/* CASE 1: User HAS restaurant */}
//             {profileData?.profile?.restaurant ? (
//               <>
//                 {/* My Restaurant */}
//                 <div className="max-w-lg mx-auto mt-4 bg-white p-4 rounded shadow">
//                   <h3 className="font-semibold">My Restaurant</h3>
//                   <p>{profileData.profile.restaurant.name}</p>
//                   <p>{profileData.profile.restaurant.rating}</p>
//                   <p>{profileData.profile.restaurant.address}</p>
//                 </div>

//                 {/* My Items */}
//                 {/* {[profileData]?.items && profileData.items.length > 0 && ( */}
//                   <div className="max-w-lg mx-auto mt-4 bg-white p-4 rounded shadow">
//                     <h3 className="font-semibold mb-2">My Items</h3>
//                     {profileData.profile.restaurant.items.map((item) => (
//                       <div key={item._id} className="text-sm border-b py-1">
//                         {item.name} – ₹{item.price}
//                       </div>
//                     ))}
//                   </div>
//                 {/* )} */}
//               </>
//             ) : (
//               /* CASE 2: User has NO restaurant */
//               <div>
//                 <Restaurant />
//               </div>
//             )}
//           </>
//         )}

//         {/* ================= EXISTING ADMIN MODAL (UNCHANGED) ================= */}
//         {auth.user?.role === "admin" && isOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white w-full max-w-2xl max-h-[90%] overflow-y-scroll p-6 rounded-xl shadow-lg relative">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="absolute top-3 right-3 text-xl font-bold"
//               >
//                 &times;
//               </button>

//               <h2 className="text-2xl font-bold mb-6 text-center">
//                 Create Menu Item
//               </h2>

//               {msg && (
//                 <p className="mb-4 text-center text-sm text-green-600">{msg}</p>
//               )}

//               <form onSubmit={handleSubmit}>{/* form fields unchanged */}</form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useSelector } from "react-redux";
import Restaurant from "./Restaurant";
import ProfileCard from "./ProfileCard";
import AddItems from "./AddItems";

export default function Profile() {
  const auth = useSelector((s) => s.auth);

  const [profileData, setProfileData] = useState(null);

  /* =========================
     GET PROFILE
     ========================= */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setProfileData(res.data);
    } catch (err) {
      console.error("Profile fetch error", err);
    }
  };

  /* =========================
     LOADING STATE (VERY IMPORTANT)
     ========================= */
  if (!profileData || !profileData.profile) {
    return <div>Loading profile...</div>;
  }

  const restaurant = profileData.profile.restaurant;
  console.log(restaurant, "pppppppppppppppp");

  return (
    <div className="flex flex-row gap-5">
      {/* ================= PROFILE SECTION ================= */}
      {/* <div className="w-[30%] sticky top-20 bg-white rounded shadow"> */}
      <ProfileCard />
      {/* </div> */}

      <div className="w-full">
        {/* ================= ADMIN VIEW ================= */}
        {auth.user?.role === "admin" && <Restaurant />}

        {/* ================= USER VIEW ================= */}
        {auth.user?.role === "user" && (
          <>
            {/* ===== CASE 1: USER HAS RESTAURANT ===== */}
            {restaurant ? (
              <div className="flex flex-col md:flex-row gap-5">
                {/* ===== MY ITEMS ===== */}
                <div className="w-full max-w-[70%] bg-white rounded shadow">
                  <AddItems restaurant={restaurant}/>
                  {/* {Array.isArray(restaurant.items) &&
                  restaurant.items.length > 0 ? (
                    restaurant.items.map((item) => (
                      <div key={item._id} className="text-sm border-b py-1">
                        {item.name} – ₹{item.price}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No items added yet</p>
                  )} */}
                </div>
                {/* ===== MY RESTAURANT ===== */}
                <div className="max-w-[30%] w-full mx-auto sticky top-20 z-[-10] bg-white p-4 rounded shadow">
                  <h3 className="font-semibold">My Restaurant</h3>
                  <div className="flex flex-col gap-2">
                    <img
                      src={`https://swiggy-backend-fyo3.onrender.com/${restaurant.images}`}
                      alt="image"
                    />
                    <div className="flex flex-col gap-1">
                      <p>{restaurant.name}</p>
                      {restaurant.rating && <p>Rating: {restaurant.rating}</p>}
                      {restaurant.location?.address && (
                        <p>{restaurant.location.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ===== CASE 2: USER HAS NO RESTAURANT ===== */
              <Restaurant />
            )}
          </>
        )}
      </div>
    </div>
  );
}
