import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaDirections,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaRegEdit,
  FaRegEye,
} from "react-icons/fa";
import { auth } from "./Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const SafeRouteHomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500 text-white relative overflow-hidden">
      {/* Auth Buttons */}
      <div className="absolute top-6 right-6 flex gap-4 z-10">
        {!user ? (
          <>
            <Link
              to="/signin"
              className="bg-white/20 text-white font-medium px-4 py-2 rounded-full backdrop-blur-md border border-white/30 hover:bg-white/30 transition duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-yellow-300 text-black font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className={`${
              signingOut ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
            } bg-red-500 text-white font-medium px-4 py-2 rounded-full shadow-md transition duration-300`}
          >
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        )}
      </div>

      {/* Hero Section with Emergency */}
      <div className="flex flex-col items-center justify-center text-center py-28 px-4 backdrop-blur-xl bg-white/10 rounded-3xl mx-6 mt-24 shadow-xl border border-white/20">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl font-extrabold drop-shadow-lg"
        >
          Navigate Safely with{" "}
          <span className="text-yellow-300">SafeRoute 🚦</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-lg text-white/90 max-w-xl"
        >
          Discover secure paths, avoid danger zones, and find nearby safe
          places—effortlessly.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6"
        >
          <Link
            to="/emergency"
            className="flex flex-col items-center bg-red-600 text-white py-4 px-6 rounded-xl shadow-xl backdrop-blur-md border border-red-400 hover:bg-red-700 transition-all duration-300"
          >
            <div className="text-3xl mb-1">
              <FaExclamationTriangle />
            </div>
            <span className="text-md font-semibold">Emergency</span>
          </Link>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full flex flex-wrap justify-center gap-4 px-4 py-10">
        <NavTab icon={<FaDirections />} label="Pathfinder" to="/pathfinder" />
        <NavTab icon={<FaMapMarkerAlt />} label="Nearby Places" to="/nearbyplaces" />
        <NavTab icon={<FaShieldAlt />} label="Safe Guide" to="/safeguide" />
        <NavTab icon={<FaRegEye />} label="View Incidents" to="/display" />
        <NavTab
          icon={<FaRegEdit />}
          label="Report Incidents"
          to="/report"
          disabled={!user}
        />
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-white/80 py-6">
        &copy; 2025 SafeRoute. All rights reserved.
      </footer>
    </div>
  );
};

// ✅ NavTab Component with Equal Height
const NavTab = ({ icon, label, to, disabled }) => {
  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.05, rotate: 1 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <Link
        to={disabled ? "#" : to}
        onClick={(e) => disabled && e.preventDefault()}
        className={`flex flex-col justify-center items-center 
        py-4 px-4 w-32 h-36
        rounded-lg shadow-md backdrop-blur-md border text-center transition-all duration-300
        ${
          disabled
            ? "bg-white/10 text-white/40 border-white/5 cursor-not-allowed"
            : "bg-white/20 text-white border-white/10 hover:bg-white/30"
        }`}
      >
        <div className="text-2xl mb-2">{icon}</div>
        <span className="text-sm font-semibold">{label}</span>
      </Link>
    </motion.div>
  );
};

export default SafeRouteHomePage;
