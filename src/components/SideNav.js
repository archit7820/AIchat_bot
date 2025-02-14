import React, { useEffect, useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  Box,
  Typography,
  ListItem,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LogoAndNav from "./QandATab.js/LogoAndNav";
import axios from "axios";
import { useAppContext } from '../AppContext';



const SideNav = ({selectedTab}) => {
  // Access the environment variable
  const backendUrl = process.env.REACT_APP_BACKEND_COMMON_URL;
  const backendUrl_Summarization = process.env.REACT_APP_BACKEND_COMMON_URL_SUMMARIZATION;

  let userid="structured_demo@altysys.com";
  const [isOpen, setIsOpen] = useState(true);
  const [summaryFirstTimeLoad,setSummaryFirstTimeLoad]=useState(true);

  // STORING THE LIST OF CHATS FOR HISTORY
  // SETTING ALL THE GLOBAL VARIABLES
  // Setting trigger for showing chat history
  const {setShowChatTrigger, setIsFirstTime, isFirstTime} = useAppContext()

  // CHECK WHETHER THE DOCUMENT IS UPLOADED OR NOT
  const {isDocumentUploadedCtx,setIsDocumentUploadedCtx} = useAppContext()
  
  // Chat Hisory conversations
  const {showChatHistory, setShowChatHistory,chatHistory,setchatHistory,setDocumentList,documentList,setCurrentFileSummary,setCurrentFileUrl} = useAppContext()
  const {chatIdCtx,setChatIdCtx,} = useAppContext()
  const {setUploadedFiles} = useAppContext()
  const {userId} = useAppContext()
  const {setRedisId,fileId,setFileId} = useAppContext()
  

  // FOR DISPLAYING LATEST CHAT HISTORY FOR SUMMARIZATION
  const {addLatestDocToHistory} = useAppContext()

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };
 

  const getChatHistory = async () => {
    try {
      const response = await axios.post(`${backendUrl}/user_chats/`,{userid:userId}); // Replace with your API URL
      setchatHistory(response.data.data);
    
    } catch (error) {
      console.log(error) // Handle error
    }
  };
  
  if(summaryFirstTimeLoad){
    const fileid_Local = localStorage.getItem('fileId');
    const fileurl_Local = localStorage.getItem('fileUrl');
    const filesummary_Local = localStorage.getItem('filesummary');
    if(fileid_Local){
      setFileId(fileid_Local)
      setCurrentFileUrl(fileurl_Local)
      setCurrentFileSummary(filesummary_Local)
      setIsDocumentUploadedCtx(true)
    }
    setSummaryFirstTimeLoad(false);
  }
  // Fetch documents when component mounts
  useEffect(() => {
    getChatHistory();

  },[]);

 const single_chat_history = async(chat_id,redis_chatid) =>{
    const response = await axios.post(`${backendUrl}/user_chat_data/`,{userid:userid, redis_chatid:redis_chatid});
    // setShowChatTrigger(true);
    // LLM RESPONSE AND USER QUESTION
    setShowChatHistory(response.data.data)
    
    setShowChatTrigger(true); // Notify parent about chat trigger change to display the history chats

 }
 
 if(isFirstTime)
  {
    
    const chatId = localStorage.getItem('chatid');
    const redisId = localStorage.getItem('redisid');
    
    if(chatId && redisId) {
      
      setChatIdCtx(chatId)
      setRedisId(redisId)
      single_chat_history(chatId,redisId)
      

    }
    setIsFirstTime(false);
  }

  const sendChatHistoryDetails = (doc) => {
    // setIdCtx('I am set from sidenav '+new Date().getTime());
    
    setChatIdCtx(doc.chatid)
    setRedisId(doc.redis_chatid)
    
    single_chat_history(doc.chatid,doc.redis_chatid)
    localStorage.setItem('chatid',doc.chatid)
    localStorage.setItem('redisid',doc.redis_chatid)
    setUploadedFiles([])
  }
  // CHANGE DOCUMENT UPLOADED OR NOT TRIGGER
  const documentUploadedTrigger = () =>{
    setIsDocumentUploadedCtx(false);
  }
  
  return (
    <Box sx={{ 
      display: "flex",
      flexDirection: "column",
      width: isOpen ? "220px" : "0px",
      transition: "width 0.3s",
      '& + *': {  // Target the next sibling element (main content)
       // marginLeft: isOpen ? '240px' : '20px',
        width: `calc(100% - ${isOpen ? '220px' : '0px'})`,
        transition: "margin-left 0.3s, width 0.3s",
      }
    }}>
      {!isOpen && (<LogoAndNav isOpen={isOpen} selectedTab ={selectedTab}/>)}
      <Drawer
        variant="persistent"
        open={isOpen}
        sx={{
          width: isOpen ? 240 : 10, // Adjust drawer width dynamically
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isOpen ? 240 : 10, // Ensure the paper width matches the drawer
            boxSizing: "border-box",
            transition: "width 0.3s", // Smooth transition effect
    },
        }}
      ><Box
      sx={{
        display: "flex",
       // paddingTop:2,
        backgroundColor: "#f5f5f5",
        justifyContent:"center",
      }}
    >
      {isOpen && (<LogoAndNav isOpen={isOpen} selectedTab ={selectedTab} />)}
    </Box>
        {/* FOR DOCUMENT Q&A TAB */}
       { selectedTab == 0 &&
        <Box
          sx={{
            width: "100%",  
            height:"100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#f5f5f5",
            position: "relative",
          }}
        >
          {isOpen && (
            <List sx={{ padding: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", marginBottom: 1, fontSize: "1rem" }}
              >
                History
              </Typography>
              {chatHistory.length > 0 ? (
                chatHistory.map((doc, index) => (
                  <ListItem key={index} onClick={() => sendChatHistoryDetails(doc)} 
                  sx={{
                    cursor: 'pointer',
                    margin:"2px",
                    backgroundColor: chatIdCtx === doc.chatid ? '#d8d8d8' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#d8d8d8',
                    },
                    borderRadius:2,
                    
                    
                  }}
                  >
                    <Typography variant="body1" sx={{ fontSize: '12px',padding:"1px",cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#d8d8d8',
                      }, }}>
                      {doc.chatname} {/* Display the content of each document */}
                    </Typography>
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" sx={{ fontSize: "12px", color: "gray" }}>
                  No data available
                </Typography>
              )}
              
            </List>
          )}
          {/*showChatTrigger && <ShowHistory chatsHistory={showChatHistory}/>*/}
        </Box>
      }

      </Drawer>
      {/* Toggle Button */}
      <div style={{width:5}}>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          border:10,
          borderWidth:1.5,
          borderColor:"#ffffff",
          position: "fixed",
          top: "50%",
          left: isOpen ? 230 : 0, // Adjust position based on drawer state
          transform: "translateY(-50%)",
          backgroundColor: "#fff",
          color: "black",
         // zIndex: 1301, // Ensure the button stays above other components
          "&:hover": {
            backgroundColor: "#ff8c00",
            color: "#fff",
          },
          transition: "left 0.3s ease", // Smooth transition for button movement
        }}
      >
        <ArrowBackIosIcon
          sx={{
            fontSize: "17px",
            transform: isOpen ? "rotate(0)" : "rotate(180deg)", // Rotate arrow based on state
            transition: "transform 0.3s", // Smooth arrow rotation
          }}
        />
      </IconButton>
      </div>
    </Box>
  );
};

export default SideNav;
 