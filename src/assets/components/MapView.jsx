import React, { useEffect } from "react";

const MapWithEvents = () => {
  const apiKey = import.meta.env.VITE_API_KEY; // Or hardcode for test

  useEffect(() => {
    const initMap = () => {
      const map = new window.mappls.Map("map", {
        center: [28.09, 78.3],
        zoom: 5,
      });

      map.addListener("load", () => {
        const direction_option = {
          map: map,
          divWidth: "350px",
         start: { label: "India Gate", geoposition: "28.6129,77.2295" },
end: { label: "Nehru Place", geoposition: "28.5503,77.2502" },

          Resource: "route_eta",
          annotations: "nodes,congestion",
          Profile: ["driving", "biking", "trucking", "walking"],
          routeSummary: {
            summarycallback: (data) => {
              console.log("Route summary:", data);
            },
          },
        };

        window.mappls.direction(direction_option, function (data) {
          const direction_plugin = data;
          console.log("Direction data:", direction_plugin);
        });
      });
    };

    // Load SDK Scripts
    if (!window.mappls) {
      const script1 = document.createElement("script");
      script1.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0&callback=initMap`;
      script1.async = true;
      document.body.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk_plugins?v=3.0`;
      script2.async = true;
      document.body.appendChild(script2);

      window.initMap = initMap; 
    } else {
      initMap();
    }
  }, []);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}></div>
    </div>
  );
};

export default MapWithEvents;
