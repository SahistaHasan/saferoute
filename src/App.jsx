// src/App.js
import React from 'react';
import NearbySearchMap from './assets/components/Nearby';
import EmergencyAlert from './assets/components/Emergency';
import SafeRouteHomePage from './assets/components/Home';
import MapViewer from './assets/components/MapView';
import MapWithDirectionPOI from './assets/components/Path';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Leaderboard from './assets/components/Leaderboard';
import SignIn from './assets/components/SignIn';
import SignUp from './assets/components/SignUp';
import ReportIncident from './assets/components/ReportIncident';

import DisplayIncidents from './assets/components/Displayreport';


function App() {
  return (
    <div className="App">
    <Router>
    <Routes>
      
      <Route path="/" element={<SafeRouteHomePage/>} />
      <Route path="/safeguide" element={<MapViewer />} />
      <Route path ="/emergency" element ={<EmergencyAlert/>}/>
      <Route path ="/nearbyplaces" element ={<NearbySearchMap/>}/>
      <Route path ="/pathfinder" element ={<MapWithDirectionPOI/>}/>
      <Route path ="/leaderboard" element ={<Leaderboard/>}/>
      <Route path ="/signin" element ={<SignIn/>}/>
      <Route path ="/signup" element ={<SignUp/>}/>
      <Route path ="/report" element ={<ReportIncident/>}/>
      <Route path ="/display" element ={<DisplayIncidents/>}/>
      
    </Routes>
  </Router>
  
     
      
    </div>
  );
}

export default App;

