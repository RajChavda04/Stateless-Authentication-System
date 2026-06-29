import React from 'react'
import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Moon, User, Sun } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  return (
    <div>
      {/* Navbar */}
      <div
        className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-colors duration-300 ${isDark ? "bg-gray-800" : "bg-white"
          }`}
      >
        {/* LEFT: Logo + Name */}
        <div className="flex items-center gap-6">
          <Link to="/admin/dashboard">
            <div className="flex items-center gap-3">
              <h1 className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                 Admin Panel
              </h1>
            </div>
          </Link>

          <Link
            to="/admin/dashboard"
            className={`text-sm sm:text-base font-medium transition-colors duration-300 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"
              }`}
          >
            Home
          </Link>
        </div>

        {/* RIGHT: Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors cursor-pointer duration-300 ${isDark
              ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* Logout */}
          <Link to="/admin/setting">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full cursor-pointer transition-colors duration-300 ${isDark
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            <User size={18} />
          </motion.button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
