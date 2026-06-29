import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon,User, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";


export function HomePage({ user}) {
  const { isDark } = useContext(ThemeContext);

  return (

    <>
    <Navbar user={user}></Navbar>
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-100"
        }`}
    >


      {/* Content */}
      <div className="flex items-center justify-center px-4 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md sm:max-w-lg p-6 sm:p-10 rounded-2xl shadow-lg text-center transition-colors duration-300 ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
        >


          {/* ✅ Name */}
          <h2 className="text-xl sm:text-2xl font-semibold">
            Welcome, {user?.name} 👋
          </h2>

          <p
            className={`mt-2 text-sm sm:text-base ${isDark ? "text-gray-400" : "text-gray-500"
              }`}
          >
            You are successfully logged in.
          </p>
        </motion.div>
      </div>
    </div>
    </>
  );
}

