import { useEffect, useRef, useState } from "react";
import api from "../../lib/api";

const Register = () => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=password
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const otpRefs = useRef([]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (step !== 2) return;

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, step]);

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.post("/users/register/send-otp", { email });

      setSuccess("OTP sent to your email");
      setOtp(Array(6).fill(""));
      setTimer(60);
      setCanResend(false);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await api.post("/users/register/verify-otp", {
        email,
        otp: otp.join(""),
      });

      setSuccess("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SET PASSWORD ================= */
  const setUserPassword = async () => {
    try {
      setLoading(true);
      setError("");

      await api.post("/users/register/set-password", {
        email,
        name,
        password,
      });

      setSuccess("Registration completed successfully 🎉");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP INPUT HANDLER ================= */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A2540] to-[#020617] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center text-[#0A2540] mb-6">
          Create Account
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 text-sm text-green-600 bg-green-50 p-2 rounded">
            {success}
          </p>
        )}

        {/* EMAIL */}
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={step > 1}
          className={`w-full border rounded-lg px-4 py-2 mb-4
            ${step > 1
              ? "bg-gray-100 cursor-not-allowed"
              : "focus:ring-2 focus:ring-[#2563EB]"}
          `}
        />

        {/* STEP 1 */}
        {step === 1 && (
          <button
            onClick={sendOtp}
            disabled={!email || loading}
            className="w-full bg-[#0A2540] text-white py-2 rounded-lg hover:bg-[#020617]"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Enter OTP
            </label>
            <div className="flex justify-between mb-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-11 h-12 text-center border rounded-lg text-lg focus:ring-2 focus:ring-[#2563EB]"
                />
              ))}
            </div>

            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-600">
                {canResend ? "Didn’t receive OTP?" : `Resend in ${timer}s`}
              </span>
              <button
                disabled={!canResend}
                onClick={sendOtp}
                className="text-[#2563EB] font-medium disabled:opacity-40"
              >
                Resend OTP
              </button>
            </div>

            <button
              onClick={verifyOtp}
              disabled={otp.join("").length !== 6 || loading}
              className="w-full bg-[#2563EB] text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-[#16A34A]"
            />

            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-[#16A34A]"
            />

            <button
              onClick={setUserPassword}
              disabled={loading}
              className="w-full bg-[#16A34A] text-white py-2 rounded-lg hover:bg-green-700"
            >
              Complete Registration
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
