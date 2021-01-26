import React, { useState } from 'react';
import DropZone from './DropZone';

const FileList = () => {

    const [files, setFiles] = useState(['nice.pdf','verycool.jpg']);

    const handleDrop =(file:File[]) =>{
        let fileList = [...files];
        for(let i=0;i<files.length;i++){
            if(!files[i]) return;
            fileList.push(files[i]);
        }
        setFiles(fileList);
    }
    
    return (
        <DropZone/>
        // <DropZone handleDrop={handleDrop}>
        //     <div style={{height:300, width:250}}>
        //         {files.map((files)=>{
        //             <div>{files}</div>
        //         })}
        //     </div>
        // </DropZone>
    )
}

export default FileList;