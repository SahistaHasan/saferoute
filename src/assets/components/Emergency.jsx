import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EmergencyAlert = () => {
  const [message, setMessage] = useState("🚨 This is an emergency! Please respond immediately.");
  const [location, setLocation] = useState("Detecting location...");
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    const updateLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            try {
              const apiKey = "d0660f3b-c47a-41b1-89c0-a01b596ebaf1";
              const response = await fetch(
                `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/rev_geocode?lat=${lat}&lng=${lng}`
              );
              const data = await response.json();

              if (data.results && data.results.length > 0) {
                setLocation(data.results[0].formatted_address);
              } else {
                setLocation("Location not found");
              }
            } catch (error) {
              console.error("Error fetching location:", error);
              setLocation("Error fetching location");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLocation("Unable to get location");
          }
        );
      } else {
        setLocation("Geolocation not supported");
      }
    };

    // Initial call + interval
    updateLocation();
    const intervalId = setInterval(updateLocation, 60000); // every 1 min

    return () => clearInterval(intervalId); // cleanup
  }, []);

  const sendEmail = () => {
    const mailtoLink = `mailto:contact1@example.com,contact2@example.com?subject=${encodeURIComponent(
      "🚨 Emergency Alert"
    )}&body=${encodeURIComponent(`${message}\n\n📍 Location:\n${location}`)}`;
    window.location.href = mailtoLink;

    const newPoints = points + 10;
    setPoints(newPoints);
    if (newPoints >= 100) {
      setLevel(3);
      setBadge("Heroic Responder");
    } else if (newPoints >= 50) {
      setLevel(2);
      setBadge("Responder");
    }
  };

  const resetGame = () => {
    setPoints(0);
    setLevel(1);
    setBadge(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white/20 backdrop-blur-lg text-white p-8 rounded-3xl shadow-2xl"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
          🚨 Emergency Alert System
        </h1>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 p-4 rounded-lg bg-white/70 text-gray-900 text-lg shadow-lg outline-none resize-none border border-white/30 focus:ring-2 focus:ring-blue-400"
          placeholder="Enter emergency message"
        ></textarea>

        <div className="mt-4 p-4 bg-white/30 rounded-xl shadow-md text-sm sm:text-base">
          <strong>📍 Location:</strong>
          <p>{location}</p>
        </div>

        <div className="mt-6 p-4 bg-green-100 text-gray-800 rounded-xl shadow-md">
          <strong>🕹️ Progress:</strong>
          <p>Points: {points}</p>
          <p>Level: {level}</p>
          {badge && <p>🏅 Badge: {badge}</p>}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={sendEmail}
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-lg font-bold px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105"
          >
            🚀 Send Emergency Alert
          </button>

          <button
            onClick={resetGame}
            className="bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-md transition hover:scale-105"
          >
            🔄 Reset Progress
          </button>
        </div>

        <div className="mt-6">
          <div className="bg-white/40 h-3 rounded-full">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${points % 100}%` }}
            ></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyAlert;

