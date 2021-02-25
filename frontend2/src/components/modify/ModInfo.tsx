import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { useHistory } from 'react-router';
import arrayToTree from 'array-to-tree';
import { ExpandMore, ChevronRight, Comment, Delete } from '@material-ui/icons'
import { Button, CircularProgress, colors, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules';
import api from '../../util/api';
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

type MatchParams = {
    assetSeq: string
}

//style end
const ModInfo = (props: MatchParams) => {
    const history = useHistory()
    const user = useSelector((state: RootState) => state.member)
    api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    const assetSeq: string = props.assetSeq;

    let [fileList, setFileList] = useState<Array<AssetFile>>();
    let [title, setTitle] = useState<string>();
    let [currentInputTag, setCurrentInputTag] = useState<string>('');
    let [tags, setTags] = useState<Array<string>>([]);
    let [categories, setCategories] = useState([]);
    let [selectedCategory, setSelectedCategory] = useState<string>();
    let [categoriesHavingChild, setCategoriesHavingChild] = useState<Array<string>>();
    let [isTagDuplicated, setIsTagDuplicated] = useState<boolean>(false);
    let [alertOpen, setAlertOpen] = useState<boolean>(false);
    let [fileDeleteAlertOpen, setFileDeleteAlertOpen] = useState<boolean>(false)
    let [deleteTargetFileIndex, setDeleteTargetFileIndex] = useState<number>();

    let [assetInfo, setAssetInfo] = useState<Asset>();

    useEffect(() => {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
        api.get(`/category/list`)
            .then(response => {
                setCategories(arrayToTree(response.data.result, { parentProperty: 'categoryParent', customID: 'categoryId' }))
            })
    }, [user])

    useEffect(() => {
        api.get(`/asset/${assetSeq}`)
            .then(result => {
                let data: Asset = result.data.result;
                setAssetInfo(data);
                setTitle(data.assetTitle);
                setFileList(data.assetFiles);
                if (data.tags)
                    setTags(data.tags.split(','))
                setSelectedCategory(data.assetCategory + '')
            })
    }, [assetSeq])

    useEffect(() => {
        let tempArray: Array<string> = [];
        async function getParents(array: Array<TreeViews>) {
            await array.map((node: TreeViews) => {
                if (node.children) {
                    tempArray.push(node.categoryId + '');
                    getParents(node.children);
                }
            });
            setCategoriesHavingChild(tempArray)
        };
        getParents(categories);
    }, [categories])
    interface TreeViews {
        children?: TreeViews[];
        categoryName: string;
        categoryId: string;
    }

    interface CategoryProps {
        category: TreeViews
    }
    type Asset = {
        assetSeq: number,
        assetOwner: string,
        assetOwnerName: string,
        assetChanger: string,
        assetChangerName: string,
        assetTitle: string,
        assetCreateDate: Date,
        assetUpdateDate: Date,
        tags: string,
        assetCategory: number,
        assetCategoryName: string,
        assetFiles: Array<AssetFile>,
    }
    type AssetFile = {
        assetSeq: number,
        assetLocation: string,
        assetOriginName: string,
        assetSize: number,
        assetType: string,
    }

    const renderTrees = (nodes: TreeViews) => (
        <TreeItem key={nodes.categoryId} nodeId={nodes.categoryId + ''} label={nodes.categoryName} classes={{ label: classes.label }}>
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

    const handleCancel = () => {
        history.goBack();
    }

    const handleAlertOpen = () => {
        setAlertOpen(true)
    }
    const handleAlertClose = () => {
        setAlertOpen(false)
    }

    const handleFileDeleteAlertClose = () => {
        setFileDeleteAlertOpen(false);
    }

    const handleFileDeleteAlertOpen = (i: number) => () => {
        setDeleteTargetFileIndex(i);
        setFileDeleteAlertOpen(true)
    }

    const handleFileDelete = () => {
        api.delete(`/file`,
            {
                params: {
                    assetLocation: fileList[deleteTargetFileIndex].assetLocation
                },
                headers: {
                    'Content-type': 'application/json',
                }
            }
        ).then(result => {
            let tempFileList = [...fileList]
            tempFileList.splice(deleteTargetFileIndex, 1)
            setFileList([...tempFileList]);
            setDeleteTargetFileIndex(null)
            setFileDeleteAlertOpen(false)
        })
    }

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            let inputTag = currentInputTag.trim();
            if (inputTag !== "") {
                if (tags.filter(tag => tag.trim() === inputTag).length <= 0) {
                    setIsTagDuplicated(false);
                    api.post(`/tag`, null,
                        { params: { assetTag: inputTag, assetSeq: assetSeq } }
                    ).then(result => {
                        if (result.data.result)
                            setTags(result.data.result.split(','))
                        else
                            setTags([])
                    })
                } else {
                    setIsTagDuplicated(true)
                }
            }
            setCurrentInputTag('');
        }
    }

    const removeTag = (targetTag: string) => {
        api.delete(`/tag`,
            { params: { assetTag: targetTag.trim(), assetSeq: assetSeq } }
        ).then(result => {
            if (result.data.result)
                setTags(result.data.result.split(','))
            else
                setTags([])
        })
    }

    const submitModify = (e: FormEvent) => {
        e.preventDefault();
        const data = {
            assetSeq: assetSeq,
            assetTitle: title,
            assetCategory: selectedCategory
        }
        api.put(`/asset`,
            data, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }
        ).then(result => {
            history.goBack();
        })
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
    });
    const classes = useStyles();
    return (
        <>
            {assetInfo &&
                <DivWrapper>
                    <DivContainer>
                        <DivBox>
                            <DivTitleContainer>
                                <h2 className="h3 mb-2 text-gray-800">수정</h2>
                            </DivTitleContainer>
                            <FormLogin>
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
                                            expanded={categoriesHavingChild}
                                            defaultSelected={assetInfo.assetCategory + ''}
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
                                    {fileList && <List >
                                        {fileList.map((value, i) => {
                                            const labelId = `checkbox-list-label-${i}`;
                                            return (
                                                <ListItem key={i} role={undefined} dense >

                                                    <ListItemText id={labelId} primary={value.assetOriginName} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" aria-label="delete" onClick={handleFileDeleteAlertOpen(i)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            );
                                        })}
                                    </List>}
                                </DivInputGroup>
                                <DivTagGroup>
                                    <Button color="primary" onClick={submitModify}>저장</Button>
                                    <Button color="secondary" onClick={handleCancel}>취소</Button>
                                </DivTagGroup>

                            </FormLogin>
                        </DivBox>
                    </DivContainer>
                </DivWrapper>
            }
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

            <Dialog
                open={fileDeleteAlertOpen}
                onClose={handleFileDeleteAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"파일을 삭제하시겠습니까?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        삭제된 파일은 복구할 수 없습니다.
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFileDelete} color="secondary">
                        확인
          </Button>
                    <Button onClick={handleFileDeleteAlertClose} color="primary">
                        취소
          </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default ModInfo;