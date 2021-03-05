import React,
{
    useState,
    FormEvent,
    useEffect,
} from 'react';
import styled from '@emotion/styled';
import { useHistory } from 'react-router';
import arrayToTree from 'array-to-tree';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    fade,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Typography
}
    from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../modules';
import api from '../../util/api';
import { Folder, FolderOpen, Remove } from '@material-ui/icons';
// import TempDropZone from './TempDropZone';
import TempDropZone from './tempDropZone'
import { UploadFileInfo } from '../../util/types';
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
/**
 * * types & interfaces 
 */
interface TreeViews {
    children?: TreeViews[];
    categoryName: string;
    categoryId: string;
}
interface CategoryProps {
    category: TreeViews
}

const TempUpload = () => {
    /**
     * ? store
     */
    const history = useHistory()
    const user = useSelector((state: RootState) => state.member)
    // const fileList = useSelector((state:RootState)=>state.fileList)
    /**
     * ? api
     */
    api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;

    /**
     * ? state
     */
    const [fileList, setFileList] = useState<Array<UploadFileInfo>>([]);

    const [title, setTitle] = useState<string>();
    const [currentInputTag, setCurrentInputTag] = useState<string>('');
    const [tags, setTags] = useState<Array<string>>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [assetSeq, setAssetSeq] = useState<number>();
    const [isPaused, setIsPaused] = useState<boolean>(false);
    
    const [categories, setCategories] = useState([]);
    const [expendedCategory, setExpendedCategory] = useState<Array<string>>();
    const [isTagDuplicated, setIsTagDuplicated] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [uploadOpen, setUploadOpen] = useState<boolean>(false);

    const CHUNK_SIZE: number = 1024 * 1024 * 10;//10MB

    /**
     * ? functions
     */
    useEffect(() => {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
        api.get(`/category/list`)
            .then(response => {
                setCategories(arrayToTree(response.data.result, { parentProperty: 'categoryParent', customID: 'categoryId' }))
            })
    }, [user])
    useEffect(() => {
        let tempArray: Array<string> = [];
        async function getParents(array: Array<TreeViews>) {
            await array.map((node: TreeViews) => {
                if (node.children) {
                    tempArray.push(node.categoryId + '');
                    getParents(node.children);
                }
            });
            setExpendedCategory(tempArray)
        };
        getParents(categories);
    }, [categories])

    const renderTrees = (nodes: TreeViews) => (
        <TreeItem
            endIcon={<Remove />}
            key={nodes.categoryId}
            nodeId={nodes.categoryId + ''}
            label={nodes.categoryName}
            classes={{ label: classes.label, group: classes.group, iconContainer: classes.iconContainer }}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTrees(node)) : null}
        </TreeItem>
    );
    const Category = ({ category }: CategoryProps) => {
        useEffect(() => {
        }, [category]);
        return renderTrees(category);
    }
    const handleToggle = (event: any, nodeIds: string[]) => {
        event.preventDefault()
    };
    const handleNodeSelect = (event: any, nodeId: React.SetStateAction<string>) => {
        setSelectedCategory(nodeId)
    };
    const handleAlertOpen = () => {
        setAlertOpen(true)
    }
    const handleAlertClose = () => {
        setAlertOpen(false)
    }
    const handlerUploadOpen = () => {
        setUploadOpen(true);
    }
    const handlerUploadClose = () => {
        setUploadOpen(false);
    }
    /**
     * * 파일 업로드
     */
    const submitFiles = async (e: FormEvent) => {
        e.preventDefault();
        if (fileList.length !== 0 && title && selectedCategory) {
            let data = { assetTitle: title, assetCategory: selectedCategory }
            try {
                const response = await api.post(`/asset`,
                    data,
                    {
                        headers: {
                            'Content-type': 'application/json',
                        }
                    });
                setAssetSeq(response.data.result.assetSeq);
            }
            catch (err) {
                console.log(err);
            }
        } else {
            handleAlertOpen();
        }
    }

    const uploadStart = async () => {
        console.log(fileList)
        for (let i = 0; i < fileList.length; i++) {
            !fileList[i].isUploadComplete && !isPaused && await fileUpload(fileList[i])
        }
    }
    const fileUpload = async (file: UploadFileInfo) => {
        const targetFile = {...file}
        const response = await api.get(`/createLocation/${assetSeq}`)
        targetFile.assetLocation= response.data.result
        const chunks = fileToChunks(targetFile.file)
        for(let i=0;i<chunks.length;i++){
            if(!isPaused){
                try{
                    await api.post(`/templargefile`)
                }catch(err) {
                    console.log(err);
                }
            }
        }
    }

     // 파일을 청크로 나누는 함수
     const fileToChunks = (target: File) => {
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
    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            let inputTag = currentInputTag.trim();
            if (inputTag !== "") {
                if (tags.filter(tag => tag === inputTag).length <= 0) {
                    setIsTagDuplicated(false);
                    let tmp: Array<string> = [...tags].concat(currentInputTag);
                    setTags(tmp);
                } else {
                    setIsTagDuplicated(true)
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


    const useStyles = makeStyles({
        root: {
            height: 240,
            flexGrow: 1,
            maxWidth: 400,
            display: 'contents',
        },
        label: {
            textAlign: 'left'
        },
        group: {
            marginLeft: 7,
            paddingLeft: 18,
            borderLeft: `1px dashed ${fade('#000000', 0.4)}`,
        },
        iconContainer: {
            "& svg": {
                marginLeft: 10
            }
        }
    });

    function setFileListProp(action: string, payload: any) {
        switch (action) {
            case "set":
                setFileList(payload)
                break;
            case "add":
                setFileList(pre=>{
                    let tempFileList=[...pre];
                    tempFileList = tempFileList.concat(payload)
                    return tempFileList;
                })
                break;
            case "delete":
                setFileList(pre=>{
                    let tempFileList = [...pre];
                    tempFileList.splice(payload, 1);
                    return tempFileList;
                })
                break;
            default:
                setFileList([])
                break;
        }
    }

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
                                <SpanInputLabel>제목</SpanInputLabel>
                                <InputText type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} className="logininput" />
                            </DivInputGroup>

                            <DivInputGroup>
                                <SpanInputLabel>카테고리</SpanInputLabel>
                                {categories.length > 0 ? (
                                    <TreeView
                                        onNodeToggle={handleToggle}
                                        onNodeSelect={handleNodeSelect}
                                        className={classes.root}
                                        defaultCollapseIcon={<FolderOpen />}
                                        defaultExpandIcon={<Folder />}
                                        expanded={expendedCategory}
                                    >
                                        <div>
                                            {categories.map((category: TreeViews) => {
                                                return <Category key={category.categoryId} category={category} />
                                            })}
                                        </div>
                                    </TreeView>
                                ) :
                                    (<CircularProgress />)
                                }
                            </DivInputGroup>


                            <DivInputGroup>
                                <SpanInputLabel>태그</SpanInputLabel>
                                <InputText type="text" value={currentInputTag} onChange={(e) => { setCurrentInputTag(e.target.value) }} onKeyPress={(e) => { addTag(e) }} placeholder="태그 입력 후 엔터" />
                            </DivInputGroup>
                            <DivTagGroup>
                                {
                                    isTagDuplicated ?
                                        <div style={{ color: 'red' }}>
                                            중복된 태그입니다.
                                    </div> : null
                                }

                                {tags.map((data, i) =>
                                    <SpanTag key={i}>{data}<SpanTimes onClick={() => { removeTag(data) }}>×</SpanTimes></SpanTag>
                                )}
                            </DivTagGroup>
                            <DivInputGroup>
                                <TempDropZone fileList={fileList} setFileListProp={setFileListProp} />
                            </DivInputGroup>
                            <DivTagGroup>
                                <Button size="large" color="primary"
                                    // onClick={submitFiles}
                                    onClick={uploadStart}
                                >저장</Button>
                            </DivTagGroup>

                        </FormLogin>
                    </DivBox>
                </DivContainer>
            </DivWrapper>

            <Dialog
                open={alertOpen}
                onClose={handleAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"입력정보를 확인해주세요"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        (제목, 카테고리, 파일첨부는 필수요소 입니다.)
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAlertClose} color="primary">
                        확인
          </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default TempUpload;