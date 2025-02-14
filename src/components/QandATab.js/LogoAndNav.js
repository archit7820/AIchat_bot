import React  from 'react'
import New_Chat from "../../images/write.png"
import Altysys_logo from "../../images/altysys_logo-removebg-preview.png"
import AddFile from "../../images/AddFile.png"
import { useSharedContext } from '../../sharedProvider'
import { useAppContext } from '../../AppContext';



function LogoAndNav({isOpen, selectedTab}) {
  const { setOpenNewChat } = useSharedContext();
  const {setShowChatTrigger} = useAppContext();
  const {setChatIdCtx} = useAppContext()
  const {setShowChatHistory} = useAppContext();
  const {setRedisId} = useAppContext()
  const {setIsFirstTime,setMessages,setUploadedDocuments,setIsDocumentUploadedCtx,setFileId,setIsFetchingAnswer,setFileUploadFailed,setUploadedFiles} = useAppContext()


  const handleNewChatClick = () => {
    setOpenNewChat(true);
    setChatIdCtx(null);
    setShowChatTrigger(false);
    setRedisId(null);
    setShowChatHistory([]);
    setIsFirstTime(true)
    setMessages([]);
    setUploadedDocuments([])
    localStorage.setItem('chatid',"")
    localStorage.setItem('redisid',"")
    setIsFetchingAnswer(false)
    setFileUploadFailed(false)
    setUploadedFiles([])
    
  };
  const newChatSummary=()=>{
    localStorage.setItem('fileId',"")
    localStorage.setItem('fileUrl',"")
    localStorage.setItem('filesummary',"")
    setIsDocumentUploadedCtx(false)
    setFileId('')
  }
  return (
    <div  style={{display  : "flex" ,  gap : "10px" ,width : "100%", paddingTop : "16px"}}>
        <img style={{
          width:100,  
        }} src={Altysys_logo} className="w-9" alt=""/>

        { selectedTab == 0 &&
        <img style={{
          height:27,
          width:27,
          paddingLeft: isOpen? 50: 0,
          cursor:'pointer'
        }} src={New_Chat} onClick={() => handleNewChatClick()}  alt=""/>
        }

        { selectedTab == 1 &&
        <img style={{
          height:27,
          width:27,
          paddingLeft: isOpen? 50: 0,
          cursor:'pointer'
        }} src={AddFile} className="w-9" alt="" onClick={()=>newChatSummary()}/>

      }
    </div>
  )
}

export default LogoAndNav