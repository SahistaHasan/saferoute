import React, { useEffect, useState } from "react";

const NearbySearchMap = () => {
  const token = "d0660f3b-c47a-41b1-89c0-a01b596ebaf1";
  const [map, setMap] = useState(null);
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });

    const initMap = async () => {
      await loadScript(
        `https://apis.mappls.com/advancedmaps/api/${token}/map_sdk?layer=vector&v=3.0`
      );
      await loadScript(
        `https://apis.mappls.com/advancedmaps/api/${token}/map_sdk_plugins?v=3.0`
      );

      const mapInstance = new window.mappls.Map("map", {
        center: [28.09, 78.3],
        zoom: 5,
      });

      setMap(mapInstance);

      mapInstance.addListener("load", function () {
        const options = {
          divId: "nearby_search",
          search_icon: false,
          map: mapInstance,
          keywords: {
            FINATM: "\ud83c\udfe7 ATMs",
            FODCOF: "\ud83c\udf7d\ufe0f Restaurants",
            HOS: "\ud83c\udfe5 Hospitals",
            MED: "\ud83d\udc8a Pharmacies",
            PETROL: "\u26fd Fuel Stations",
          },
          refLocation: "28.632735,77.219696",
          fitbounds: true,
          click_callback: function (d) {
            if (d) {
              const gainedXP = 10;
              const totalXP = xp + gainedXP;
              setXp(totalXP);
              updateBadges(totalXP);
              console.log("Nearby Place Selected:", d);
              alert(
                `Name: ${d.placeName}\nAddress: ${d.placeAddress}\neLoc: ${d.eLoc}`
              );
            }
          },
        };

        window.mappls.nearby(options, function (data) {
          if (data?.SuggestedLocations?.length) {
            const gainedXP = data.SuggestedLocations.length * 5;
            const totalXP = xp + gainedXP;
            setXp(totalXP);
            updateBadges(totalXP);
          }
        });
      });
    };

    const updateBadges = (xpTotal) => {
      const earned = [];
      if (xpTotal >= 30 && !badges.includes("\ud83d\udccd Spotter")) {
        earned.push("\ud83d\udccd Spotter");
      }
      if (xpTotal >= 70 && !badges.includes("\ud83c\udf10 Explorer")) {
        earned.push("\ud83c\udf10 Explorer");
      }
      if (xpTotal >= 100 && !badges.includes("\ud83d\udd2e Master")) {
        earned.push("\ud83d\udd2e Master");
      }
      if (earned.length > 0) {
        setBadges((prev) => [...new Set([...prev, ...earned])]);
      }
    };

    initMap();
  }, []);

  const xpLevel = Math.min(100, xp);
  const xpColor = xpLevel < 30 ? "bg-sky-400" : xpLevel < 70 ? "bg-orange-400" : "bg-green-500";
  const borderColor = xpLevel < 30 ? "border-sky-400" : xpLevel < 70 ? "border-orange-400" : "border-green-500";
  const shadowColor = xpLevel < 30 ? "shadow-sky-400/50" : xpLevel < 70 ? "shadow-orange-400/50" : "shadow-green-500/50";

  return (
    <div className="bg-gray-600 flex flex-wrap gap-5 p-5">
      <div
  id="nearby_search"
  className="w-[300px] max-h-[80vh] rounded-xl shadow-xl p-4 backdrop-blur-md bg-gradient-to-br from-gray-400 gray-300-500 to-black-300 text-black border-2 border-white/30"
></div>


      <div className="bg-gray-400 flex-1 rounded-xl overflow-hidden shadow-xl border-2 border-cyan-400 min-w-[300px] h-[80vh] relative">
        <div id="map" className="w-full h-full"></div>
      </div>

      <div className={`absolute top-5 right-5 bg-black/60 backdrop-blur-lg p-5 rounded-xl text-white font-roboto w-72 z-50 border-2 ${borderColor} shadow-lg ${shadowColor}`}>
        <h2 className="text-sm text-cyan-400 mb-4">🔍 NEARBY QUEST</h2>

        <div className="bg-black rounded-md h-3 mb-3 shadow-inner">
          <div className={`h-full rounded-md transition-all duration-300 ${xpColor}`} style={{ width: `${xpLevel}%` }}></div>
        </div>

        <p className="text-xs mb-4">
          XP: <strong>{xp}</strong> / 100
        </p>

        {badges.length > 0 && (
          <>
            <p className="text-xs text-yellow-300 mb-1">🏆 Badges:</p>
            <ul className="list-none p-0 m-0 flex flex-wrap gap-2">
              {badges.map((badge, i) => (
                <li key={i} className="text-xl bg-neutral-900 rounded-xl px-3 py-2 shadow-md border-2 border-cyan-400 text-white">
                  {badge}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default NearbySearchMap;