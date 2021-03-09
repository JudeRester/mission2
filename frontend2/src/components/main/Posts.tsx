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
  CircularProgress,

} from '@material-ui/core'

import { Pagination, PaginationItem, PaginationItemTypeMap } from '@material-ui/lab';
import axios from 'axios';
import moment from 'moment';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { RootState } from '../../modules';
import api, { BASE_API_URL } from '../../util/api';


const useStyles = makeStyles(() => ({
  gridList: {
    width: 400,
    height: 400,
  },
  imageCountLessEqualTwo: {
    textAlign:"center",
    height: '100%!important'
  },
  imageCountOverTwo: {
    textAlign:"center",
    height: '50%!important'
  },
  ul: {
    justifyContent: 'center',
    padding: 10,

  }
}))

type Asset = {
  assetSeq: number,
  assetOwner: string,
  assetOwnerName: string,
  assetTitle: string,
  assetCreateDate: Date,
  assetUpdateDate: Date,
  locations: string,
  assetFiles: Array<AssetFile>,
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

type AssetFile = {
  assetLocation: string,
  assetOriginName: string,
  assetSeq: number,
  assetSize: number,
  assetType: string,
}

type MatchParams = {
  pageNum: string
}



const Posts = (props: MatchParams) => {

  const [contents, setContents] = useState<Array<Asset>>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageInfo, setPageInfo] = useState<Page>();
  const history = useHistory();
  const user = useSelector((state:RootState)=>state.member)
  api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
  const toAssetDetail = (assetSeq: number) => {
    history.push('/detail/' + assetSeq)
  }


  const classes = useStyles();
  async function loadContents() {
    const response = await api.get(`/list/${pageNum}`)
    const list: Array<Asset> = response.data.result
    setPageInfo(response.data.reference)
    setContents(list)
  };
  useEffect(() => {
    loadContents();
  }, [pageNum]);

  return (
    <div style={{
      // marginTop: 20, 
      padding: 30
    }}>
      <Grid container spacing={3} justify="center">
        {contents ? contents.map(post => (
          <Grid item key={post.assetSeq}>
            <Card>
              <GridList className={classes.gridList}>
                {
                  post.assetFiles.map((assetFile, i) => {
                    let type = assetFile.assetType
                    let location = assetFile.assetLocation
                    let imgUrl=BASE_API_URL.substring(0,BASE_API_URL.lastIndexOf('/api'));
                    if (!type) {
                      imgUrl += '/images/unsupportedFile.png'
                    } else if (type.includes('image')) {
                      imgUrl += `/uploadedImages/thumb${location.substring(location.lastIndexOf("/uploadedImages") + 15)}`
                    } else if (type.includes('video')) {
                      imgUrl += '/images/videoFile.png'
                    } else if (type.includes('audio')) {
                      imgUrl += '/images/audioFile.png'
                    } else {
                      imgUrl += '/images/unsupportedFile.png'
                    }
                    return (
                      (post.locationArray.length < 3) ?
                        <GridListTile key={i} cols={(post.locationArray.length % 2 != 0 && i == 0) ? 2 : 1} classes={{ root: classes.imageCountLessEqualTwo }}>
                          <img src={imgUrl} alt="" />

                        </GridListTile>
                        :
                        i <= 3 ?
                          <GridListTile key={i} cols={(post.locationArray.length % 2 != 0 && i == 0 && post.locationArray.length <= 3) ? 2 : 1} classes={{ root: classes.imageCountOverTwo }}>
                            <img src={imgUrl} alt="" />
                            {(post.locationArray.length > 4 && i == 3) ?
                              <Link to={"/detail/" + assetFile.assetSeq} >
                                <GridListTileBar title={post.locationArray.length - (i + 1) + '개 더보기'} classes={{ root: classes.imageCountLessEqualTwo }} />
                              </Link>

                              : null}
                          </GridListTile> :
                          null
                    )
                  })
                }
              </GridList>

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {post.assetTitle}
                </Typography>

                <Typography align='right' component="p" style={{ color: 'grey' }}>{moment(post.assetCreateDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                <Typography align='left' component="p">카테고리 : {post.assetCategoryName}</Typography>
                <Typography align='left' component="p">작성자 : {post.assetOwnerName}</Typography>
                <Typography align='left' component="p">태그 : {post.tags}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => { toAssetDetail(post.assetSeq) }}>
                  상세보기
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
          : (<CircularProgress />)}
      </Grid>
      <Grid>
        {pageInfo && <Pagination classes={{ ul: classes.ul }}
          hideNextButton={!pageInfo.next}
          hidePrevButton={!pageInfo.prev}
          count={pageInfo.endPage}
          page={pageNum}
          onChange={(e: React.ChangeEvent<unknown>, value: number) => { setPageNum(value) }}
          shape="rounded" />}
      </Grid>
    </div>
  )
}

export default Posts;