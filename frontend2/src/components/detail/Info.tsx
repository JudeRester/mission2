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
} from "@material-ui/core"
import { StarBorder, ExpandLess, ExpandMore,Comment } from "@material-ui/icons"
// import { InboxIcon } from '@material-ui/icons/MoveToInbox';
import React, { useEffect, useState } from "react"
import Carousel from "react-material-ui-carousel"
import axios from "axios";
import moment from 'moment';

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
	categoryName:string,
	categoryParent:number,
	categoryOrder:number
}

const Info = (props: MatchParams) => {
    const sessionUser = sessionStorage.getItem("sessionUser");
    if (sessionUser) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(sessionUser).token;
    }

    const assetSeq: string = props.assetSeq;
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const [assetInfo, setAssetInfo] = useState<Asset>();
    const [parentCategory,setParentCategory] =useState<string>();
    const [checked, setChecked] = useState<Array<string>>([]);
    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const items = {
        assetSeq: 6,
        title: "My sixth post",
        excerpt: "This is my sixth post with more content inside",
        image: ["https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
    }
    useEffect(() => {
        axios.get(`/api/asset/${assetSeq}`
        ).then(result => {
            setAssetInfo(result.data.result);
            console.log(assetInfo)
            axios.get(`/api/category/list`)
            .then(response=>{
                setParentCategory(findParent(result.data.result.assetCategory,response.data.result))
            })
        })
    }, [assetSeq])

    const findParent = (target:number, categories:Category[]) =>{
        let pStr="";
        categories.forEach(element => {
            if(element.categoryId == target){
                if(element.categoryParent != 0){
                    pStr = findParent(element.categoryParent,categories) + '>' + element.categoryName
                    return
                }else{
                    pStr = element.categoryName
                    return
                }
            }
        });
        return pStr;
    }
    
    const handleToggle = (value:string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setChecked(newChecked);
    };

    return (
        <div style={{ marginTop: 20, padding: 30 }}>
            {assetInfo&&
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
                                                <img style={{ maxWidth: '1000px' }} src={item.assetLocation.substring(item.assetLocation.lastIndexOf("/uploadedImages"))} alt="" />
                                                : item.assetType.includes("video") ?
                                                    <video style={{ maxWidth: '1000px' }} controls src={item.assetLocation.substring(item.assetLocation.lastIndexOf("/uploadedImages"))} />
                                                    :
                                                    item.assetType.includes("audio") ?
                                                        <audio src={item.assetLocation.substring(item.assetLocation.lastIndexOf("/uploadedImages"))} />
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
                            <TableCell align="right" style={{color:"grey"}}>등록일:{moment(assetInfo.assetCreateDate).format('YYYY-MM-DD HH:mm:ss')}
                            {assetInfo.assetCreateDate!==assetInfo.assetUpdateDate ? <><br/>수정일:{moment(assetInfo.assetCreateDate).format('YYYY-MM-DD HH:mm:ss')}</> : null}</TableCell>
                            
                        </TableRow>
                        <TableRow>
                            <TableCell>작성자:{assetInfo.assetOwnerName}{assetInfo.assetChanger&& <>최종수정자:{assetInfo.assetChangerName}</>}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                카테고리:{parentCategory}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                태그:{assetInfo.tags}
                            </TableCell>
                        </TableRow>
                    </Table>
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
                            {assetInfo.assetFiles.map((file,i)=>{
                                const labelId = `checkbox-list-label-${i}`;
                                     return (
                                        <ListItem key={i} role={undefined} dense button onClick={handleToggle(file.assetLocation)}>
                                          <ListItemIcon>
                                            <Checkbox
                                              edge="start"
                                              checked={checked.indexOf(file.assetLocation) !== -1}
                                              tabIndex={-1}
                                              disableRipple
                                              inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                          </ListItemIcon>
                                          <ListItemText id={labelId} primary={`${file.assetOriginName}`} />
                                          <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="comments">
                                              <Comment />
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
        </div>
    )
}
export default Info