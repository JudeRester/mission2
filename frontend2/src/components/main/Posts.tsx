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
  GridListTileBar,
  Paper,

} from '@material-ui/core'

import { Pagination } from '@material-ui/lab';
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
  imageCountOverTwo: {
    height: '50%!important'
  }
}))

type Asset = {
  assetSeq: number,
  assetOwner: string,
  assetOwnName: string,
  assetTitle: string,
  assetCreateDate: Date,
  assetUpdateDate: Date,
  locations: string,
  tags: string,
  locationArray: Array<string>,
  assetCategory: number,
  assetCategoryName: string
}

type Page = {
  startPage: number,
  endPage: number,
  prev: false,
  next: false,
  total: number
}


const Posts = () => {
  let sessionUser = sessionStorage.getItem("sessionUser");
  if (sessionUser) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(sessionUser).token;
  }

  const [contents, setContents] = useState<Array<Asset>>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageInfo, setPageInfo] = useState<Page>();
  const history = useHistory();
  const toAssetDetail = (assetSeq: number) => {
    history.push('detail/' + assetSeq)
  }
  const classes = useStyles();
  async function loadContents() {
    sessionUser = sessionStorage.getItem("sessionUser");
    if (sessionUser) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(sessionUser).token;
    }
    const response = await axios.get(`/api/list/${pageNum}`)
    const list: Array<Asset> = response.data.result
    setPageInfo(response.data.reference)
    setContents(list)
    console.log(contents, pageInfo);
  };
  useEffect(() => {
    loadContents();
  }, [pageNum]);

  return (
    <div style={{ 
      // marginTop: 20, 
      padding: 30 }}>
        <Grid container spacing={3} justify="center">
          {contents && contents.map(post => (
            <Grid item key={post.assetSeq}>
              <Card>
                <GridList className={classes.gridList}>
                  {
                    post.locationArray.map((imgUrl, i) => (
                      (post.locationArray.length < 3) ?
                        <GridListTile key={i} cols={(post.locationArray.length % 2 != 0 && i == 0) ? 2 : 1} classes={{ root: classes.imageCountLessEqualTwo }}>
                          <img src={'/uploadedImages/thumb' + imgUrl.substring(imgUrl.lastIndexOf("/uploadedImages") + 15)} alt="" />

                        </GridListTile>
                        :
                        i <= 3 ?
                          <GridListTile key={i} cols={(post.locationArray.length % 2 != 0 && i == 0 && post.locationArray.length <= 3) ? 2 : 1} classes={{ root: classes.imageCountOverTwo }}>
                            <img src={'/uploadedImages/thumb' + imgUrl.substring(imgUrl.lastIndexOf("/uploadedImages") + 15)} alt="" />
                            {(post.locationArray.length > 4 && i == 3) ?
                              <GridListTileBar title={post.locationArray.length - (i + 1) + '개 더보기'} classes={{ root: classes.imageCountLessEqualTwo }} />
                              : null}
                          </GridListTile> :
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
                  <Button size="small" color="primary" onClick={() => { toAssetDetail(post.assetSeq) }}>
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