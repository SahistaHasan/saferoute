import React, { useState, useEffect } from "react";
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

  if (loading) {
    return <p className="text-white text-lg text-center font-bold mt-6">⏳ Loading incidents...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-lg text-center font-bold mt-6">{error}</p>;
  }

  return (
    <div className="incidents-list p-8 bg-gray-700 via-purple-600 to-pink-600 rounded-2xl shadow-xl max-w-4xl mx-auto my-8"
>
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">🚨 Reported Incidents</h2>
      {incidents.length === 0 ? (
        <p className="text-center text-lg text-gray-300">No incidents reported yet.</p>
      ) : (
        <ul className="space-y-4 bg-gray-500 rounded-xl">
          {incidents.map((incident) => (
            <li key={incident.id} className="p-4 bg-white/20 rounded-lg shadow-md backdrop-blur-md border border-gray-500">
              <p className="text-lg"><strong>Description:</strong> {incident.description}</p>
              <p><strong>📍 Location:</strong> {incident.location}</p>
              <p><strong>⏰ Reported At:</strong> {incident.timestamp ?? "Unknown"}</p>
              <p><strong>👤 Reported By:</strong> {incident.user || "Anonymous"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisplayIncidents;


