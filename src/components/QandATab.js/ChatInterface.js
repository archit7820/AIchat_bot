import { Box,Typography, Paper } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AIcon from '../../images/letter-a.png';
import parse from "html-react-parser";
import FileLoading from "./FileLoading";
import { CgSpinner } from "react-icons/cg";
import { useAppContext } from '../../AppContext';

function ChatInterface({FileListToShow,fileUploadedStatus}) {
    const messagesEndRef = useRef(null);
    const {fileType,messages,fileUploadFailed,currentFile}= useAppContext()

    // Scroll to the latest message whenever messages change
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

    const isValidUrl = (string) => {
      try {
        new URL(string);
        return true;
      } catch (error) {
        return false;
      }
    };
  
  
  return (
    <Box
    sx={{
        width: "60vw", 
        padding: "10px",
        marginBottom:2,
        fontSize:15,
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        maxHeight: "75vh",
        overflowx: "hidden",
        overflowY: "auto",
        boxSizing: "border-box", // Ensures padding is included in width calculations
        '&::-webkit-scrollbar': {
          display: 'none', // Hides the scrollbar in WebKit browsers (Chrome, Safari)
        },
        scrollbarWidth: 'none',
        
      }}

    >

     <Box>
      
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: (message.sender === "question" ||  message.sender==="file") ? "flex-end" : "flex-start",
            }}
          > 
          {!((message.sender === "question" || message.sender==="file")) && (<img style={{height:25,width:25,borderRadius:10,border:"1px"}} src={AIcon} className="w-9" alt="" />)}
            <Paper
              elevation={2}
              sx={{
                padding: "12px 16px",
                marginTop:"10px",
                backgroundColor: message.sender === ("question") ? "#f0f0f0" : "#ffffff",
                maxWidth: "60vw",
                borderRadius:
                  message.sender === ("question")
                    ? "12px 12px 0px 12px"
                    : "12px 12px 12px 0px",
                overflow: "hidden", // Prevent overflow of content
                wordWrap: "break-word",
                boxShadow:0
              }}
            >
              
              {message.sender === "question" && (<Typography variant="body">{message.text}</Typography>)}
              {!(message.sender === "question") && !(isValidUrl(message.text))&& (<div>{parse(message.text)}</div>)}
              {!(message.sender === "question") &&( isValidUrl(message.text)) &&(<div><iframe style={{width:500}} src={message.text} width="100%" height="600px"></iframe></div>)}
              {(message.sender === "file") && (<Box style={{mwidth:"60vw"}}>
              {(<FileLoading FileList={message.file} />)}
              {(currentFile==message.file[0].name)&&(fileUploadedStatus && !fileUploadFailed) && (<div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}><p>Document process in progress...</p> <CgSpinner className="spinner" />
              </div>)}
            
              {(currentFile==message.file[0].name)&&(!fileUploadedStatus && !fileUploadFailed) && (<p>Document Process Completed!</p>)}
              {(fileUploadFailed) && (<p>Document Processing Failed!</p>)}
              </Box>)}
            </Paper>
          </Box>
        ))}
      </Box>
      <div ref={messagesEndRef} />
    </Box>
  );
}

export default ChatInterface