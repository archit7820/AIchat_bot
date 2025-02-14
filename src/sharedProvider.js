import React, { createContext, useState, useContext } from 'react';

const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
  const [openNewChat, setOpenNewChat] = useState(false);
  const [openOldChat, setOpenOldChat]=useState([]);
  const performAction = () => {
    console.log("Action triggered in SharedProvider!");
    // Add the logic that you want to call in another component
  };

  return (
    <SharedContext.Provider value={{ openNewChat, setOpenNewChat,openOldChat, setOpenOldChat,performAction}}>
      {children}
    </SharedContext.Provider>
  );
};

export const useSharedContext = () => useContext(SharedContext);
