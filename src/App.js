import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SideNav from "./components/SideNav";
import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";

import './App.css';


import { AppProvider } from './AppContext';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);

 

  

  // FETCHING FILES FOR CHAT HISTORY -> CHATID AND USER ID
  // const [historyChatId, setHistoryChatId] = useState('')
  // const [historyUserId, setHistoryUserId] = useState('')

  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
    
  };

  return (
    <AppProvider>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <SideNav selectedTab={selectedTab} />
        <Box sx={{   width  : "100%" ,height: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar onTabChange={handleTabChange} />
          <Box>
            {selectedTab === 0 && <MainContent />}
          </Box>
        </Box>
      </Box>
    </AppProvider>
  );
};

export default App;
