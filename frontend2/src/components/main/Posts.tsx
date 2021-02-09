import {
  Grid,
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
  GridList,
  GridListTile,
  makeStyles,
  GridListTileBar
} from '@material-ui/core'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

const useStyles = makeStyles(() => ({
  gridList: {
    width: 500,
    height: 500,
  },
  imageCountLessEqualTwo: {
    height: '100%!important'
  },
  imageCountOverTwo:{
    height: '50%!important'
  }
}))

type Asset = {
  assetSeq:number,
  assetOwn:string,
  assetOwnName:string,
  assetTitle:string,
  assetCreateDate:Date,
  assetUpdateDate:Date,
  locations:string,
  tags:string,
  locationArray:Array<string>
}



const Posts = () => {
  const sessionUser = sessionStorage.getItem("sessionUser");
    if (sessionUser) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(sessionUser).token;
    }
  // const contents = [

  //   {
  //     assetSeq : 1,
  //     title: "My first post",
  //     excerpt: "This is my first post with more content inside",
  //     image: ["https://bit.ly/2WNi2Ml"]
  //   },

  //   {
  //     assetSeq : 2,
  //     title: "My second post",
  //     excerpt: "This is my second post with more content inside",
  //     image: ["https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
  //   },

  //   {
  //     assetSeq : 3,
  //     title: "My third post",
  //     excerpt: "This is my third post with more content inside",
  //     image: ["https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
  //   },

  //   {
  //     assetSeq : 4,
  //     title: "My fourth post",
  //     excerpt: "This is my fourth post with more content inside",
  //     image: ["https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
  //   },

  //   {
  //     assetSeq : 5,
  //     title: "My fifth post",
  //     excerpt: "This is my fifth post with more content inside",
  //     image: ["https://bit.ly/2WNi2Ml","https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
  //   },

  //   {
  //     assetSeq : 6,
  //     title: "My sixth post",
  //     excerpt: "This is my sixth post with more content inside",
  //     image: ["https://bit.ly/2WNi2Ml","https://bit.ly/2WNi2Ml","https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
  //   }
  // ]

  const [contents, setContents] = useState<Array<Asset>>([]);
  const [pageNum, setPageNum] = useState(1);
  const history = useHistory();
  const toAssetDetail=(assetSeq:number)=>{
    history.push('detail/'+assetSeq)
  }
  const classes = useStyles();
  async function loadContents(){
    const response = await axios.get(`/api/list/${pageNum}`)
    const list:Array<Asset> = response.data.result
    setContents(list)
  };
  useEffect(()=>{
    loadContents();
    console.log(contents);
  },[]);
  
  return (
    <div style={{ marginTop: 20, padding: 30 }}>
      <Grid container spacing={3} justify="center">
        {contents&& contents.map(post => (
          <Grid item key={post.assetSeq}>
            <Card>
                <GridList className={classes.gridList}>
                  {
                    post.locationArray.map((imgUrl, i) => (
                      (post.locationArray.length < 3) ?
                        <GridListTile key={i} cols={(post.locationArray.length % 2 != 0 && i == 0) ? 2 : 1} classes={{ root: classes.imageCountLessEqualTwo }}>
                          <img src={'/uploadedImages/thumb'+ imgUrl.substring(imgUrl.lastIndexOf("/uploadedImages") + 15)} alt="" />

                        </GridListTile>
                        : 
                        i<=3?
                        <GridListTile key={i} cols={(post.locationArray.length % 2 != 0 && i == 0 && post.locationArray.length<=3) ? 2 : 1} classes={{root:classes.imageCountOverTwo}}>
                          <img src={'/uploadedImages/thumb'+ imgUrl.substring(imgUrl.lastIndexOf("/uploadedImages") + 15)} alt="" />
                          {(post.locationArray.length>4 && i==3)?
                          <GridListTileBar title={post.locationArray.length-(i+1)+'개 더보기'} classes={{root:classes.imageCountLessEqualTwo}}/>
                          : null}
                        </GridListTile>:
                        null
                    ))
                  }
                </GridList>

                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {post.assetTitle}
                  </Typography>
                  <Typography component="p">{post.tags}</Typography>
                </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={()=>{toAssetDetail(post.assetSeq)}}>
                  상세보기
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )) 
        }
      </Grid>
    </div>
  )
}

export default Posts;