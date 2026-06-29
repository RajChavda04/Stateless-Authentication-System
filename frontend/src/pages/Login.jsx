import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login, authLoading } = useAuth();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const validate = () => {
    const newErrors = {};
    if (!email.includes("@")) newErrors.email = "Enter a valid email";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(email, password);
      navigate("/home");
    } catch {
      setErrors({ form: "Login failed. Please check your credentials." });
    }
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
        title={isDark ? "Light Mode" : "Dark Mode"}
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
        <h2 className={`text-2xl font-bold text-center mb-6 ${isDark ? "text-white" : "text-black"}`}>
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Email
            </label>
            <div className={`flex items-center border rounded-lg mt-1 px-3 focus-within:ring-2 ${
              isDark ? "border-gray-600 focus-within:ring-blue-500 bg-gray-700" : "border-gray-300 focus-within:ring-black bg-white"
            }`}>
              <Mail size={18} className={isDark ? "text-gray-500" : "text-gray-400"} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full p-2 outline-none ${isDark ? "bg-gray-700 text-white placeholder-gray-500" : "bg-white text-black placeholder-gray-400"}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Password
            </label>
            <div className={`flex items-center border rounded-lg mt-1 px-3 focus-within:ring-2 ${
              isDark ? "border-gray-600 focus-within:ring-blue-500 bg-gray-700" : "border-gray-300 focus-within:ring-black bg-white"
            }`}>
              <Lock size={18} className={isDark ? "text-gray-500" : "text-gray-400"} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full p-2 outline-none ${isDark ? "bg-gray-700 text-white placeholder-gray-500" : "bg-white text-black placeholder-gray-400"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`cursor-pointer ${isDark ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-black"}`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className={`text-sm hover:underline ${isDark ? "text-blue-400" : "text-black"}`}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={authLoading}
            className={`w-full py-2 rounded-lg font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {authLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Logging in...
              </span>
            ) : "Login"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className={`text-center text-sm mt-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Don't have an account?{" "}
          <Link
            to="/register"
            className={`font-medium cursor-pointer hover:underline ${isDark ? "text-blue-400" : "text-black"}`}
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}