import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
// at the top of your file




const MapViewer = () => {
  const [source, setSource] = useState("28.6129,77.2295");
  const [destination, setDestination] = useState("28.5503,77.2502");
  const [events, setEvents] = useState([]);
  const [xp, setXp] = useState(0);
  const [badge, setBadge] = useState("");
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const routeResponse = await fetch(
          `https://apis.mappls.com/advancedmaps/api/${apiKey}/json?origin=${source}&destination=${destination}&sensor=false`
        );
        const routeData = await routeResponse.json();
        console.log("Route Data:", routeData);

        if (routeData.routes && routeData.routes[0]) {
          const waypoints = routeData.routes[0].legs[0].steps.map(
            (step) => step.end_location
          );
          console.log("Waypoints:", waypoints);

          const eventDataPromises = waypoints.map(async (point) => {
            try {
              const eventResponse = await fetch(
                `https://apis.mappls.com/advancedmaps/api/${apiKey}/places/nearby/json?location=${point.lat},${point.lng}&radius=1000&types=event&sensor=false`
              );
              const eventData = await eventResponse.json();
              console.log("Event Data for point:", eventData);
              if (eventData.results) {
                return eventData.results;
              }
              return [];
            } catch (eventError) {
              console.error("Error fetching event data for point:", eventError);
              return [];
            }
          });

          const allEvents = await Promise.all(eventDataPromises);
          setEvents(allEvents.flat());
        } else {
          console.error("Invalid route data");
        }
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    const initMap = () => {
      const map = new window.mappls.Map("map", {
        center: [28.09, 78.3],
        zoom: 5,
      });

      map.addListener("load", () => {
        const directionOption = {
          map,
          divWidth: "350px",
          start: { label: "India Gate", geoposition: "28.6129,77.2295" },
          end: { label: "Nehru Place", geoposition: "28.5503,77.2502" },
          Resource: "route_eta",
          annotations: "nodes,congestion",
          Profile: ["driving", "biking", "trucking", "walking"],
          routeSummary: {
            summarycallback: (data) => {
              console.log(data);
              const earned = 10;
              setXp((prevXp) => {
                const newXp = prevXp + earned;
                if (newXp >= 50 && badge !== "Pathfinder") {
                  setBadge("Pathfinder");
                  confetti();
                }
                return newXp;
              });
            },
          },
        };

        window.mappls.direction(directionOption, (data) => {
          console.log("Route Data:", data);
        });

        events.forEach((event) => {
          new window.mappls.Marker({
            map: map,
            position: event.location.coordinates,
            icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            title: event.description,
          });
        });
      });
    };

    if (!window.mappls) {
      const script1 = document.createElement("script");
      script1.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0&callback=initMap`;
      script1.async = true;
      document.body.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk_plugins?v=3.0`;
      script2.async = true;
      document.body.appendChild(script2);

      script1.onload = () => {
        initMap();
        fetchRouteData();
      };
    } else {
      initMap();
      fetchRouteData();
    }
  }, [source, destination, events, badge]);

  return (
    <div className="font-[Poppins]">
      <div className="p-4 bg-[#1e1e2f] text-white">
       
        <div className="flex flex-wrap gap-2 mt-2">
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source coordinates"
            className="p-2 rounded-md bg-[#2d2d44] text-white w-[300px] max-w-full outline-none"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination coordinates"
            className="p-2 rounded-md bg-[#2d2d44] text-white w-[300px] max-w-full outline-none"
          />
        </div>

        

       
      </div>

      <div className="w-full h-screen">
        <div id="map" className="w-full h-full"></div>
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MapViewer;









