import React, { useState } from "react";
import api from "../../lib/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* ================= STEP 1: SEND OTP ================= */
  const sendOTP = async () => {
    if (!email) return setMsg("Email is required");

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });

      setMsg("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setMsg("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2: VERIFY OTP ================= */
  const verifyOTP = async () => {
    if (!otp) return setMsg("OTP is required");

    try {
      setLoading(true);
      await api.post("/auth/verify-otp", { email, otp });

      setMsg("OTP verified");
      setStep(3);
    } catch (err) {
      setMsg("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 3: RESET PASSWORD ================= */
  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return setMsg("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return setMsg("Passwords do not match");
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      setMsg("Password changed successfully ✅");
      setStep(1);

      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMsg("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        Forgot Password
      </h2>

      {msg && (
        <p className="mb-4 text-center text-sm text-blue-600">
          {msg}
        </p>
      )}

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mb-4 px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={sendOTP}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full mb-4 px-4 py-2 border rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOTP}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            className="w-full mb-3 px-4 py-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full mb-4 px-4 py-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={resetPassword}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </>
      )}
    </div>
  );
}
