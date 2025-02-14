import { Box, Typography, Paper } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import AIcon from '../images/letter-a.png';
import { useAppContext } from '../AppContext';
import parse from "html-react-parser";
import FileLoading from "./QandATab.js/FileLoading";
import { CgSpinner } from "react-icons/cg";

function ShowHistory({fileUploadedStatus}) {
    const messagesEndRef = useRef(null);
    const {showChatHistory} = useAppContext()
    const {currentFile} = useAppContext()
    console.log(currentFile)
    // Scroll to the latest message whenever messages change
    console.log(showChatHistory)
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
       
    });
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
                display: 'flex', // Use flexbox for centering
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                height: '100vh', // Full viewport height
                padding: 2,
                backgroundColor: '#ffffff', // Optional: Background color for contrast
            }}
        >
            <Box
                sx={{
                    width: "50vw", // Aligns the width to the parent's width
                    padding: "16px",
                    marginBottom: 2,
                    fontSize: 15,
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    maxHeight: "60vh",
                    overflowX: "hidden",
                    overflowY: "auto",
                    boxSizing: "border-box", // Ensures padding is included in width calculations
                    '&::-webkit-scrollbar': {
                        display: 'none', // Hides the scrollbar in WebKit browsers (Chrome, Safari)
                    },
                    scrollbarWidth: 'none',
                }}
            >
                <Box className="chat-messages">
                    {showChatHistory.map((chat, index) => (
                        <Box key={index}>
                            {/* Render Question */}
                            {chat.question && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end", // Align question to the right
                                        marginBottom: "10px", // Add some space below the question
                                    }}
                                >
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            padding: "12px 16px",
                                            margin: "10px",
                                            backgroundColor: "#f0f0f0", // Background color for questions
                                            maxWidth: "85%",
                                            borderRadius: "12px 12px 0px 12px",
                                            overflow: "hidden", // Prevent overflow of content
                                            wordWrap: "break-word",
                                            boxShadow: 0,
                                        }}
                                    >
                                        <Typography variant="body">{chat.question}</Typography>
                                    </Paper>
                                </Box>
                            )}

                            {/* Render LLM Response */}
                            {chat.llm_response && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-start", // Align response to the left
                                        marginBottom: "10px", // Add some space below the response
                                    }}
                                >
                                    {/* <img style={{ paddingTop: '30px', height: 25, width: 25, borderRadius: 10, border: "1px" }} src={AIcon} alt="" /> */}
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            padding: "12px 16px",
                                            margin: "10px",
                                            // backgroundColor: "#f0f0f0", // Background color for responses
                                            maxWidth: "80%",
                                            borderRadius: "12px 12px 12px 0px",
                                            overflow: "hidden", // Prevent overflow of content
                                            wordWrap: "break-word",
                                            boxShadow: 0,
                                        }}
                                    >
                                       {!( isValidUrl(chat.llm_response)) && <div  className="font-mono">{parse(chat.llm_response)}</div>}
                                        {( isValidUrl(chat.llm_response)) &&(<div><iframe style={{width:500}} src={chat.llm_response} width="100%" height="600px"></iframe></div>)}
                                        
                                    </Paper>
                                </Box>
                            )}
                            {chat.file && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end", // Align question to the right
                                        marginBottom: "10px", // Add some space below the question
                                    }}
                                >
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            padding: "12px 16px",
                                            margin: "10px",
                                            maxWidth: "75%",
                                            borderRadius: "12px 12px 0px 12px",
                                            overflow: "hidden", // Prevent overflow of content
                                            wordWrap: "break-word",
                                            boxShadow: 0,
                                        }}
                                    >
                                        {(<Box style={{mwidth:"50vw"}}>
                                        {(<FileLoading FileList={chat.file} />)}
                                        {(currentFile==chat.file[0].name)&&(fileUploadedStatus) && (<div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}><p>Document process in progress...</p> <CgSpinner className="spinner" />
                                        </div>)}
                                        {(currentFile==chat.file[0].name)&&(!fileUploadedStatus) && (<p>Document Process Completed!</p>)}
                                        </Box>)}
                                    </Paper>
                                </Box>
                            )}

                            
                        </Box>
                    ))}
                </Box>
                <div ref={messagesEndRef} />
            </Box>
        </Box>
    );
}

export default ShowHistory;
