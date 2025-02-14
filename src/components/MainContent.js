import React, {useState,useEffect, useRef} from "react";
import { Box, TextField} from "@mui/material";
import Typewriter from './TypeWriter';
import FileUpload from "./FileUpload";
import DocumentsUploaded from "./QandATab.js/DocumentsUploaded";
import ChatInterface from "./QandATab.js/ChatInterface";
import eyeIcon from '../images/icons8-eye-24.png';
import Docs from '../images/icons8-document-24.png';
import QandA from '../images/icons8-question-30.png';
import loadingIcon from '../images/icons8-load.gif';
import axios from "axios";
import './MainContent.css'
import { useSharedContext } from "../sharedProvider";
import ShowHistory from "./ShowHistory";
import { useAppContext } from '../AppContext';


const MainContent = () => {
  // Access the environment variable
  const backendUrl = process.env.REACT_APP_BACKEND_COMMON_URL;
  let inputPayload="";
  let answerFetching=false;
  let firstQuestion=0;
  
  const [inputValue, setInputValue] = useState(''); // State to hold input value
  
  const [conversationStarted, setConversationStarted] = useState(false); 
  const [FileList, setFileList] = useState([]);
  const [FilesUploaded, setFilesUploaded] = useState(false);
  const [uploadDocStatus,setUploadDocStatus]=useState(false);
  const [typingStatus, setTypingStatus] = useState(false);
  
  const { openNewChat, setOpenNewChat } = useSharedContext();
  const handleTypingStatusChange = (status) => {
    setTypingStatus(status);
  };
  // const { idCtx } = useAppContext();
  // console.log('received in main ',idCtx);
  
  // ASSIGNING GLOBAL VARIABLES
  const {setChatIdCtx} = useAppContext()
  const {userId} = useAppContext()
  const {chatIdCtx} = useAppContext()
  const {redisId} = useAppContext()
  const {setRedisId} = useAppContext()
  const {showChatTrigger} = useAppContext()
  const {showChatHistory, setShowChatHistory} = useAppContext()
  const {isFetchingAnswer, setIsFetchingAnswer,isFirstTime,setIsFirstTime,chatHistory,setchatHistory,messages, setMessages,uploadedFiles} = useAppContext()
  const [iframeSrc, setIframeSrc] = useState('');
  const [isDocumentsExpanded, setIsDocumentsExpanded] = useState( false);

  const handleEnterBtn = async () => {
    answerFetching=true
    setIsFetchingAnswer(true)
    
    inputPayload=inputValue
    if (inputValue) {
      const userMessage = { sender: "question", text: inputValue };
      setMessages((prev) => [...prev, userMessage]); 
      setInputValue("")
      if (!conversationStarted) {
        setConversationStarted(true);
        setOpenNewChat(false);

      }
      try {
        const response = await fetch(`${backendUrl}/process_user_question/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-control-allow-origin": "*",
          },
          body: JSON.stringify({
            query: inputPayload,
            userid: userId,
            redis_chatid: redisId,
            chatid: chatIdCtx,
          }),
        });
  
        if (!response.ok) throw new Error("Network response was not ok");
        firstQuestion = firstQuestion + 1;
        setRedisId(response.headers.get("X-RedisChatID"));
        setIsFetchingAnswer(false);
  
        localStorage.setItem("chatid", response.headers.get("X-ChatID"));
        localStorage.setItem("redisid", response.headers.get("X-RedisChatID"));
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let apiResponse = "";
        let isBotMessageAdded = false;
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          console.log("Chunk received:", chunk);
  
          apiResponse += chunk;
          setMessages((prev) => {
            const updatedMessages = [...prev];
            const lastIndex = updatedMessages.length - 1;
        
            if (!isBotMessageAdded) {
              updatedMessages.push({ sender: "llm_response", text: chunk });
              isBotMessageAdded = true; 
            } else {
              updatedMessages[lastIndex].text = apiResponse;
            }
        
            return [...updatedMessages];
          });
          if (showChatHistory.length !== 0) {
            const appendChat = { question: inputPayload, llm_response: apiResponse };
            const newChat = [...showChatHistory, appendChat];
            setShowChatHistory(newChat);
          }
        }

        if(firstQuestion===1){
          getChatHistory()
         }
      } catch (error) {
        const errorMessage = {
          sender: "llm_response",
          text: "Sorry, something went wrong. Please try again.",
        };
        setIsFetchingAnswer(false)
        setMessages((prev) => [...prev, errorMessage]);
      }
    } else {
      alert("Please enter a message");
    }
    answerFetching=false
  };
  const getChatHistory = async () => {
    try {
      const response = await axios.post(`${backendUrl}/user_chats/`,{userid:userId}); 
      setchatHistory(response.data.data)
    } catch (error) {
      console.log(error) // Handle error
    }
  };
 


  
  const handleFileList = (data) => {
    setFileList(data);
    if (data && data.length > 0) {
      // If data is valid and has files, set to true
      setFilesUploaded(true);
  } else {
      // If data is empty or invalid, set to false
      setFilesUploaded(false);
  }
    setOpenNewChat(false);
    
  };
  const uploadCompleteStatus=(data)=>{
    setUploadDocStatus(data)
  }

return (
    <Box style={{...styles.container, marginRight: isDocumentsExpanded ? '200px' : '30px', transition: 'margin-right 0.3s ease'}}>
      <Box style={{...styles.QandAContainer, paddingRight :"0px !important" , justifyContent : !showChatTrigger && ((!conversationStarted && !FilesUploaded) || openNewChat) ? "center" : "flex-end" }}>
        {showChatTrigger && <ShowHistory fileUploadedStatus={uploadDocStatus}/>}
        {(showChatTrigger && chatIdCtx) && <Box
        sx={{  
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",      
          position: "relative",  
          top: 30,
          right: 0,                   
          width: "auto",              
        }}
        ><DocumentsUploaded 
          setIsDocumentsExpanded={setIsDocumentsExpanded}
        /></Box>}

        {!showChatTrigger && (messages.length>0 ||FilesUploaded ) && !openNewChat && (<ChatInterface messages={messages}  onTypingStatusChange={handleTypingStatusChange} fileUploadedStatus={uploadDocStatus}></ChatInterface>)}
        {!showChatTrigger && ((!conversationStarted && !FilesUploaded) || (openNewChat)) &&(<h1><Typewriter className="font-mono" text="What Can I help you with ?" delay={80} /></h1>)}
        {!showChatTrigger && ((!conversationStarted && !FilesUploaded) || (openNewChat)) && (<Box style={styles.containerLabel}>
       <div style={{ ...styles.containerLabels, display: 'flex', alignItems: 'center', gap: 8 , transition: 'transform 0.4s ease-in-out', cursor : "pointer" }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'} 
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
  <img style={{ height: 15, width: 15    }}  src={eyeIcon } alt="" />
  Analyze files
</div>
<div style={{ ...styles.containerLabels, display: 'flex', alignItems: 'center', gap: 8 ,cursor : "pointer" ,transition: 'transform 0.4s ease-in-out' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'} 
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
  <img style={{ height: 15, width: 15 ,  }} src={QandA} alt="" />
  Que & Ans
</div>

      </Box>)}
      {  isFetchingAnswer &&(<div><img style={{height:25,width:25,display: "flex",
        flexDirection: "row",
        justifyContent: "start", 
        alignItems: "center",
       }} src={loadingIcon} alt=""/>
        </div>)}


        <Box style={{
    backgroundColor: 'white', 
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
    border: '1px solid rgba(232, 229, 229, 0.88)',
    padding: '12px', 
    borderRadius: '20px'
  }}>
          {(uploadedFiles.length==0)&&(<TextField
            placeholder="Message altysys.ai"
            variant="standard"
            fullWidth
            InputProps={{
              disableUnderline: true, // Removes the underline
            }}
            sx={{ ml: 1 }}
            value={inputValue} // Bind value to state
            onChange={(e) => setInputValue(e.target.value)} // Update state on input change
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isFetchingAnswer) { // Check if Enter key is pressed
                  handleEnterBtn(); // Call handleEnterBtn function
              }
          }}/>)}
          
          <FileUpload inputValue={inputValue} sendUploadedFiles={handleFileList} sendUploadStatus={uploadCompleteStatus} typingStatus={typingStatus} handleEnterKey={handleEnterBtn}/>

          {/* sendInputChat={handleSendInputChat} */}
        </Box>


        
      </Box>
    <Box 
    sx={{
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",      
    position: "fixed",         
    right: 0,                  
    width: "auto",             
  }}>
    {!showChatTrigger && <DocumentsUploaded 
      getUploadedFile={FilesUploaded}
      setIsDocumentsExpanded={setIsDocumentsExpanded}
    />}
    </Box>
    </Box>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
    overflow: "hidden",
    height: "80vh",
   
  },
  QandAContainer:{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
   
  },
  inputTextField:{
    //display: "flex",
    backgroundColor: "#f0f0f0",
    padding: "8px 16px",
    borderRadius: 15,
    width: "50vw",
    flexDirection: 'column',
    alignItems: 'self-start',
  },
  containerLabel:{
    display: "flex",
    flexDirection: "row",
    justifyContent:"center",
    height:50,
    paddingBottom:60
  },
  containerLabels:{
    display: "flex",
    flexDirection: "center",
    justifyContent:"center",
    height:30,
    width:100,
    border:"1px solid rgba(232, 229, 229, 0.88)",
    borderRadius:20,
    padding:3,
    fontSize:12,
    margin:10,
    boxShadow: "0px 0.7px 0.7px rgba(240, 240, 240, 0.91)",
    alignItems: 'center',
    color:"rgb(41, 40, 40)"
  },
  spinner: {
    animation: "spin 1s linear infinite" /* Adds spinning effect */
  }


}
export default MainContent;

