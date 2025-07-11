import React, { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";

const MapWithEvents = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_KEY;
  const [events, setEvents] = useState([]);
  const [aiContent, setAiContent] = useState("");

  useEffect(() => {
    if (events.length === 0) return;
const fetchSummary = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `You are a trip adviser. Summarize the following event categories:\n\n${events.join(", ")}` }],
        },
      ],
    });

    const summaryText = result.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
    console.log("Summary:", summaryText);
    setAiContent(summaryText);

  } catch (err) {
    console.error("Gemini error:", err.message || err);
  }
};



    fetchSummary();
  }, [events]);

  useEffect(() => {
    const initMap = () => {
      const map = new window.mappls.Map("map", {
        center: [28.61, 77.23],
        zoom: 10
      });

      map.addListener("load", () => {
        const direction_option = {
          map,
          divWidth: "350px",
          start: { label: "India Gate", geoposition: "28.6129,77.2295" },
          end: { label: "Nehru Place", geoposition: "28.5503,77.2502" },
          Resource: "route_eta",
          annotations: "nodes,congestion",
          Profile: ["driving", "biking", "trucking", "walking"],
          routeSummary: {
            summarycallback: (data) => {
              console.log(data)
              let reports = data.routes?.[0]?.reports || [];
              let childCategories = reports.map(r => r.childCategory);
              setEvents(childCategories);
            }
          }
        };

        window.mappls.direction(direction_option, function (data) {
          console.log("Direction data:", data);
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

      window.initMap = initMap;
    } else {
      initMap();
    }
  }, []);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      {aiContent && (
        <div style={{
          position: "absolute", top: 10, left: 10,
          backgroundColor: "#fff", padding: "10px", borderRadius: "8px"
        }}>
          <strong>Summary:</strong> {aiContent}
        </div>
      )}
    </div>
  );
};

export default MapWithEvents;
