import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch ,useSelector } from "react-redux";
import { clearAuth } from '../store/slices/authSlice'
import { setAuth } from "../store/slices/authSlice";
import { Settings } from "lucide-react";
import api from "../lib/api";

const DUMMY_IMAGE = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const BACKEND_URL = "http://localhost:5000";

export default function UserProfileCard() {
  const auth = useSelector(s => s.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  const fileRef = useRef(null);

  // 🔽 settings popup
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [rotate, setRotate] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    image: "",
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    fetchProfile();
  }, []);

  // Logout
  function handleLogout(){
      dispatch(clearAuth())
      navigate('/')
    }

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      const p = res.data.profile;

      setForm({
        name: p.name || "",
        email: p.email || "",
        role: p.role || "",
        image: p.image
          ? `${BACKEND_URL}/uploads/profiles/${p.image}`
          : DUMMY_IMAGE,
      });
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  /* ================= CLOSE POPUP ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    if (editMode) fileRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
    }));
  };

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {
  if (!editMode) {
    setEditMode(true);
    return;
  }

  try {
    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);

    if (fileRef.current?.files[0]) {
      data.append("image", fileRef.current.files[0]);
    }

    const res = await api.patch("/users/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ REDUX UPDATE (NAVBAR FIX)
    dispatch(
      setAuth({
        ...auth,
        user: {
          ...auth.user,
          name: form.name,
        },
      })
    );

    setMsg("Profile updated successfully");
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3000);

    setEditMode(false);
    fetchProfile();
  } catch (err) {
    console.error("Update error:", err);
    setMsg("Profile update failed");
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3000);
  } finally {
    setLoading(false);
  }
};


  /* ================= LOGOUT ================= */
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/login");
  // };

  /* ================= UI ================= */
  return (
    <div className="max-w-xl mx-auto mt-8">
      {showMsg && (
        <div className="mb-4 p-3 rounded-lg text-center text-sm font-medium bg-green-100 text-green-700">
          {msg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-6 relative">
        {/* ⚙️ SETTINGS ICON */}
        <button
          onClick={() => {
            setShowMenu(!showMenu);
            setRotate(true);

            // rotation reset taaki next click pe fir chale
            setTimeout(() => setRotate(false), 300);
          }}
          className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${
            rotate ? "rotate-360" : ""
          }`}
        >
          <Settings className="text-gray-500 hover:text-gray-700 size-5"/>
        </button>

        {/* SETTINGS POPUP */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-12 right-4 w-44 bg-white rounded-xl shadow-lg border z-50"
          >
            <button
              onClick={() => {
                setShowMenu(false);
                navigate("/update-password");
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-xl"
            >
              Update Password
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-xl"
            >
              🚪 Logout
            </button>
          </div>
        )}

        <h2 className="text-2xl font-bold text-[#0A2540] mb-6 text-center">
          My Profile
        </h2>

        {/* PROFILE IMAGE */}
        <div className="flex justify-center mb-6 relative">
          <img
            src={form.image || DUMMY_IMAGE}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#2563EB]"
            onError={(e) => (e.target.src = DUMMY_IMAGE)}
          />

          {editMode && (
            <button
              onClick={handleImageClick}
              className="absolute bottom-1 right-[40%] bg-[#2563EB] text-white p-2 rounded-full shadow hover:bg-blue-700"
            >
              📷
            </button>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleImageChange}
            hidden
          />
        </div>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full mt-1 px-4 py-2 rounded-lg border ${
              editMode
                ? "focus:ring-2 focus:ring-[#2563EB]"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={form.email}
            disabled
            className="w-full mt-1 px-4 py-2 rounded-lg border bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* ROLE */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">Role</label>
          <input
            type="text"
            value={form.role}
            disabled
            className="w-full mt-1 px-4 py-2 rounded-lg border bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            editMode
              ? "bg-green-600 hover:bg-green-700"
              : "bg-[#0A2540] hover:bg-[#020617]"
          }`}
        >
          {loading ? "Saving..." : editMode ? "Save Profile" : "Update Profile"}
        </button>
      </div>
    </div>
  );
}
