import React, { useState, useEffect } from "react";

import PdfIcon from '../../images/icons8-pdf-48 (1).png';
import docStackIcon from '../../images/icons8-stack-of-documents-64 (2).png';
import axios from 'axios';
import DocIcon from '../../images/icons8-word-48.png';
import ImageIcon from '../../images/icons8-image-48.png';
import ExcelIcon from '../../images/icons8-excel-48.png';
import DefaultIcon from '../../images/icons8-file-50.png';
import PptIcon from '../../images/icons8-powerpoint-48.png';
import { useAppContext } from '../../AppContext';
import csvimg from '../../images/OIP.png';

const DocumentsUploaded = ({ title, getUploadedFiles, setIsDocumentsExpanded }) => {
  // Access the environment variable
  const backendUrl = process.env.REACT_APP_BACKEND_COMMON_URL;

  const {userId} = useAppContext()
  const {chatIdCtx, setFetchFileTrigger, fetchFileTrigger} = useAppContext()
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  
  const {uploadedDocuments, setUploadedDocuments} = useAppContext()
  // Function to fetch documents from an API
  const fetchDocuments = async () => {
    
    try {
      
      const response = await axios.post(`${backendUrl}/fetch_file_list/`,{userid:userId,chatid:chatIdCtx },
      ); 
      setUploadedDocuments(response.data.data); // Update state with fetched documents
      console.log(uploadedDocuments)
    } catch (error) {
      setError(error.message); // Handle error
    } finally {
      setLoading(false); // Stop loading once done
      
    }
  };
if(getUploadedFiles){
  fetchDocuments()
}

if(fetchFileTrigger)
{
  fetchDocuments()
  setFetchFileTrigger(false)
}


  // Effect to handle fetching documents based on chatId availability
  useEffect(() => {
    if(chatIdCtx)
      {
        
        fetchDocuments()
      }
  }, [chatIdCtx]); 

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    setIsDocumentsExpanded(newExpandedState); // Update parent component state
  };
  
  return (
    <div style={{ ...styles.container, width: isExpanded ? "220px" : "30px",height:isExpanded?"300px" :"35px" , background :"white"}}>
      <div style={{...styles.header}} onClick={toggleExpand} >
        
        <button style={styles.button}>
          {isExpanded ? <h4 style={styles.expandHeader}>Uploaded Documents</h4> : <img style={{height:25,width:25}} src={docStackIcon} alt=""/>}
        </button>
      </div>

      {/* Render content when expanded */}
      {isExpanded && (
        <div style={styles.content}>

            <ul style={styles.list}>
              {uploadedDocuments.length > 0 ? (
                uploadedDocuments.map((doc, index) => {
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
                  return(
                  <li key={index}><div style={styles.containerLabels}><img style={{height:22,width:22,paddingRight:10}} src={getFileIcon(doc.file_name)} alt=""/><a   href={doc.file_url}   target="_blank"  download  style={{    textDecoration: 'none',     color: 'inherit', cursor: 'pointer', }} > {doc.file_name} </a>
                </div></li>); // Render documents from API response
})
              ) : (
                <li>No documents available</li> // If no documents are returned
              )}
            </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    border: "1px solid #ccc",
    overflow: "hidden",
    transition: "width 0.3s ease", // Animate width change
    borderTopLeftRadius: 10,
    position:"absolute",
    borderBottomLeftRadius: 10,
  
    whiteSpace: "nowrap", // Prevent text wrapping during expansion
  },
  header: {
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "start",
    alignItems: "start",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
  },
  button: {
    border:"none",
    background: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  content: {
    padding: "12px",
    backgroundColor: "#fff",
    overflowY: "auto",
    height:100
    },
  containerLabels:{
    display: "flex",
    
    fontSize: "14px",
    alignItems: "start",
    padding: "4px 4px",
    backgroundColor:" #ffffff",
    border:"none",
    cursor: "pointer",

  },
  expandHeader:{
    margin:12
  },
  list: {
    listStyleType: "none", // Remove bullets
    padding: 0, // Remove default padding
    margin: 0, // Remove default margin
  },

};

export default DocumentsUploaded;
