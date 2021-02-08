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




const Posts = () => {
  const contents = [

    {
      assetSeq : 1,
      title: "My first post",
      excerpt: "This is my first post with more content inside",
      image: ["https://bit.ly/2WNi2Ml"]
    },

    {
      assetSeq : 2,
      title: "My second post",
      excerpt: "This is my second post with more content inside",
      image: ["https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
    },

    {
      assetSeq : 3,
      title: "My third post",
      excerpt: "This is my third post with more content inside",
      image: ["https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
    },

    {
      assetSeq : 4,
      title: "My fourth post",
      excerpt: "This is my fourth post with more content inside",
      image: ["https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
    },

    {
      assetSeq : 5,
      title: "My fifth post",
      excerpt: "This is my fifth post with more content inside",
      image: ["https://bit.ly/2WNi2Ml","https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
    },

    {
      assetSeq : 6,
      title: "My sixth post",
      excerpt: "This is my sixth post with more content inside",
      image: ["https://bit.ly/2WNi2Ml","https://bit.ly/2WNi2Ml","https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml", "https://bit.ly/2WNi2Ml"]
    }
  ]

  const history = useHistory();
  const toAssetDetail=(assetSeq:number)=>{
    history.push('detail/'+assetSeq)
  }
  const classes = useStyles();
  return (
    <div style={{ marginTop: 20, padding: 30 }}>
      <Grid container spacing={3} justify="center">
        {contents.map(post => (
          <Grid item key={post.title}>
            <Card>
                <GridList className={classes.gridList}>
                  {
                    post.image.map((imgUrl, i) => (
                      (post.image.length < 3) ?
                        <GridListTile key={i} cols={(post.image.length % 2 != 0 && i == 0) ? 2 : 1} classes={{ root: classes.imageCountLessEqualTwo }}>
                          <img src={imgUrl} alt="" />

                        </GridListTile>
                        : 
                        i<=3?
                        <GridListTile key={i} cols={(post.image.length % 2 != 0 && i == 0 && post.image.length<=3) ? 2 : 1} classes={{root:classes.imageCountOverTwo}}>
                          <img src={imgUrl} alt="" />
                          {(post.image.length>4 && i==3)?
                          <GridListTileBar title={post.image.length-(i+1)+'개 더보기'} classes={{root:classes.imageCountLessEqualTwo}}/>
                          : null}
                        </GridListTile>:
                        null
                    ))
                  }
                </GridList>

                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {post.title}
                  </Typography>
                  <Typography component="p">{post.excerpt}</Typography>
                </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={()=>{toAssetDetail(post.assetSeq)}}>
                  Share
                </Button>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Posts;