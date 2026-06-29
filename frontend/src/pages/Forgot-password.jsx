import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Moon, Sun, ArrowLeft, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

// step: "email" → "otp" → "reset"
export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email");

  // email step
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // otp step
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // reset step
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetErrors, setResetErrors] = useState({});

  const navigate = useNavigate();
  const { forgotPassword, verifyOtp, resetPassword, authLoading } = useAuth();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;

  // ── countdown timer ──────────────────────────────────────────
  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Step 1: Send OTP ─────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setEmailError("");
    if (!email.trim()) return setEmailError("Email is required");
    if (!emailRegex.test(email.trim())) return setEmailError("Enter a valid email (gmail/yahoo/outlook)");
    try {
      await forgotPassword(email);
      setStep("otp");
      startCountdown();
    } catch {
      // toasted by context
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────
  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      document.getElementById("otp-5")?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    const otpVal = otp.join("");
    if (otpVal.length < 6) return setOtpError("Enter all 6 digits");
    try {
      await verifyOtp(email, otpVal);
      setStep("reset");
    } catch {
      // toasted by context
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await forgotPassword(email);
      setOtp(["", "", "", "", "", ""]);
      startCountdown();
    } catch {
      // toasted by context
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────────
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const validateReset = () => {
    const errs = {};
    if (!password) errs.password = "Password is required";
    else if (!passwordRegex.test(password))
      errs.password = "Min 8 chars, uppercase, lowercase, number & special character";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setResetErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateReset()) return;
    try {
      await resetPassword(email, password, confirmPassword);
      navigate("/login");
    } catch {
      // toasted by context
    }
  };

  // ── shared input wrapper ─────────────────────────────────────
  const inputWrap = `flex items-center border rounded-lg mt-1 px-3 focus-within:ring-2 ${
    isDark ? "border-gray-600 focus-within:ring-blue-500 bg-gray-700" : "border-gray-300 focus-within:ring-black bg-white"
  }`;
  const inputCls = `w-full p-2 outline-none ${
    isDark ? "bg-gray-700 text-white placeholder-gray-500" : "bg-white text-black placeholder-gray-400"
  }`;
  const labelCls = `text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`;
  const submitBtn = `w-full py-2 rounded-lg font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
    isDark ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-black text-white hover:bg-gray-800"
  }`;

  const Spinner = () => (
    <span className="flex items-center justify-center gap-2">
      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    </span>
  );

  const stepTitles = {
    email: { title: "Forgot Password", sub: "Enter your email and we'll send you a reset OTP" },
    otp: { title: "Verify OTP", sub: `Enter the 6-digit code sent to ${email}` },
    reset: { title: "Reset Password", sub: "Create a new strong password" },
  };

  return (
    <div className={`min-h-screen p-5 overflow-hidden sm:p-2 flex items-center justify-center transition-colors duration-300 ${
      isDark ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-100 to-gray-200"
    }`}>

      {/* Theme toggle */}
      <motion.button
        className={`absolute top-6 right-6 p-2 rounded-lg transition-colors duration-300 ${
          isDark ? "bg-gray-800 text-yellow-400 cursor-pointer hover:bg-gray-700" : "bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300"
        }`}
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md shadow-xl rounded-2xl p-4 sm:p-8 transition-colors duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Back */}
        {step === "email" ? (
          <Link
            to="/login"
            className={`inline-flex items-center gap-1.5 text-sm mb-6 hover:underline ${
              isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-black"
            }`}
          >
            <ArrowLeft size={15} /> Back to Login
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setStep(step === "otp" ? "email" : "otp")}
            className={`inline-flex items-center gap-1.5 text-sm mb-6 hover:underline cursor-pointer ${
              isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-black"
            }`}
          >
            <ArrowLeft size={15} /> Back
          </button>
        )}

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["email", "otp", "reset"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                step === s
                  ? isDark ? "bg-blue-600 text-white" : "bg-black text-white"
                  : ["email", "otp", "reset"].indexOf(step) > i
                    ? "bg-emerald-500 text-white"
                    : isDark ? "bg-gray-600 text-gray-400" : "bg-gray-200 text-gray-400"
              }`}>
                {["email", "otp", "reset"].indexOf(step) > i ? "✓" : i + 1}
              </div>
              {i < 2 && (
                <div className={`w-8 h-px ${
                  ["email", "otp", "reset"].indexOf(step) > i
                    ? "bg-emerald-500" : isDark ? "bg-gray-600" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>

        <h2 className={`text-2xl font-bold text-center mb-1 ${isDark ? "text-white" : "text-black"}`}>
          {stepTitles[step].title}
        </h2>
        <p className={`text-center text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {stepTitles[step].sub}
        </p>

        {/* ── Step 1: Email ── */}
        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.form key="email" variants={fadeUp} initial="hidden" animate="show" exit="exit"
              onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className={labelCls}>Email</label>
                <div className={inputWrap}>
                  <Mail size={18} className={isDark ? "text-gray-500" : "text-gray-400"} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                type="submit" disabled={authLoading} className={submitBtn}
              >
                {authLoading ? <Spinner /> : "Send Reset OTP"}
              </motion.button>
            </motion.form>
          )}

          {/* ── Step 2: OTP ── */}
          {step === "otp" && (
            <motion.form key="otp" variants={fadeUp} initial="hidden" animate="show" exit="exit"
              onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-3 text-center ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Enter 6-digit OTP
                </label>
                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className={`size-11 text-center text-lg font-bold rounded-lg border-2 outline-none transition-colors focus:ring-2 ${
                        isDark
                          ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500/30"
                          : "bg-white text-black border-gray-300 focus:border-black focus:ring-black/10"
                      }`}
                    />
                  ))}
                </div>
                {otpError && <p className="text-red-500 text-sm mt-2 text-center">{otpError}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                type="submit" disabled={authLoading} className={submitBtn}
              >
                {authLoading ? <Spinner /> : <span className="flex items-center justify-center gap-2"><ShieldCheck size={16} /> Verify OTP</span>}
              </motion.button>

              {/* Resend */}
              <p className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Didn't receive it?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || authLoading}
                  className={`font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark ? "text-blue-400 hover:underline" : "text-black hover:underline"
                  }`}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </p>
            </motion.form>
          )}

          {/* ── Step 3: Reset ── */}
          {step === "reset" && (
            <motion.form key="reset" variants={fadeUp} initial="hidden" animate="show" exit="exit"
              onSubmit={handleResetPassword} className="space-y-5">
              {/* New Password */}
              <div>
                <label className={labelCls}>New Password</label>
                <div className={inputWrap}>
                  <Lock size={18} className={isDark ? "text-gray-500" : "text-gray-400"} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className={inputCls}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={`cursor-pointer ${isDark ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-black"}`}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {resetErrors.password && <p className="text-red-500 text-sm mt-1">{resetErrors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className={labelCls}>Confirm Password</label>
                <div className={inputWrap}>
                  <Lock size={18} className={isDark ? "text-gray-500" : "text-gray-400"} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={inputCls}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className={`cursor-pointer ${isDark ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-black"}`}>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {resetErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{resetErrors.confirmPassword}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                type="submit" disabled={authLoading} className={submitBtn}
              >
                {authLoading ? <Spinner /> : "Reset Password"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}