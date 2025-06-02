// Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./Firebase"; 

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  

  useEffect(() => {
    const fetchLeaderboard = async () => {
        try{
      const leaderboardRef = collection(db, "users");
      const q = query(leaderboardRef, orderBy("xp", "desc"), limit(5));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      setPlayers(data);
      console.log("Leaderboard data:", data);
        }catch(err){
            console.log("Error fetching leaderboard:", err);
        }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 bg-slate-600 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
    <h2 className="text-2xl  text-center text-amber-400 font-extrabold tracking-wide uppercase text-lg mb-6">🏆 LEADERBOARD</h2>
    <ol className="space-y-4">
      {players.map((player, i) => (
      <li key={i} className="flex items-center justify-between bg-slate-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className="flex flex-col">
        <p className="font-semibold text-slate-200 text-xl">
          #{i + 1} {player.name || "Anonymous"}
        </p>
        <p className="text-sm text-slate-200 mt-1">XP: <strong>{player.xp}</strong></p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {player.badges?.map((badge, b) => (
            <span
              key={b}
              className={`text-sm font-semibold px-4 py-2 rounded-full 
                ${badge === "Spotter" ? "bg-teal-500 hover:bg-teal-400" : ""}
                ${badge === "Master" ? "bg-amber-500 hover:bg-amber-400" : ""}
                ${badge === "Explorer" ? "bg-indigo-600 hover:bg-indigo-500" : ""}
                text-white shadow-md transition-all duration-200 ease-in-out`}
              title={badge}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </li>
    
      ))}
    </ol>
  </div>
  
  );
};

export default Leaderboard;
