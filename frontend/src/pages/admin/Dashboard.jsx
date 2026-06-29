import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Users,
  Car,
  CalendarCheck,
  IndianRupee,
} from "lucide-react";
import Navbaradmin from "../../components/admin/Navbaradmin";

export default function DashboardPage({user}) {
  const { isDark } = useContext(ThemeContext);

  return (
    <>
      <Navbaradmin />

      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark ? "bg-slate-950" : "bg-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-8 shadow-lg ${
              isDark
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 border border-slate-800 text-white"
            }`}
          >
            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>

            <p
              className={`mt-2 ${
                isDark ? "text-slate-400" : "text-indigo-100"
              }`}
            >
              Welcome back, {user?.name}
            </p>
          </motion.div>

         {/* Content */}
      <div className="flex items-center justify-center px-4 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md sm:max-w-lg p-6 sm:p-10 rounded-2xl shadow-lg text-center transition-colors duration-300 ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"
            }`} >
          {/* ✅ Name */}
          <h2 className="text-xl sm:text-2xl font-semibold">
            Welcome, {user?.name} 👋
          </h2>
          <p  className={`mt-2 text-sm sm:text-base ${isDark ? "text-gray-400" : "text-gray-500" }`} >
            You are successfully logged in.
          </p>
        </motion.div>
      </div>
        </div>
      </div>
    </>
  );
}