import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Tabs, Tab, Box, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FilePresentIcon from '@mui/icons-material/FilePresent';
 
const Navbar = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const [summaryFirstTime,setSummaryFirstTime] =useState(true);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
 
  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (onTabChange) {
      onTabChange(newValue);
    }
  };
 console.log(activeTab)
 if(summaryFirstTime)
  {
    const selectTab = localStorage.getItem('selectedTab')
    if(selectTab){
      setActiveTab(parseInt(selectTab));
      onTabChange(parseInt(selectTab))
    }
    setSummaryFirstTime(false) 
  }
 useEffect(() => {
     // Save the selected tab index to localStorage whenever it changes
     localStorage.setItem("selectedTab", activeTab);
   }, [activeTab]);

   const [isHovered, setIsHovered] = useState(false);

   // Style for the container (the "tab")
   const containerStyle = {
     position: 'relative',
     display: 'inline-block',
     color: 'black',
     textTransform: 'none',
    // paddingTop : "10px",
    // paddingBottom : "8px",
    // paddingLeft : "70px",
     fontSize : "16px", 
     fontWeight : "600",
     cursor: 'pointer',
   };
 
   // Style for the underline element
   const underlineStyle = {
     position: 'absolute',
     bottom: 0,
     left: '50%',
     width: '100%',
     height: '2px',
     backgroundColor: 'orange',
     transform: `translateX(-50%) scaleX(${isHovered ? 1 : 0})`,
     transformOrigin: 'center',
     transition: 'transform 0.3s ease',
   };
 
   
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        color: "#000",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ 
        display: "flex", 
        justifyContent: "space-between",
        '@media (min-width: 600px)': {
          paddingLeft: '0px',  // reduced from 24px
          paddingRight: '0px', // reduced from 24px
        }
      }}>
        {/* Left empty space */}
        <Box sx={{ flex: 1 }} />

        {/* Center title */}
        <div
          style={{
            ...containerStyle,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Structured Document Q&A
          <span style={underlineStyle} />
        </div>

        {/* Right icons */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          {activeTab === 1 && (
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <FilePresentIcon />
            </IconButton>
          )}
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
 
export default Navbar;