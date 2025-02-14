import React from 'react'
import DocIcon from '../../images/icons8-word-48.png';
import PdfIcon from '../../images/icons8-pdf-48.png';
import ImageIcon from '../../images/icons8-image-48.png';
import ExcelIcon from '../../images/icons8-excel-48.png';
import DefaultIcon from '../../images/icons8-file-50.png';
import PptIcon from '../../images/icons8-powerpoint-48.png';
import csvimg from '../../images/OIP.png';
import './FileLoading.css'

function FileLoading({FileList}) {
  return (
    <div>
    <div className="file-upload-list">
    {FileList.map((file, index) => {
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
            return ExcelIcon; // Replace with actual Excel icon source

          case 'csv':
            return csvimg;

          case 'ppt':
          case 'pptx':
            return PptIcon;
          default:
            return DefaultIcon; // Replace with a default icon source
        }
      };

      return (<div className="file-chip" key={index}>
          <img
            src={getFileIcon(file.name)}
            className="document-icons"
            alt="File Icon"
          />
          <span className="file-name">{file.name}</span>
        </div>
      );
    })}
    </div>
    
</div>
  )
}

export default FileLoading


