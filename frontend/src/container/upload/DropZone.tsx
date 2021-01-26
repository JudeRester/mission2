import React, { forwardRef, useState, useEffect, useRef, InputHTMLAttributes } from 'react';
import styled from 'styled-components';


// const DivContainer = styled.div`
// display: inline-block;
// z-index:10000;
// `;

// const DivDragEffectBorder = styled.div`
// border: dashed grey 4px;
// backgroundColor: rgba(255,255,255,.8);
// position: absolute;
// top:0;
// bottom:0;
// left:0;
// right:0;
// z-index:3000;
// `;

// const DivDragEffect = styled.div`
// top:50%;
// right:0;
// left:0;
// textAlign:center;
// color:grey;
// fontSize:36;
// `;


const DivContainer = styled.div`
`;

const PContainer = styled.p`
color: red;
text-align: center;
`;

const DivDropConatiner = styled.div`
// display: flex;
align-items: center;
justify-content: center;
margin: 0;
// width: 800px;
height: 200px;
border: 4px dashed #4aa1f3;
`;

const DivUploadIcon = styled.div`
width: 50px;
height: 50px;
background: url(../../images/upload.svg) no-repeat center center; 
background-size: 100%;
text-align: center;
margin: 0 auto;
padding-top: 30px;
`;

const DivDropMessage = styled.div`
text-align: center;
color: #4aa1f3;
font-family: Arial;
font-size: 20px;
`;

const DivFileDisplay = styled.div`
// position: fixed;
// width: 805px;
`;

const DivFileStatus = styled.div`
display:flex;
width: 100%;
    vertical-align:top;
    margin-top: 10px;
    margin-bottom: 20px;
    position: relative;
    line-height: 50px;
    height: 50px;

    > div{
        overflow:hidden;
    }
`;

const DivFileType = styled.div`
display: inline-block!important;
position: absolute;
font-size: 12px;
font-weight: 700;
line-height: 13px;
margin-top: 25px;
padding: 0 4px;
border-radius: 2px;
box-shadow: 1px 1px 2px #abc;
color: #fff;
background: #0080c8;
text-transform: uppercase;
`;

const SpanFileName = styled.span`
display: inline-block;
vertical-align:top;
margin-left: 50px;
color: #4aa1f3;
`;

const SpanFileSize = styled.span`
display:inline-block;
vertical-align:top;
color:#30693D;
margin-left:10px;
margin-right:5px;
margin-left: 10px;
color: #444242;
font-weight: 700;
font-size: 14px;
`;

const SpanFileRemove = styled.span`
position: absolute;
top: 20px;
right: 10px;
line-height: 15px;
cursor: pointer;
color: red;
margin-right: -10px;
`;

const SpanFileErrorMsg = styled.span`
color:red;
`;

const DropZone = () => {
    //states
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [validFiles, setValidFiles] = useState([]);
    //functions
    const dragOver = (e: DragEvent) => {
        e.preventDefault();
    }

    const dragEnter = (e: DragEvent) => {
        e.preventDefault();
    }

    const dragLeave = (e: DragEvent) => {
        e.preventDefault();
    }

    const fileDrop = (e: DragEvent) => {
        e.preventDefault();
        const files: FileList = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    }

    const handleFiles = (files: FileList) => {
        for (let i = 0; i < files.length; i++) {
            setSelectedFiles(prevArray => [...prevArray, files[i]]);
        }
    }

    const fileSize = (size: number) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName: string) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }

    const removeFile = (name: string) => {
        const validFileIndex = validFiles.findIndex(e => e.name === name);
        validFiles.splice(validFileIndex, 1);
        // update validFiles array
        setValidFiles([...validFiles]);
        const selectedFileIndex = selectedFiles.findIndex(e => e.name === name);
        selectedFiles.splice(selectedFileIndex, 1);
        // update selectedFiles array
        setSelectedFiles([...selectedFiles]);
    }

    const fileInputRef = useRef<HTMLInputElement>();
    const fileInputClicked = () =>{
        fileInputRef.current.click();
    }
    const filesSelected = () => {
        if(fileInputRef.current.files.length){
            handleFiles(fileInputRef.current.files);
        }
    }

    useEffect(() => {
        document.getElementById('container').addEventListener('dragenter', dragEnter);
        document.getElementById('container').addEventListener('dragleave', dragLeave);
        document.getElementById('container').addEventListener('dragover', dragOver);
        document.getElementById('container').addEventListener('drop', fileDrop);

        let filteredArray = selectedFiles.reduce((file, current: File) => {
            const x = file.find((item: { name: string; }) => item.name === current.name);
            if (!x) {
                return file.concat([current]);
            } else {
                return file;
            }
        }, []);
        setValidFiles([...filteredArray]);

    }, [selectedFiles])

    return (
        <DivContainer id="container" onClick={fileInputClicked}>
            <DivDropConatiner>
                <DivDropMessage>
                    <DivUploadIcon />
                    Drag & Drop files here or click to upload
                </DivDropMessage>

            </DivDropConatiner>
            <DivFileDisplay>
                {validFiles.map((data, i) =>
                    <DivFileStatus key={i}>
                        <div>
                            <input type="file" multiple onChange={filesSelected} ref={fileInputRef} />
                            <div className="file-type-logo"></div>
                            <DivFileType>{fileType(data.name)}</DivFileType>
                            <SpanFileName className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</SpanFileName>
                            <SpanFileSize>({fileSize(data.size)})</SpanFileSize>{data.invalid && <SpanFileErrorMsg>(error)</SpanFileErrorMsg>}
                            <SpanFileRemove onClick={() => removeFile(data.name)}>X</SpanFileRemove>
                        </div>
                    </DivFileStatus>
                )}
            </DivFileDisplay>
        </DivContainer>
    )

    //     //state
    //     const [dragging, setDragging] = useState(false);
    //     const [dragCounter, setDragCounter] = useState(0);

    //     //functions

    //     // let dropRef = React.createRef();

    //     const handleDrag = (e: DragEvent) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //     }
    //     const handleDragIn = (e: DragEvent) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         setDragCounter(dragCounter + 1);
    //         if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
    //             setDragging(true);
    //         }
    //     }

    //     const handleDragOut = (e: DragEvent) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         setDragCounter(dragCounter - 1);
    //         if (dragCounter > 0) return;
    //         setDragging(false);
    //     }

    //     const handleDrop = (e: DragEvent) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         setDragging(false)
    //         if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    //             props.handleDrop(e.dataTransfer.files);
    //             e.dataTransfer.clearData();
    //             setDragCounter(0);
    //         }
    //     }
    //     useEffect(() => {
    //         document.getElementById('container').addEventListener('dragenter', handleDragIn);
    //         document.getElementById('container').addEventListener('dragleave', handleDragOut);
    //         document.getElementById('container').addEventListener('dragover', handleDrag);
    //         document.getElementById('container').addEventListener('drop', handleDrop);
    //     }, [])

    //     // const componentDidMount: any = () => {
    //     //     setDragCounter(0);
    //     //     let div = dropRef.current;
    //     //     div.addEventListener('dragenter', this.handleDragIn);
    //     //     div.addEventListener('dragleave', this.handleDragOut);
    //     //     div.addEventListener('dragover', this.handleDrag);
    //     //     div.addEventListener('drop', this.handleDrop);
    //     // }

    //     // const componentWillUnmount: any = () => {
    //     //     let div = dropRef.current;
    //     //     div.removeEventListener('dragenter', this.handleDragIn);
    //     //     div.removeEventListener('dragleave', this.handleDragOut);
    //     //     div.removeEventListener('dragover', this.handleDrag);
    //     //     div.removeEventListener('drop', this.handleDrop);
    //     // }
    //     return (
    //         <div>
    //             <DivContainer id="container">
    //                 {dragging &&
    //                     <DivDragEffectBorder>
    //                         <DivDragEffect>
    //                             <div>여기에 놓으세요</div>
    //                         </DivDragEffect>
    //                     </DivDragEffectBorder>}
    //                     {props.children}
    //             </DivContainer>
    //         </div>
    //     )
}
export default DropZone;