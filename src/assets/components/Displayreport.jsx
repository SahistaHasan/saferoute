import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./Firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const DisplayIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newIncidents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIncidents(newIncidents);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Failed to load incidents.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== "function") return "Unknown";
    return timestamp.toDate().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6a85b6] px-4 py-12">
      <motion.div
        className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-200"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-4xl font-extrabold text-center text-indigo-800 mb-10 drop-shadow-md tracking-wide"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          🚨 Reported Incidents
        </motion.h2>

        {loading ? (
          <p className="text-gray-700 text-center text-lg font-semibold">⏳ Loading incidents...</p>
        ) : error ? (
          <p className="text-red-600 text-center text-lg font-semibold">{error}</p>
        ) : incidents.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No incidents reported yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incidents.map((incident, index) => (
              <motion.li
                key={incident.id}
                className="bg-gradient-to-br from-[#dbeafe] to-[#c7d2fe] rounded-2xl p-6 text-gray-800 shadow hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 border border-indigo-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
              >
                <p className="text-lg font-semibold mb-2">
                  📄 <span className="text-indigo-700">Description:</span> {incident.description}
                </p>
                <p>
                  📍 <span className="text-indigo-600">Location:</span> {incident.location}
                </p>
                <p>
                  ⏰ <span className="text-indigo-500">Reported At:</span> {formatTimestamp(incident.timestamp)}
                </p>
                <p>
                  👤 <span className="text-indigo-400">Reported By:</span> {incident.user || "Anonymous"}
                </p>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default DisplayIncidents;
