// FileUpload.js
import React, { useRef, useState, } from 'react';
import axios from 'axios';
import { MdAttachFile, MdClose, MdArrowUpward } from 'react-icons/md';
import './FileUpload.css';
import DocIcon from '../images/icons8-word-48.png';
import PdfIcon from '../images/icons8-pdf-48.png';
import ImageIcon from '../images/icons8-image-48.png';
import ExcelIcon from '../images/icons8-excel-48.png';
import PptIcon from '../images/icons8-powerpoint-48.png'; 
import DefaultIcon from '../images/icons8-file-50.png';
import Drive from '../images/icons8-drive-48.png';
import OneDrive from '../images/icons8-onedrive-48.png';
import FileExplorer from '../images/icons8-file-explorer-new-48.png';
import { useAppContext } from '../AppContext';
import csvimg from '../images/OIP.png';

const FileUpload = ({inputValue, sendUploadedFiles,sendUploadStatus,typingStatus,handleEnterKey}) => {
    // Access the environment variable
    const backendUrl = process.env.REACT_APP_BACKEND_COMMON_URL;  
    const {userId} = useAppContext()
    const {setChatIdCtx, setFetchFileTrigger,setMessages,setFileType,setShowChatHistory,showChatHistory,FileType,setFileUploadFailed} = useAppContext()
    const {chatIdCtx} = useAppContext()
    const {uploadedFiles, setUploadedFiles} = useAppContext()// State for files
    const [uploadProgress, setUploadProgress] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const {setCurrentFile,showChatTrigger}=useAppContext()
    
    const toggleMenu = () => setShowMenu(!showMenu);
    const inputFile = useRef(null);
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files); // Append new files
    event.target.value = '';
  };
  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove file
  };

  const handleClick = () => {
    setShowMenu(false)
    inputFile.current.click(); // Trigger the hidden file input
  };

  const handleUpload = async () => {
    setFileUploadFailed(false)
    
    sendUploadStatus(true)
    sendUploadedFiles(uploadedFiles)
    console.log(uploadedFiles)

    for (let file of uploadedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      var parameter=file
      try {
        setCurrentFile(file.name)
        const response = await axios.post(`${backendUrl}/upload/`, {userid:userId,chatid:chatIdCtx,file:parameter,}, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'access-control-allow-origin' : '*'
          },
        });

        
        if(response.status == 200){
          setFileUploadFailed(false)
          sendUploadStatus(false)
          // SETTING THIS BECAUSE ITS NOT UPDATING CHATID IMMIDIATELY, AND IF WE PASS IT IN USEEFFECT, THEN IT WILL GO IN INFINITE LOOP
          
          setChatIdCtx(response.data.data.chatid)
          // chatId1 = response.data.data.chatid
          // sendInputChat(chatId1)
          localStorage.setItem('chatid',response.data.data.chatid)
          setFetchFileTrigger(true)
          
        }
        else if(response.status == 409)
        {
          alert(response.message)
        }
        
      } catch (error) {
        setFileUploadFailed(true)
        console.error(`Error uploading ${file.name}:`, error);
      }
    }
    
    setUploadedFiles([]); // Clear the file list after upload
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && ((uploadedFiles.length > 0) || inputValue)) {
        handleUpload();
        const userMessage = { sender: "file",text:'',file:uploadedFiles };
        setFileType(uploadedFiles)
        setMessages((prev) => [...prev, userMessage]);
        if (showChatHistory.length !== 0) {
          const appendChat = {'question': '', 'llm_response': '','file':uploadedFiles}
          const newChat = [...showChatHistory,appendChat]
          setShowChatHistory(newChat)
        }
        
    }
    
};
// Log chatId whenever it changes
// useEffect(() => {
//   // console.log("ChatId with setting:", chatId);
// }, []);

    return (
      <div className="main-file-upload-container"  onKeyDown={handleKeyDown}  style={{ backgroundColor : "white !important"  }} // Attach keydown event listener
      tabIndex="0">
        
        <div className='file-upload-container'
          > 
        
            {uploadedFiles.map((file, index) => {
      // Determine the file type and corresponding icon
      const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase(); // Extract file extension
        switch (extension) {
          case 'pdf':
            return PdfIcon; // Replace with actual PDF icon source
          case 'doc':
          case 'docx':
            return DocIcon; // Replace with actual Word icon source
          case 'png':
          case 'jpg':
          case 'jpeg':
            return ImageIcon; // Replace with actual Image icon source
          case 'xls':
          case 'xlsx':

            return ExcelIcon; // Replace with actual Image icon source
          case 'csv':
            return csvimg; // Replace with actual Excel icon source
          case 'ppt':
          case 'pptx':
            return PptIcon;
          default:
            return DefaultIcon; // Replace with a default icon source
        }
      };
      
      return (
        <div className="file-chip" key={index}  style={{ background : "white" }} >
          <img
            style={{ paddingTop: '4px',height:25,width:25 }}
            src={getFileIcon(file.name)}
            className="w-9"
            alt="File Icon"
          />
          <span className="file-name">{file.name}</span>
          {uploadProgress[file.name] && (
            <span className="upload-progress">{uploadProgress[file.name]}%</span>
          )}
          <button className="remove-button" onClick={() => handleFileRemove(index)}>
            <MdClose />
          </button>
        </div>
      );
    })}
           



            <div style={{   display : "flex"  , gap : "10px" ,  alignItems:"center" , justifyContent : "right" ,  minWidth : "60vw", background : "white" }} >
              {showMenu && (
        <div className="dropdownMenu" >
          <div className="dropdownItem">
            <span className="driveIcon"> <img style={{height:20,width:20}} src={Drive} alt=""/></span>
            Connect to Google Drive
          </div>
          <div className="dropdownItem">
            <span className="driveIcon"><img style={{height:20,width:20}} src={OneDrive} alt=""/></span>
            Connect to Microsoft OneDrive
          </div>
          <div className="dropdownItem" onClick={handleClick} >
            <span className="uploadIcon"><img style={{height:20,width:20}} src={FileExplorer} alt=""/></span>
            Upload from computer
          </div>
        </div>
      )}
            <input 
                type="file" 
                ref={inputFile} 
                style={{ display: 'none' }} // Hide the input
                onChange={handleFileSelect} 
                
            />
            <MdAttachFile
                
                onClick={toggleMenu}
                style={{ cursor: 'pointer', color: 'gray', fontSize:'20px' }} 
            />
            
            {/* Upload Button with Arrow */}
            <button 
            className={`upload-button ${(((uploadedFiles.length === 0)&&(!inputValue))) ? 'disabled' : ''}`}
            onClick={() => {
              if(uploadedFiles.length>0){
              const mockEvent = { key: 'Enter' }; // Simulate an Enter key event
              handleKeyDown(mockEvent);
              }
              if(inputValue){
                handleEnterKey()
              }
            }}
            disabled={((uploadedFiles.length === 0) && (!inputValue))}
            >
                <MdArrowUpward style={{ fontSize: '20px', fontWeight: 'bold' }} /> 
            </button>
           
            </div>
        </div>
        </div>
        
    );
  }
   

export default FileUpload;