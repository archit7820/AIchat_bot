// AppContext.js
import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  //const [idCtx, setIdCtx] = useState(null);
  const userId = "structured_demo@altysys.com"
  const [chatIdCtx, setChatIdCtx] = useState(null);
  
  const [redisId, setRedisId] = useState(null);
  const [showChatTrigger, setShowChatTrigger] = useState(false); // State for showing chat history
  const [showChatHistory, setShowChatHistory] = useState([]); // Store chat history
  const [isFirstTime,setIsFirstTime] = useState(true);
  const[isFetchingAnswer, setIsFetchingAnswer] = useState(false) // DISABLE THE ENTER BUTTON TILL ITS FETCHING THE ANSWER

  const [fetchFileTrigger, setFetchFileTrigger] = useState(false)
  const [isDocumentUploadedCtx, setIsDocumentUploadedCtx] = useState(false) // FOR CHAT SUMMARIZE TO SHOW UPLOAD DOCUMENT IN SIDEBAR
  const [chatHistory, setchatHistory]=useState([]); //showing All History on sidenav
  
  // FOR SETTING UPLOADED DOCUMENTS IN CHATSUMMARIZE
  const [uploadedDocuments, setUploadedDocuments] = useState([])

  // SUMMARIZATION
  const [currentFileUrl,setCurrentFileUrl] = useState(null); // FOR SUMMARIZATION, SET CURRENT FILE URL TO DISPLAY PDF FILR
  const [currentFileSummary, setCurrentFileSummary] = useState(null) // FOR SHOWING THE SUMMARY OF CURRENT FILE URL
  // FOR DISPLAYING LATEST CHAT HISTORY
  const [addLatestDocToHistory, setAddLatestDocToHistory] = useState(0)

  const [documentList,setDocumentList]=useState([])
  const [fileType,setFileType]=useState([])
  const [messages, setMessages] = useState([]);
  const [fileId,setFileId]=useState('');
  const [fileUploadFailed,setFileUploadFailed]=useState(false);
  const [currentFile,setCurrentFile]=useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); 

   

  return (
    <AppContext.Provider value={{ userId, chatIdCtx, redisId, setChatIdCtx, setRedisId, showChatTrigger, setShowChatTrigger, showChatHistory, setShowChatHistory, isFirstTime, setIsFirstTime, isFetchingAnswer, setIsFetchingAnswer,fetchFileTrigger, setFetchFileTrigger,isDocumentUploadedCtx, setIsDocumentUploadedCtx,chatHistory, setchatHistory, currentFileUrl, setCurrentFileUrl,currentFileSummary,setCurrentFileSummary,documentList,setDocumentList,fileType,setFileType,messages, setMessages, uploadedDocuments, setUploadedDocuments, addLatestDocToHistory, setAddLatestDocToHistory,fileId,setFileId,fileUploadFailed,setFileUploadFailed,currentFile,setCurrentFile,uploadedFiles, setUploadedFiles}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
