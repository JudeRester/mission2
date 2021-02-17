import {
    CardContent,
    CardMedia,
    Divider,
    Grid,
    Paper,
    Collapse,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    makeStyles,
    GridList,
    GridListTile,
    GridListTileBar,
    Table,
    TableRow,
    TableCell,
    Checkbox,
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
import { StarBorder, ExpandLess, ExpandMore, Comment, GetApp } from "@material-ui/icons"
// import { InboxIcon } from '@material-ui/icons/MoveToInbox';
import React, { useEffect, useState } from "react"
import Carousel from "react-material-ui-carousel"
import axios from "axios";
import moment from 'moment';
import { useHistory } from "react-router";
import { saveAs } from 'file-saver';
import JSZip from "jszip";
import { promises } from "fs";
import fileDownload from "js-file-download";

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

const Info = (props: MatchParams) => {
    const sessionUser = sessionStorage.getItem("sessionUser");
    if (sessionUser) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(sessionUser).token;
    }
    const history = useHistory();
    const assetSeq: string = props.assetSeq;
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(true);
    const [assetInfo, setAssetInfo] = useState<Asset>();
    const [parentCategory, setParentCategory] = useState<string>();
    const [checked, setChecked] = useState<Array<string>>([]);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [downloadOpen, setDownloadOpen] = useState<boolean>(false)
    const handleClick = () => {
        setIsOpen(!isOpen);
    };



    useEffect(() => {
        axios.get(`/api/asset/${assetSeq}`
        ).then(result => {
            setAssetInfo(result.data.result);
            axios.get(`/api/category/list`)
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

    const goModify = () => {
        history.push(`/modify/${assetSeq}`)
    }

    const handleDeleteOpen = () => {
        setDeleteOpen(true)
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false)
    }

    const handleDeleteConfirm = () => {
        axios.delete(`/api/asset/${assetSeq}`,
            {
                params: {
                    assetOwner: assetInfo.assetOwner
                }
            }
        )
            .then(response => {
                history.push("/");
            })
    }

    const handleSingleDownload = (fileLocation: string, fileOriginName: string) => () => {
        axios.get(`/api/download`, {
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
                await axios.get(`${fileInfo[0]}`,
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
                                    <CardContent>
                                        <CardMedia>
                                            {!item.assetType ?
                                                <div>
                                                    <img src={"/images/unsupportedFile.png"} alt="" />
                                                    <GridListTileBar title={"미리보기가 지원되지 않는 형식"} />
                                                </div>
                                                :
                                                item.assetType.includes("image") ?
                                                    <img style={{ maxWidth: '600px',maxHeight:'600px' }} src={item.assetLocation.substring(item.assetLocation.lastIndexOf("/uploadedImages"))} alt="" />
                                                    : item.assetType.includes("video") ?
                                                        <video style={{ maxWidth: '600px',maxHeight:'600px' }} controls src={item.assetLocation.substring(item.assetLocation.lastIndexOf("/uploadedImages"))} />
                                                        :
                                                        item.assetType.includes("audio") ?
                                                            <audio controls src={item.assetLocation.substring(item.assetLocation.lastIndexOf("/uploadedImages"))} />
                                                            : <div>
                                                                <img src={"/images/unsupportedFile.png"} alt="" />
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
                        <Button onClick={goModify} color="primary">수정</Button>
                        <Button onClick={handleDeleteOpen} color="secondary">삭제</Button>
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
        </div>
    )
}
export default Info