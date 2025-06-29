import React, { useEffect, useState } from "react";



const NearbySearchMap = () => {
  
  const apiKey = import.meta.env.VITE_API_KEY;
  const [map, setMap] = useState(null);
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);
  console.log(apiKey)

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
        `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0`
      );
      await loadScript(
        `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk_plugins?v=3.0`
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

  

  
    return (
   <div className="min-h-screen w-full px-6 py-8 bg-gradient-to-tr from-[#667eea] via-[#764ba2] to-[#6b0f1a]
 flex flex-wrap gap-6 justify-center items-start overflow-x-hidden transition-all duration-300">

     <div
  id="nearby_search"
  className="w-[300px] max-h-[80vh] rounded-xl shadow-xl p-4 backdrop-blur-md bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-black border border-white/20 overflow-y-auto"
></div>


      {/* Map Container */}
      <div className="bg-gray-800 flex-1 rounded-xl overflow-hidden shadow-xl border border-cyan-400 min-w-[300px] h-[80vh] relative">
        <div id="map" className="w-full h-full"></div>
      </div>

    </div>
  );
};

  

export default NearbySearchMap;