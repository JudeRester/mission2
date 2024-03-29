import {
    CardContent,
    CardMedia,
    Divider,
    Grid,
    Collapse,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    GridListTileBar,
    Table,
    TableRow,
    TableCell,
    ListItemSecondaryAction,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
} from "@material-ui/core"
import { 
    ExpandLess, 
    ExpandMore, 
    GetApp 
} from "@material-ui/icons"
// import { InboxIcon } from '@material-ui/icons/MoveToInbox';
import React, { useEffect, useState } from "react"
import Carousel from "react-material-ui-carousel"
import moment from 'moment';
import { useHistory } from "react-router";
import { saveAs } from 'file-saver';
import JSZip from "jszip";
import fileDownload from "js-file-download";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";
import api, { BASE_API_URL } from "../../util/api";

const useStyles = makeStyles(() =>
({
    primary: {
        fontSize: '20px',
        textAlign: 'center'
    },
    nested: {
        paddingLeft: 4,
    },
}),
);

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

type MatchParams = {
    assetSeq: string
}

type Category = {
    categoryId: number,
    categoryName: string,
    categoryParent: number,
    categoryOrder: number
}

function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  };

const Info = (props: MatchParams) => {
    const history = useHistory();
    const assetSeq: string = props.assetSeq;
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(true);
    const [assetInfo, setAssetInfo] = useState<Asset>();
    const [parentCategory, setParentCategory] = useState<string>();
    const [checked, setChecked] = useState<Array<string>>([]);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [downloadOpen, setDownloadOpen] = useState<boolean>(false)
    const [alertOpen, setAlertOpen] = useState<boolean>(false)
    const [alertMessage, setAlertMessage] = useState<string>('')
    const user=useSelector((state:RootState)=>state.member);
    api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    const handleClick = () => {
        setIsOpen(!isOpen);
    };



    useEffect(() => {
        api.get(`/asset/${assetSeq}`
        ).then(result => {
            setAssetInfo(result.data.result);
            api.get(`/category/list`)
                .then(response => {
                    setParentCategory(findParent(result.data.result.assetCategory, response.data.result))
                })
        })
    }, [assetSeq])

    const findParent = (target: number, categories: Category[]) => {
        let pStr = "";
        categories.forEach(element => {
            if (element.categoryId == target) {
                if (element.categoryParent != 0) {
                    pStr = findParent(element.categoryParent, categories) + '>' + element.categoryName
                    return
                } else {
                    pStr = element.categoryName
                    return
                }
            }
        });
        return pStr;
    }

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const goBack = ()=>{
        history.goBack();
    }
    
    const goModify = () => {
        history.push(`/modify/${assetSeq}`)
    }

    const handleDeleteOpen = () => {
        setDeleteOpen(true)
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false)
    }
    const handleAlertOpen = () => {
        setAlertOpen(true)
    }

    const handleAlertClose = () => {
        setAlertOpen(false)
    }

    const handleDeleteConfirm = () => {
        api.delete(`/asset/${assetSeq}`,
            {
                params: {
                    assetOwner: assetInfo.assetOwner
                }
            }
        )
            .then(response => {
                const data = response.data;
                if(data.code === 403){
                    setDeleteOpen(false)
                    setAlertMessage(data.result)
                    setAlertOpen(true)
                }else{
                    history.replace("/");
                }
            })
    }

    const handleSingleDownload = (fileLocation: string, fileOriginName: string) => () => {
        api.get(`/download`, {
            responseType: 'blob',
            params:{
                fileLocation
            }
        })
            .then(response => {
                fileDownload(response.data, fileOriginName);
            })
    }

    const handleDownloadClose = () =>{
        setDownloadOpen(false)
    }

    const handleMultiDownloadAsZip = () => {
        const makeZip = new Promise(async (resolve, reject) => {
            let zip = new JSZip();
            setDownloadOpen(true)
            
            for (let i = 0; i < checked.length; i++) {
                let fileInfo = checked[i].split(',')
                await api.get(`${fileInfo[0]}`,
                    {
                        responseType: 'blob',
                        // onDownloadProgress:ProgressEvent=>{
                        //     const percentage=Math.round(
                        //         ProgressEvent.loaded*100/ProgressEvent.total
                        //     )
                        //     setProgress(percentage);
                        //     setWholeProgress(progress/checked.length)
                        // }
                    })
                    .then(response => {
                        zip.file(fileInfo[1],response.data);
                    })
            }
            resolve(zip)
        });
        makeZip.then((value:any)=>{
            value.generateAsync({ type: "blob" })
            .then(function (content:any) {
                // see FileSaver.js
                saveAs(content, assetInfo.assetTitle + ".zip");
                setDownloadOpen(false)
            })
        })
    }
    return (
        <div style={{ marginTop: 20, padding: 30 }}>
            {assetInfo &&
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Carousel
                            autoPlay={false}
                            animation={"slide"}
                            indicators={true}
                            navButtonsAlwaysVisible={true}
                        >
                            {assetInfo && assetInfo.assetFiles.map((item, i) => (
                                <Grid item>
                                    <CardContent style={{textAlign:"center"}}>
                                        <CardMedia>
                                            {!item.assetType ?
                                                <div>
                                                    <img src={BASE_API_URL.substring(0,BASE_API_URL.lastIndexOf('/api'))+"/images/unsupportedFile.png"} alt="" />
                                                    <GridListTileBar title={"미리보기가 지원되지 않는 형식"} />
                                                </div>
                                                :
                                                item.assetType.includes("image") ?
                                                    <img style={{ maxWidth: '600px',maxHeight:'600px' }} src={BASE_API_URL.substring(0,BASE_API_URL.lastIndexOf('/api'))+item.assetLocation.substring(item.assetLocation.lastIndexOf("/uploadedImages"))} alt="" />
                                                    : item.assetType.includes("video") ?
                                                        <video style={{ maxWidth: '600px',maxHeight:'600px' }} controls src={BASE_API_URL.substring(0,BASE_API_URL.lastIndexOf('/api'))+item.assetLocation.substring(item.assetLocation.lastIndexOf("/uploadedImages"))} />
                                                        :
                                                        item.assetType.includes("audio") ?
                                                            <audio controls src={BASE_API_URL.substring(0,BASE_API_URL.lastIndexOf('/api'))+item.assetLocation.substring(item.assetLocation.lastIndexOf("/uploadedImages"))} />
                                                            : <div>
                                                                <img src={BASE_API_URL.substring(0,BASE_API_URL.lastIndexOf('/api'))+"/images/unsupportedFile.png"} alt="" />
                                                                <GridListTileBar title={"미리보기가 지원되지 않는 형식"} />
                                                            </div>
                                            }

                                        </CardMedia>
                                    </CardContent>
                                </Grid>
                            ))}
                        </Carousel>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs={3}>
                        <h1>{assetInfo.assetTitle}</h1>
                        <Table aria-label="simple table">
                            <TableRow>
                                <TableCell align="right" style={{ color: "grey" }}>등록일 : {moment(assetInfo.assetCreateDate).format('YYYY-MM-DD HH:mm:ss')}
                                    {assetInfo.assetCreateDate !== assetInfo.assetUpdateDate ? <><br />수정일 : {moment(assetInfo.assetUpdateDate).format('YYYY-MM-DD HH:mm:ss')}</> : null}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell>작성자 : {assetInfo.assetOwnerName}{assetInfo.assetChanger && <><br />최종 수정자 : {assetInfo.assetChangerName}</>}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    카테고리 : {parentCategory}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    태그 : {assetInfo.tags}
                                </TableCell>
                            </TableRow>
                        </Table>
                        <div style={{textAlign:"center", margin:"auto"}}>
                        <Button variant="contained" onClick={goBack} style={{margin:"5px"}}>뒤로가기</Button>
                        <Button onClick={goModify} style={{margin:"5px"}} variant="contained" color="primary">수정</Button>
                        {(user.userRole==="ROLE_ADMIN" || user.userId === assetInfo.assetOwner) && <Button onClick={handleDeleteOpen} style={{margin:"5px"}} variant="contained" color="secondary">삭제</Button>}
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <ListItem button onClick={handleClick}>
                            <ListItemText primary="파일 리스트" classes={{ primary: classes.primary }} />
                            {isOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {/* <ListItem key="download" role="selected-download" style={{ height: 42, textAlign: 'center' }}>
                                    <ListItemText>
                                        <Button endIcon={<GetApp />} size="large" onClick={handleMultiDownloadAsZip}>선택파일 다운로드</Button>
                                    </ListItemText>
                                </ListItem> */}
                                {assetInfo.assetFiles.map((file, i) => {
                                    const labelId = `checkbox-list-label-${i}`;
                                    const fileLocation = file.assetLocation.substring(file.assetLocation.lastIndexOf("/uploadedImages"));
                                    return (
                                        <ListItem key={i} role={undefined} dense button onClick={handleToggle(`${fileLocation},${file.assetOriginName}`)}>
                                            {/* <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={checked.indexOf(`${fileLocation},${file.assetOriginName}`) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                /> 
                                            </ListItemIcon> */}
                                            <ListItemText id={labelId} primary={`${file.assetOriginName}`} />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="comments" onClick={handleSingleDownload(file.assetLocation, file.assetOriginName)}>
                                                    <GetApp />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Collapse>
                    </Grid>
                </Grid>

            }
            <Dialog
                open={deleteOpen}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"삭제하시겠습니까?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        삭제된 게시글은 복구되지 않습니다.
                     </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirm} color="secondary">
                        확인
                    </Button>
                    <Button onClick={handleDeleteClose} color="primary">
                        취소
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={downloadOpen}
                onClose={handleDownloadClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"다운로드를 준비중입니다."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{textAlign:'center'}}>
                         <CircularProgress />
                     </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDownloadClose} color="secondary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={alertOpen}
                onClose={handleAlertOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{alertMessage}</DialogTitle>
               
                <DialogActions>
                    <Button onClick={handleAlertClose} color="secondary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default Info