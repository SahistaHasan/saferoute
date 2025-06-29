// ReportIncident.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, auth } from "./Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ReportIncident = () => {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    initMap1();
  }, []);

  const initMap1 = () => {
    const script1 = document.createElement("script");
    script1.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0&callback=initMap1`;
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk_plugins?v=3.0`;
    script2.async = true;
    document.body.appendChild(script2);

    script1.onload = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const map = new window.mappls.Map("map", {
          center: [latitude, longitude],
          zoom: 14,
        });

        map.addListener("load", () => {
          setLocation(`${latitude}, ${longitude}`);

          const optional_config = {
            location: [latitude, longitude],
            geolocation: true,
            region: "IND",
            height: 250,
            width: 400,
          };

          const searchInput = document.getElementById("auto");
          new window.mappls.search(searchInput, optional_config, callback);

          searchInput.addEventListener("focus", () => {
            new window.mappls.search(searchInput, optional_config, callback);
          });

          function callback(data) {
            if (data && data[0]) {
              const dt = data[0];
              const eloc = dt.eLoc;
              const place = dt.placeName + ", " + dt.placeAddress;
              setLocation(place);

              window.mappls.pinMarker(
                {
                  map,
                  pin: eloc,
                  popupHtml: place,
                  popupOptions: { openPopup: true },
                },
                (marker) => marker.fitbounds()
              );
            }
          }
        });
      });
    };
  };

  const handleReportSubmit = async () => {
    if (!description.trim() || !location.trim()) {
      alert("Please enter a description and select a location.");
      return;
    }

    const currentUser = auth.currentUser;
    const userEmail = currentUser?.email || "Anonymous";

    const report = {
      description,
      location,
      timestamp: serverTimestamp(),
      user: userEmail,
    };

    try {
      await addDoc(collection(db, "incidents"), report);
      alert("Incident reported successfully!");
      setDescription("");
    } catch (error) {
      console.error("Error reporting incident: ", error);
      alert("Error reporting incident.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 text-white flex flex-col lg:flex-row items-center justify-center px-4 py-10 gap-10">
      <div className="w-full lg:w-1/2 max-w-xl bg-white/20 backdrop-blur-lg text-white p-8 rounded-3xl shadow-2xl mt-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">🚨 Report Incident</h1>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-32 p-4 rounded-lg bg-white/70 text-gray-900 text-lg shadow-lg outline-none resize-none border border-white/30 focus:ring-2 focus:ring-blue-400 mb-6"
          placeholder="Enter a brief description of the incident"
        ></textarea>

        <div className="mt-4 p-4 bg-white/30 rounded-xl shadow-md text-sm sm:text-base">
          <strong>📍 Location:</strong>
          <p>{location || "No location selected"}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleReportSubmit}
            className="bg-green-400 hover:bg-green-500 text-black text-lg font-bold px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105"
          >
            🚨 Report Incident
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 max-w-xl bg-gradient-to-br from-[#6a00f4] via-[#d500f9] to-[#ff4ecd] text-white font-sans p-8 rounded-3xl shadow-2xl border border-pink-300 mt-10"
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textShadow: "0 0 10px #ffb3ec" }}
        >
          ✨ Place Search
        </motion.h2>

        <motion.input
          type="text"
          id="auto"
          name="auto"
          placeholder="Search places or eLocs..."
          required
          spellCheck="false"
          className="w-full px-5 py-3 text-base bg-[#2a003f] text-white border border-[#ff80bf] rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#ff4ecd] transition-all duration-300"
          whileFocus={{ scale: 1.03 }}
        />

        <motion.div
          id="map"
          className="w-full h-[300px] mt-8 border border-[#ff80bf] rounded-xl bg-[#1a001f] shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default ReportIncident;