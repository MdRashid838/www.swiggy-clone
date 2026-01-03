import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import ForgotPassword from "./ForgetPassword";

const Login = () => {
  const [mode, setMode] = useState("password"); // password | otp
  const [step, setStep] = useState(1); // 1=email, 2=otp
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  /* ================= LOGIN WITH PASSWORD ================= */
  const loginWithPassword = async () => {
  if (!agree) return setError("Please accept Terms & Conditions");

  try {
    setLoading(true);
    setError("");

    const res = await api.post("/users/login", { email, password });

    // ✅ SAVE TOKEN (VERY IMPORTANT)
    localStorage.setItem("token", res.data.token);

    dispatch(
      setAuth({
        token: res.data.token,
        user: res.data.user,
      })
    );

    setSuccess("Login successful 🎉");
    navigate("/");

    console.log(res.data);
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  /* ================= SEND LOGIN OTP ================= */
  const sendLoginOtp = async () => {
    if (!agree) return setError("Please accept Terms & Conditions");

    try {
      setLoading(true);
      setError("");

      await api.post("/users/login/send-otp", { email });

      setOtp(Array(6).fill(""));
      setTimer(60);
      setCanResend(false);
      setStep(2);
      setSuccess("OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY LOGIN OTP ================= */
  const verifyLoginOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/users/login/otp", {
        email,
        otp: otp.join(""),
      });
      dispatch(
        setAuth({
          token: res.data.token,
          user: res.data.user,
        })
      );

      setSuccess("Login successful 🎉");
      console.log(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP INPUT ================= */
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
    <div className="min-h-screen flex items-center justify-center z-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center text-[#0A2540] mb-6">
          Login
        </h2>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {success && <p className="mb-3 text-sm text-green-600">{success}</p>}

        {/* MODE SWITCH */}
        <div className="flex justify-center gap-4 mb-4 text-sm">
          <button
            onClick={() => {
              setMode("password");
              setStep(1);
            }}
            className={
              mode === "password"
                ? "font-semibold text-[#2563EB]"
                : "text-gray-500"
            }
          >
            Password
          </button>
          <button
            onClick={() => {
              setMode("otp");
              setStep(1);
            }}
            className={
              mode === "otp" ? "font-semibold text-[#2563EB]" : "text-gray-500"
            }
          >
            OTP
          </button>
        </div>

        {/* EMAIL */}
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled={step > 1}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border rounded-lg px-4 py-2 mb-3
            ${step > 1 ? "bg-gray-100" : "focus:ring-2 focus:ring-[#2563EB]"}`}
        />

        {/* PASSWORD LOGIN */}
        {mode === "password" && (
          <>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-[#2563EB]"
            />

            <button
              onClick={loginWithPassword}
              disabled={loading}
              className="w-full bg-[#0A2540] text-white py-2 rounded-lg hover:bg-[#020617]"
            >
              Login
            </button>
          </>
        )}

        {/* OTP LOGIN */}
        {mode === "otp" && step === 1 && (
          <button
            onClick={sendLoginOtp}
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-2 rounded-lg"
          >
            Send OTP
          </button>
        )}

        {mode === "otp" && step === 2 && (
          <>
            <div className="flex justify-between my-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  value={digit}
                  maxLength="1"
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className="w-11 h-12 text-center border rounded-lg text-lg focus:ring-2 focus:ring-[#2563EB]"
                />
              ))}
            </div>

            <div className="flex justify-between text-sm mb-3">
              <span>
                {canResend ? "Didn’t receive OTP?" : `Resend in ${timer}s`}
              </span>
              <button
                disabled={!canResend}
                onClick={sendLoginOtp}
                className="text-[#2563EB] font-medium disabled:opacity-40"
              >
                Resend OTP
              </button>
            </div>

            <button
              onClick={verifyLoginOtp}
              disabled={otp.join("").length !== 6}
              className="w-full bg-[#2563EB] text-white py-2 rounded-lg"
            >
              Verify & Login
            </button>
          </>
        )}

        {/* TERMS */}
        <div className="flex items-center mt-4 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="mr-2"
          />
          <span>
            I agree to the{" "}
            <span className="text-[#2563EB]">Terms & Conditions</span>
          </span>
        </div>

        {/* FORGOT PASSWORD */}
        <p
          onClick={() => navigate("/forgot-password")}
          className="text-center text-sm mt-4 text-[#2563EB] cursor-pointer"
        >
          Forgot Pasword?
        </p>
      </div>
    </div>
  );
};

export default Login;
