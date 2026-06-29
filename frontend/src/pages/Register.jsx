import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {Link} from "react-router-dom";
import {
  Mail, Lock, User, Phone, Eye, EyeOff,
  ShieldCheck, RefreshCw, CheckCircle2, Moon, Sun, ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const OTP_TIMER = 60;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function Field({ label, icon, error, isDark, rightEl, ...props }) {
  return (
    <div >
      <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </label>
      <div
        className={`flex items-center  border rounded-lg mt-1 px-3 focus-within:ring-2 ${error
          ? "border-red-400 focus-within:ring-red-300"
          : isDark
            ? "border-gray-600 focus-within:ring-blue-500 bg-gray-700"
            : "border-gray-300 focus-within:ring-black bg-white"
          } ${props.disabled ? "opacity-60" : ""}`}
      >
        <span className={isDark ? "text-gray-500" : "text-gray-400"}>{icon}</span>
        <input
          className={`w-full p-2 outline-none text-sm ${isDark
            ? "bg-gray-700 text-white placeholder-gray-500"
            : "bg-white text-black placeholder-gray-400"
            } ${props.disabled ? "cursor-not-allowed" : ""}`}
          {...props}
        />
        {rightEl}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: signUp, sendOtp, verifyOtp, resendOtp, authLoading } = useAuth();;
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});


  const [otpStep, setOtpStep] = useState("idle");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendFailed, setSendFailed] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const emailVerified = otpStep === "verified";
  const isSending = otpStep === "sending" || otpStep === "verifying";
  const nameAndEmailFilled = name.trim().length > 0 && email.trim().length > 0;
  const allFieldsFilled = nameAndEmailFilled && phone.trim().length > 0 && password.trim().length >= 6;
  const canCreate = allFieldsFilled && emailVerified;
  const showVerifyBtn = nameAndEmailFilled && !emailVerified && otpStep !== "sent" && otpStep !== "verifying";


  useEffect(() => { setSendFailed(false); }, [name, email]);

  useEffect(() => () => { timerRef.current && clearInterval(timerRef.current); }, []);

  const startTimer = () => {
    setTimer(OTP_TIMER);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // ── Send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    setSendFailed(false);
    setOtpStep("sending");
    setOtpError("");
    setOtpValue("");
    try {
      await sendOtp(name.trim(), email.trim());
      setOtpStep("sent");
      startTimer();
    } catch {
      setOtpStep("idle");
      setSendFailed(true);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────
  const handleResendOtp = async () => {
    setOtpStep("sending");
    setOtpError("");
    setOtpValue("");
    try {
      await resendOtp(email.trim());
      setOtpStep("sent");
      startTimer();
    } catch {
      setOtpStep("sent");
      setOtpError("Resend failed. Try again.");
    }
  };

  // ── Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otpValue.trim()) { setOtpError("Please enter the OTP."); return; }
    setOtpStep("verifying");
    setOtpError("");
    try {
      await verifyOtp(email.trim(), otpValue.trim());
      setOtpStep("verified");
    } catch {
      setOtpStep("sent");
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@")) newErrors.email = "Enter a valid email";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    try {
      await signUp({ name, email, phone, password });
      navigate("/login");
    } catch {
      setErrors({ form: "Sign up failed. Try again." });
    }
  };

  return (
    <div
      className={`min-h-screen  p-5 sm:p-2 flex items-center justify-center overflow-hidden transition-colors duration-300 ${isDark ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-100 to-gray-200"
        }`}
    >
      {/* Theme toggle */}
      <motion.button
        className={`absolute top-6 right-6 p-2 rounded-lg transition-colors duration-300 ${isDark ? "bg-gray-800 text-yellow-400 cursor-pointer hover:bg-gray-700" : "bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300"
          }`}
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isDark ? "Light Mode" : "Dark Mode"}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md mt-5 shadow-xl rounded-2xl p-4 sm:p-8 transition-colors duration-300 ${isDark ? "bg-gray-800" : "bg-white"
          }`}
      >
        <h2 className={`text-2xl font-bold text-center mb-1 ${isDark ? "text-white" : "text-black"}`}>
          Create Account
        </h2>
        <p className={`text-center text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Book your first ride in under a minute.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <Field
            label="Full Name"
            type="text"
            placeholder="your name"
            icon={<User size={18} />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={emailVerified}
            error={errors.name}
            isDark={isDark}
          />

          {/* Email + verified badge */}
          <div>
            <Field
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailVerified || otpStep === "sent" || otpStep === "verifying"}
              error={errors.email}
              isDark={isDark}
              rightEl={
                emailVerified ? (
                  <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-500 whitespace-nowrap ml-1">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                ) : null
              }
            />
            {emailVerified && (
              <div className="mt-1 flex sm:hidden items-center gap-1.5 px-1">
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600">Email verified</span>
              </div>
            )}
          </div>

          {/* Verify Email button — shown when name+email filled, OTP not yet sent/verified */}
          {showVerifyBtn && (
            <motion.button
              type="button"
              onClick={handleSendOtp}
              disabled={isSending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 font-medium text-sm transition cursor-pointer disabled:opacity-60 ${isDark ? "border-blue-500 text-blue-400 hover:bg-blue-500/10" : "border-black text-black hover:bg-gray-100"
                }`}
            >
              {otpStep === "sending" ? (
                <span className={`size-4 animate-spin rounded-full border-2 border-t-current ${isDark ? "border-blue-400/30 border-t-blue-400" : "border-black/30 border-t-black"}`} />
              ) : (
                <><ShieldCheck size={16} />{sendFailed ? "Retry Verify Email" : "Verify Email"}</>
              )}
            </motion.button>
          )}

          {/* OTP input box — shown after sendOtp succeeds, hidden after verified */}
          {(otpStep === "sent" || otpStep === "verifying") && (
            <motion.div
              variants={fadeUp} initial="hidden" animate="show"
              className={`rounded-xl border p-3 space-y-3 ${isDark ? "border-gray-600 bg-gray-700/50" : "border-gray-200 bg-gray-50"}`}
            >
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                We sent a 6-digit code to{" "}
                <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{email}</span>
              </p>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Enter OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => { setOtpValue(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                  placeholder="• • • • • •"
                  disabled={otpStep === "verifying"}
                  className={`h-10 w-full rounded-lg border px-4 text-center text-lg font-bold tracking-[0.4em] outline-none transition focus:ring-2 ${otpError
                    ? "border-red-400 bg-red-50 text-red-600 focus:ring-red-200"
                    : isDark
                      ? "border-gray-600 bg-gray-700 text-white focus:ring-blue-500/40"
                      : "border-gray-300 bg-white text-black focus:ring-black/20"
                    }`}
                />
                {otpError && <p className="mt-1 text-xs text-red-500">{otpError}</p>}
              </div>

              <motion.button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpStep === "verifying" || otpValue.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition cursor-pointer disabled:opacity-50 ${isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-black hover:bg-gray-800 text-white"
                  }`}
              >
                {otpStep === "verifying" ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <><ShieldCheck size={15} /> Confirm OTP</>
                )}
              </motion.button>

              {/* Timer + Resend */}
              <div className="flex items-center justify-between text-xs">
                {timer > 0 ? (
                  <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                    Resend in <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>{timer}s</span>
                  </span>
                ) : (
                  <span className={isDark ? "text-gray-400" : "text-gray-500"}>Didn't receive it?</span>
                )}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0 || otpStep === "verifying"}
                  className={`flex items-center gap-1 font-semibold transition hover:underline disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${isDark ? "text-blue-400" : "text-black"
                    }`}
                >
                  <RefreshCw size={12} /> Resend OTP
                </button>
              </div>
            </motion.div>
          )}

          {/* Phone + Password + Submit — revealed only after email verified */}
          {emailVerified && (
            <>
              <motion.div variants={fadeUp} initial="hidden" animate="show">
                <Field
                  label="Phone"
                  type="tel"
                  placeholder="98765 43210"
                  icon={<Phone size={18} />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  isDark={isDark}
                />
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="show">
                <Field
                  label="Password"
                  type={showPass ? "text" : "password"}
                  placeholder="At least 6 characters"
                  icon={<Lock size={18} />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  isDark={isDark}
                  rightEl={
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      tabIndex={-1}
                      className={`cursor-pointer ${isDark ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-black"}`}
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={authLoading || !canCreate}
                whileHover={canCreate ? { scale: 1.03 } : {}}
                whileTap={canCreate ? { scale: 0.97 } : {}}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-black hover:bg-gray-800 text-white"
                  }`}
              >
                {authLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </span>
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </motion.button>
            </>
          )}
        </form>

        {/* Divider + Sign in */}
        <p className={`text-center text-sm mt-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          If you have an account?{" "}
          <Link
            to="/login"
            className={`font-medium cursor-pointer hover:underline ${isDark ? "text-blue-400" : "text-black"}`}
          >
            login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}