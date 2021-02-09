import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import DropZone from './DropZone';
import { useHistory } from 'react-router';
import arrayToTree from 'array-to-tree';
import { ExpandMore, ChevronRight } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
//style 

let DivWrapper = styled.div`
width:100%;
margin: 0 auto;
padding: 0px;
justify-content: center;
align-items: center;
box-sizing: border-box;
`;

let DivContainer = styled.div`
width: 100%;
min-height: 100vh;
display:block;
//flex-wrap: wrap;
margin-right: auto;
margin-left: auto;
padding-left: 15px;
padding-right: 15px;
padding-top: 15px;
// justify-content: center;
// align-items: center;
// padding: 15px;
background: #ebeeef;
`;

let DivTitleContainer = styled.div`
// width:100%;
display:flex;
margin-bottom: 20px;
border-bottom: 1px solid #eaeaea;
`;

let DivBox = styled.div`
max-width: 80%;
// min-width: 670px;
margin: auto;
background: #fff;
// padding:10px;
// overflow: hidden;
position: relative;
padding: 20px;
border-radius: 3px;
box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px;
`;

const DivInputGroup = styled.div`
width: 100%;
  position: relative;
  border-bottom: 1px solid #b2b2b2;
  margin-bottom: 26px;
`;

const DivTagGroup = styled.div`
width:100%;
position:relative;
margin-bottom:26px;
display:block;
`;

const SpanInputLabel = styled.span`
font-family: Poppins-Regular;
  font-size: 15px;
  color: #808080;
  line-height: 1.2;
  text-align: right;
  position: absolute;
  top: 14px;
  left: -105px;
  width: 80px;
`;
const InputText = styled.input`
font-family: Poppins-Regular;
  font-size: 15px;
  color: #555555;
  line-height: 1.2;
  height: 45px;
  display: block;
  width: 100%;
  background: transparent;
  padding: 0 5px;
  outline:none;
  border:none;
`;
const FormLogin = styled.form`
width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 43px 88px 93px 150px;
`;

const SpanTag = styled.span`
display:inline-block;
background:#4abdff;
margin-right:5px;
margin-top:2px;
margin-bottom:2px;
padding:5px 7px 5px 7px;
border-radius:4px;
color:#fff;
`;

const SpanTimes = styled.span`
margin: 3px;
margin-left 5px;
font-weight: bolder;
color:#fff;
&:hover{
    cursor:pointer;
    color:#cccccc;
}
&:active{
    color:#7a7a7a;
}
`;


//style end
const Upload = () => {
    const history = useHistory()
    const sessionUser = sessionStorage.getItem("sessionUser");
    if (sessionUser) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(sessionUser).token;
    }
    let [title, setTitle] = useState<string>();
    let [currentInputTag, setCurrentInputTag] = useState<string>('');
    let [tags, setTags] = useState<Array<string>>([]);
    let [filesState, setFilesState] = useState<Array<File>>([]);
    let [categories, setCategories] = useState([]);
    const CHUNK_SIZE: number = 1024 * 1024 * 10;//10MB

    useEffect(() => {
        axios.get(`/api/category/list`)
            .then(response => {
                setCategories(arrayToTree(response.data.result, { parentProperty: 'categoryParent', customID: 'categoryId' }))
            })
    }, [])
    useEffect(() => {
        console.log(categories)
    }, [categories])
    interface TreeViews {
        children?: TreeViews[];
        categoryName: string;
        categoryId: string;
    }

    interface CategoryProps {
        category: TreeViews
    }

    const renderTrees = (nodes: TreeViews) => (
        <TreeItem key={nodes.categoryId} nodeId={nodes.categoryId} label={nodes.categoryName}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTrees(node)) : null}
        </TreeItem>
    );

    const Category = ({ category }: CategoryProps) => {
        useEffect(() => {

        }, [category]);
        return renderTrees(category);
    }

    const handleToggle = (event: any, nodeIds: string[]) => {
        event.persist()
    };
    const handleNodeSelect = (event: any, nodeId: React.SetStateAction<string>) => {
        console.log(nodeId);
    };

    const fileUpload = (seq: number) => {
        filesState.forEach(async (item, i) => {
            if (item.size > CHUNK_SIZE) {
                const chunks = fileSlicer(item)
                let data = {
                    "assetSeq": seq,
                    "assetOriginName": item.name,
                    "assetSize": item.size,
                    "assetUuidName": '',
                    "isLastChunk": false,
                    "location": '',
                    "assetType": item.type
                }
                const result = await axios.post(`/api/prelargefile`,
                    data
                )
                data["assetUuidName"] = result.data.result.assetUuidName;
                data["location"] = result.data.result.location;
                for (let i = 0; i < chunks.length; i++) {
                    if ((i + 1) === chunks.length) {
                        data["isLastChunk"] = true;
                    }
                    try {
                        console.log(data.isLastChunk)
                        const result = await axios.post(`/api/largefile`,
                            chunks[i],
                            {
                                params: data,
                                headers: { 'Content-Type': 'multipart/form-data' }
                            }
                        )
                    } catch (err) {
                        console.log(err);
                    }
                }
            } else {
                try {
                    const formData = new FormData();
                    formData.append("file", item);
                    formData.append("assetSeq", '' + seq);
                    formData.append("assetType", item.type);
                    await axios.post(`/api/file`,
                        formData
                    )

                }
                catch (err) {

                }
            }
            if (i === filesState.length - 1) {
                await fileUploadComplete(seq)
            }
        })

    }
    const fileUploadComplete = async (seq: number) => {
        try {
            await axios.post(`/api/complete`,
                { assetSeq: seq, tags: tags.toString() },
                {
                    headers: {
                        'Content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                })
            setFilesState([]);

            history.push('/')
        } catch (err) {
            console.log(err)
        }

    }

    const submitFiles = async (e: FormEvent) => {
        e.preventDefault();
        if (filesState.length !== 0) {
            let data = { assetTitle: title }
            try {
                const response = await axios.post(`/api/asset`,
                    data,
                    {
                        headers: {
                            'Content-type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                // setAssetSeq();
                fileUpload(response.data.result.assetSeq);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            let inputTag = currentInputTag.trim();
            if (inputTag !== "") {
                if (tags.filter(tag => tag === inputTag).length <= 0) {
                    let tmp: Array<string> = [...tags].concat(currentInputTag);
                    setTags(tmp);
                }
            }
            setCurrentInputTag('');
        }
    }

    const removeTag = (targetTag: string) => {
        const targetTagIndex = tags.findIndex(e => e === targetTag);
        tags.splice(targetTagIndex, 1);
        setTags([...tags]);
    }

    // 파일을 청크로 나누는 함수
    const fileSlicer = (target: File) => {
        let chunks = [];
        let chunkIndex = 0; // 파일 자를 시작 위치
        const CHUNK_COUNT = Math.ceil(target.size / CHUNK_SIZE);//청크갯수
        for (let i = 1; i <= CHUNK_COUNT; i++) {
            if (i === CHUNK_COUNT)
                chunks.push(target.slice(chunkIndex))
            else
                chunks.push(target.slice(chunkIndex, chunkIndex + CHUNK_SIZE))
            chunkIndex += CHUNK_SIZE;
        }
        return chunks
    }
    const useStyles = makeStyles({
        root: {
            height: 240,
            flexGrow: 1,
            maxWidth: 400,
        },
    });
    const classes = useStyles();
    return (
        <>

            <DivWrapper>
                <DivContainer>
                    <DivBox>
                        <DivTitleContainer>
                            <h2 className="h3 mb-2 text-gray-800">업로드</h2>
                        </DivTitleContainer>
                        <FormLogin
                        // onSubmit={submitFiles}
                        >
                            <DivInputGroup>
                                <SpanInputLabel>재목</SpanInputLabel>
                                <InputText type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} className="logininput" />
                            </DivInputGroup>
                                {categories.length > 0 && (
                                <TreeView
                                    onNodeToggle={handleToggle}
                                    onNodeSelect={handleNodeSelect}
                                    className={classes.root}
                                    defaultCollapseIcon={<ExpandMore />}
                                    defaultExpandIcon={<ChevronRight />}
                                    // expanded={categories.map((group: TreeViews) => group.categoryId + '')}
                                >
                                    <div>
                                        {categories.map((category: TreeViews) => {
                                            return <Category key={category.categoryId} category={category} />
                                        })}
                                    </div>
                                </TreeView>
                                )}
                            <DivInputGroup>
                                <SpanInputLabel>태그</SpanInputLabel>
                                <InputText type="text" value={currentInputTag} onChange={(e) => { setCurrentInputTag(e.target.value) }} onKeyPress={(e) => { addTag(e) }} placeholder="태그 입력 후 엔터" />
                            </DivInputGroup>
                            <DivTagGroup>

                                {tags.map((data, i) =>
                                    <SpanTag key={i}>{data}<SpanTimes onClick={() => { removeTag(data) }}>×</SpanTimes></SpanTag>
                                )}
                            </DivTagGroup>
                            <DivInputGroup>
                                <DropZone filesState={filesState} setFilesState={setFilesState} />
                            </DivInputGroup>
                            <DivTagGroup>
                                <button onClick={submitFiles}>저장</button>
                                <button type="reset">취소</button>
                            </DivTagGroup>

                        </FormLogin>
                    </DivBox>
                </DivContainer>
            </DivWrapper>
        </>
    )
}

export default Upload;