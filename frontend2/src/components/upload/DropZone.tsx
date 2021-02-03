import React, { forwardRef, useState, useEffect, useRef, InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { RootState } from '../../modules';
import { add, remove } from '../../modules/fileList';
import { preProcessFile } from 'typescript';

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

const InputFileinput = styled.input`
display:none;
`;

const DropZone = (props: any) => {
    const fileList: File[] = props.filesState;
    const setFileList = props.setFilesState;


    const handleFiles = (files: FileList) => {
        for (let i = 0; i < files.length; i++) {
            if (fileList.filter((file: File) => file.name == files[i].name).length <= 0) {
                setFileList((pre: File[]) => [...pre, files[i]]);
            }
        }
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

    const removeFile = (name: string) => {
        const targetIndex = fileList.findIndex((e: File) => e.name === name);
        let tempFileList = [...fileList]
        tempFileList.splice(targetIndex, 1)
        setFileList(tempFileList)
        // dispatch(remove(targetIndex))
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
        <DivContainer id="container" onDrop={fileDrop} onDragLeave={dragLeave} onDragOver={dragOver} onDragEnter={dragEnter}>
            <DivDropConatiner onClick={fileInputClicked}>
                <DivDropMessage>
                    <DivUploadIcon />
                    Drag & Drop files here or click to upload
                </DivDropMessage>
                <InputFileinput type="file" multiple onChange={filesSelected} ref={fileInputRef} />
            </DivDropConatiner>
            <DivFileDisplay>
                {fileList.map((data: File, i) =>
                    <DivFileStatus key={i}>
                        <div>
                            <div className="file-type-logo"></div>
                            <DivFileType>{fileType(data.name)}</DivFileType>
                            <SpanFileName >{data.name}</SpanFileName>
                            <SpanFileSize>({fileSize(data.size)})</SpanFileSize>
                            <SpanFileRemove onClick={() => removeFile(data.name)}>×</SpanFileRemove>
                        </div>
                    </DivFileStatus>
                )}
            </DivFileDisplay>
        </DivContainer>
    )
}

export default DropZone;