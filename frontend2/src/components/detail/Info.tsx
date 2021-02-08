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
} from "@material-ui/core"
import { StarBorder, ExpandLess, ExpandMore } from "@material-ui/icons"
// import { InboxIcon } from '@material-ui/icons/MoveToInbox';
import React, { useState } from "react"
import Carousel from "react-material-ui-carousel"
import axios from "axios";


const useStyles = makeStyles(() =>
  ({
    primary: {
      fontSize:'20px',
      textAlign:'center'
    },
    nested: {
      paddingLeft: 4,
    },
  }),
);

type MatchParams = {
    assetSeq:string
}

const Info = (props:MatchParams) => {
    const sessionUser = sessionStorage.getItem("sessionUser");
    if (sessionUser) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(sessionUser).token;
    }

    const assetSeq:string = props.assetSeq;
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => {
        setIsOpen(!isOpen);
      };
    
    const items = {
        assetSeq: 6,
        title: "My sixth post",
        excerpt: "This is my sixth post with more content inside",
        image: ["https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
    }
    axios.get(`/api/asset/${assetSeq}`
    ).then(result=>{
        console.log('result',result.data.result)
    })
    return (
        <div style={{ marginTop: 20, padding: 30 }}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Carousel
                        autoPlay={false}
                        animation={"slide"}
                        indicators={true}
                        navButtonsAlwaysVisible={true}
                    >
                        {items.image.map((item, i) => (
                            <Grid item>
                                <CardContent>
                                    <CardMedia>
                                        <img src={item} alt="" />
                                    </CardMedia>
                                </CardContent>
                            </Grid>
                        ))}
                    </Carousel>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs={3}>
                    <h1>메타데이터 위치</h1>
                    <p>{items.title}</p>
                    <p>{items.excerpt}</p>
                    <p>{items.title}</p>
                    <p>{items.title}</p>
                    <button>수정</button>
                    <button>삭제</button>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <ListItem button onClick={handleClick}>
                        <ListItemText primary="파일 리스트" classes={{primary:classes.primary}}/>
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem>
                                <ListItemText primary="Starred" className={classes.nested}/>
                            </ListItem>
                        </List>
                    </Collapse>
                </Grid>
            </Grid>
        </div>
    )
}
export default Info