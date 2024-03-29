import React,
{
    useRef,
} from 'react';
import styled from '@emotion/styled';
import { v4 as uuid } from 'uuid';
import { UploadFileInfo } from '../../util/types';
import api from '../../util/api';
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
background: url(/images/upload.svg) no-repeat center center; 
background-size: 100%;
text-align: center;
margin: 0 auto;
margin-top: 20px;
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

const InputFileinput = styled.input`
display:none;
`;

const DropZone = (props: { fileList: UploadFileInfo[], setFileListProp: (action: string, payload: any) => void; isPaused:boolean}) => {

    /**
     * ? state
     */
    const fileList: UploadFileInfo[] = props.fileList;
    const setFileList = props.setFileListProp;
    /**
     * ? variable
     */
    const CHUNK_SIZE = 1024 * 1024 * 10 //10MB
    /**
     * ? functions
     */
    const handleFiles = (files: FileList) => {
        const newFiles: UploadFileInfo[] = []
        for (let i = 0; i < files.length; i++) {
            if (fileList.filter((file: UploadFileInfo) => file.file.name === files[i].name).length <= 0) {
                const newFile: UploadFileInfo = {
                    assetSeq: 0,
                    assetUuidName: uuid() + files[i].name.substring(files[i].name.lastIndexOf(".")),
                    file: files[i],
                    uploadedSize: 0,
                    currentChunk: 0,
                    totalChunk: Math.ceil(files[i].size / CHUNK_SIZE),
                    isUploadComplete: 0,
                    assetLocation: '',
                    assetSize: files[i].size,
                    assetOriginName: files[i].name,
                    assetType: files[i].type
                }
                newFiles.push(newFile)
            }
        }
        setFileList("add", newFiles)
    }
    const handleRemoveFile = async (name: string) => {
        
        const targetIndex = fileList.findIndex((e: UploadFileInfo) => e.assetOriginName === name);
        const tempList = [...fileList]
        if(props.isPaused){
            const data =fileList[targetIndex].assetLocation+fileList[targetIndex].assetUuidName
            await api.delete(`/file`,
            {
                params: {
                    assetLocation: data
                },
                headers: {
                    'Content-type': 'application/json',
                }
            }
        )}
        tempList.splice(targetIndex, 1)

        // dispatch(removeFile(targetIndex))
        setFileList("delete", targetIndex)
    }

    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const fileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files: FileList = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputClicked = () => {
        fileInputRef.current.click();
    }
    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
        }
    }

    return (
        <DivContainer
            id="container"
            onDrop={fileDrop}
            onDragLeave={dragLeave}
            onDragOver={dragOver}
            onDragEnter={dragEnter}
        >
            <DivDropConatiner onClick={fileInputClicked}>
                <DivDropMessage>
                    <DivUploadIcon />
                    파일을 드래그 & 드랍 하거나 클릭하여 업로드
                </DivDropMessage>
                <InputFileinput type="file" multiple onChange={filesSelected} ref={fileInputRef} />
            </DivDropConatiner>
            <DivFileDisplay>
                {fileList.map((data: UploadFileInfo, i) =>
                    <DivFileStatus key={i}>
                        <div>
                            <div className="file-type-logo"></div>
                            <DivFileType>{fileType(data.assetOriginName)}</DivFileType>
                            <SpanFileName >{data.assetOriginName}</SpanFileName>
                            <SpanFileSize>({fileSize(data.assetSize)})</SpanFileSize>
                            <SpanFileRemove onClick={() => handleRemoveFile(data.assetOriginName)}>×</SpanFileRemove>
                        </div>
                    </DivFileStatus>
                )}
            </DivFileDisplay>
        </DivContainer>
    )
}

export default DropZone;