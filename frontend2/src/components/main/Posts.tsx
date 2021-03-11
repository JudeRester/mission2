import DateFnsUtils from '@date-io/date-fns';
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
  Paper,
  Tab,
  Tabs,
  createStyles,
  Theme,
  InputBase,
  IconButton,
  fade,
  withStyles,

} from '@material-ui/core'
import { Clear, Folder, FolderOpen, Remove, Search } from '@material-ui/icons';

import { Pagination, ToggleButton, ToggleButtonGroup, TreeItem, TreeView } from '@material-ui/lab';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import arrayToTree from 'array-to-tree';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { RootState } from '../../modules';
import api, { BASE_API_URL } from '../../util/api';
import { CategoryInfo, Tags, TreeViews } from '../../util/types';


const useStyles = makeStyles(() => ({
  root: {
    padding: '2px 4px',
    alignItems: 'center',
    // display:'flex',
    width: "100%",
  },
  gridList: {
    width: 400,
    height: 400,
  },
  imageCountLessEqualTwo: {
    textAlign: "center",
    height: '100%!important'
  },
  imageCountOverTwo: {
    textAlign: "center",
    height: '50%!important'
  },
  ul: {
    justifyContent: 'center',
    padding: 10,

  }
}))
const useStylesForSearch = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "12px",
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      // width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    elevation4: {
      boxShadow: "inset 0px 2px 4px -1px rgb(0 0 0 / 20%), inset 0px 4px 5px 0px rgb(0 0 0 / 14%), inset 0px 1px 10px 0px rgb(0 0 0 / 12%) !important"
    }
  }),
);

const useTreeStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    // maxWidth: 400,
    display: 'contents',
    ".dragOver": {
      backgroundColor: "red",
    }
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

const useToggleStyles = makeStyles({
  root: {
    border: "solid skyblue !important",
    color: "black",
    padding: 5,

  }
})

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

const StyledToggleButtonGroup = withStyles((theme) => ({
  root: {
    width: "100%",
    display: 'block',
    margin: 12,
  },
  grouped: {
    margin: theme.spacing(0.5),
    border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

const Posts = (props: MatchParams) => {

  const [contents, setContents] = useState<Array<Asset>>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageInfo, setPageInfo] = useState<Page>();
  const [panel, setPanel] = useState<number>(0);

  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [categories, setCategories] = useState([]);
  const [treeCategories, setTreeCategories] = useState([]);
  const [expendedCategory, setExpendedCategory] = useState<Array<string>>();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [tags, setTags] = useState<Array<Tags>>();
  const [checkedTags, setCheckedTags] = useState<Array<string>>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const history = useHistory();
  const user = useSelector((state: RootState) => state.member)
  api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;

  const classes = useStyles();
  const treeClasses = useTreeStyles();
  const toggleButtonClasses = useToggleStyles();




  const toAssetDetail = (assetSeq: number) => {
    history.push('/detail/' + assetSeq)
  }

  async function loadContents() {
    const response = await api.get(`/list/${pageNum}`)
    const list: Array<Asset> = response.data.result
    setPageInfo(response.data.reference)
    setContents(list)
  };
  useEffect(() => {
    isSearch ? search() :
      loadContents();
  }, [pageNum, isSearch]);

  useEffect(() => {

    api.get(`/category/list`)
      .then(response => {
        setCategories(
          // arrayToTree(
          response.data.result
          // , { parentProperty: 'categoryParent', customID: 'categoryId' }))
        )
      })
    api.get(`/tag/list`)
      .then(response => {
        setTags(response.data.result)
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
    };
    getParents(treeCategories);
    setExpendedCategory([...tempArray, "0"])
  }, [treeCategories])

  useEffect(() => {
    setTreeCategories(arrayToTree(categories, { parentProperty: 'categoryParent', customID: 'categoryId' }))
  }, [categories])

  useEffect(() => {
    if (startDate > endDate && endDate && startDate) {
      let temp = endDate
      setEndDate(startDate)
      setStartDate(temp)
    }
  }, [startDate, endDate])

  const handlePanels = (event: React.ChangeEvent<{}>, newValue: number) => {
    setPanel(newValue);
  };

  const searchClasses = useStylesForSearch();

  const handlerSearchButtonClick = () => {
    setIsSearch(pre => {
      return true
    });
    setPageNum(pre => { return 1 })
    search()
  }

  const handleSearchReset = () => {
    setIsSearch(false)
    setSelectedCategory('')
    setCheckedTags([])
    setPageNum(1)
  }

  const searchInputKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsSearch(pre => { return true });
      setPageNum(pre => { return 1 })
      search()
    }
  }
  const search = async () => {
    let searchBoolean = isSearch;
    await setIsSearch(pre => {
      searchBoolean = pre;
      return pre;
    })
    if (searchBoolean) {
      let categoryList: Array<string> = [];
      // api.get(`/category/list`)
      //   .then(response => {
      //     if (selectedCategory&&selectedCategory!=='0')
      //       categoryList = (findChild(Number(selectedCategory), response.data.result).split('>'));
      //     api.get(`/search?${setData()}`)
      //       .then(response => {
      //         setContents(response.data.result)
      //         setPageInfo(response.data.reference)
      //       })
      //   })
      const setData = () => {
        let data: string = ''
        categoryList && categoryList.forEach((element: any) => {
          data += `category=${element}&`
        })
        checkedTags && checkedTags.forEach((element: any) => {
          data += `tag=${element}&`
        })
        keyword && (data += `keyword=${keyword}&`);
        startDate && (data += `startDate=${moment(startDate).format('YYYY-MM-DD')}&`);
        endDate && (data += `endDate=${moment(endDate).add(1, 'day').format('YYYY-MM-DD')}&`)
        data += `pageNum=${pageNum}&`
        return data
      }
      if (selectedCategory && selectedCategory !== '0')
        categoryList = (findChild(Number(selectedCategory), categories).split('>'));
      api.get(`/search?${setData()}`)
        .then(response => {
          setContents(response.data.result)
          setPageInfo(response.data.reference)
        })
    }
  }


  const handleToggle = (event: any, nodeIds: string[]) => {
    event.preventDefault()
  };
  const handleNodeSelect = (event: any, nodeId: React.SetStateAction<string>) => {
    if (nodeId === selectedCategory) {
      setSelectedCategory('')
    } else
      setSelectedCategory(nodeId)
  };

  const handleCheckTag = (value: string) => () => {
    const currentIndex = checkedTags.indexOf(value);
    const newChecked = [...checkedTags];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedTags(newChecked);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const renderTrees = (nodes: TreeViews) => (
    <TreeItem
      key={nodes.categoryId}
      endIcon={<Remove />}
      nodeId={nodes.categoryId + ''}
      label={nodes.categoryName}
      classes={{ label: treeClasses.label, group: treeClasses.group, iconContainer: treeClasses.iconContainer }}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTrees(node)) : null}
    </TreeItem>
  );
  interface CategoryProps {
    category: TreeViews
  }
  const Category = ({ category }: CategoryProps) => {
    useEffect(() => {

    }, [category]);
    return renderTrees(category);
  }
  const findChild = (target: number, categories: CategoryInfo[]) => {
    let pStr = "" + target;
    categories.forEach(element => {
      if (element.categoryParent === target) {
        pStr += '>' + findChild(element.categoryId, categories)
      }
    });
    return pStr;
  }
  return (
    <div style={{
      // marginTop: 20, 
      // maxWidth: "1024px",
      padding: 30,
      margin: "auto",
    }}>
      <Paper style={{ margin: "5px", padding: "10px", backgroundColor: "#e3e3e3" }}>
        <Tabs value={panel} onChange={handlePanels} >
          <Tab label="일반 검색" />
          <Tab label="상세 검색" />
        </Tabs>{
          panel ?
            <div role="tabpanel">
              <Paper component="form" elevation={4} classes={{ elevation4: searchClasses.elevation4, root: searchClasses.root }}>
                <IconButton onClick={handlerSearchButtonClick} className={searchClasses.iconButton} aria-label="search">
                  <Search />
                </IconButton>
                <InputBase
                  className={searchClasses.input}
                  placeholder="검색어 입력"
                  onKeyPress={(e) => { searchInputKeyPress(e) }}
                  onChange={(e) => { setKeyword(e.target.value) }}
                />
                {isSearch &&
                  <IconButton onClick={handleSearchReset} aria-label="search">
                    <Clear />
                  </IconButton>}
              </Paper>
              <Typography>카테고리</Typography>
              <Paper elevation={4} classes={{ elevation4: searchClasses.elevation4, root: searchClasses.root }}>
                {treeCategories && expendedCategory ? (
                  <TreeView
                    style={{ maxHeight: 400, overflow: "scroll" }}
                    onNodeToggle={handleToggle}
                    onNodeSelect={handleNodeSelect}
                    className={classes.root}
                    defaultCollapseIcon={<FolderOpen />}
                    defaultExpandIcon={<Folder />}
                    expanded={expendedCategory}
                    defaultSelected="0"
                  >
                    <TreeItem
                      key="0"
                      nodeId="0"
                      label="전체 보기"
                      classes={{ label: treeClasses.label, group: treeClasses.group, iconContainer: treeClasses.iconContainer }}
                      endIcon={<Remove />}>
                      {treeCategories.map((category: TreeViews) => {
                        return <Category
                          key={category.categoryName}
                          category={category} />
                      })}
                    </TreeItem>
                  </TreeView>
                ) :
                  (<CircularProgress />)
                }
              </Paper>
              <Typography>태그</Typography>
                <StyledToggleButtonGroup
                  value={checkedTags}
                >
                  {tags && tags.map((tag: Tags) => {
                    if (checkedTags.filter(assetTag => assetTag === tag.assetTag).length <= 0) {
                      return (
                        <ToggleButton
                          onClick={handleCheckTag(tag.assetTag)}
                          value={tag.assetTag}
                          aria-label={tag.assetTag}
                          classes={{ root: toggleButtonClasses.root }}
                        >
                          {`${tag.assetTag}(${tag.count})`}
                        </ToggleButton>)
                    }
                    else {
                      return (
                        <ToggleButton
                          onClick={handleCheckTag(tag.assetTag)}
                          aria-label={tag.assetTag}
                          value={tag.assetTag}
                          classes={{ root: toggleButtonClasses.root }}
                          style={{ backgroundColor: "skyBlue" }}
                        >
                          {`${tag.assetTag}(${tag.count})`}
                        </ToggleButton>)
                    }
                  })}
                </StyledToggleButtonGroup>
              <Typography>등록일</Typography>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="시작일"
                    maxDate={new Date()}
                    maxDateMessage="날짜는 오늘 이전으로 선택해주세요"
                    invalidDateMessage="올바른 날짜를 입력해주세요"
                    format="yyyy/MM/dd"
                    value={startDate}
                    InputAdornmentProps={{ position: "end" }}
                    onChange={date => handleStartDateChange(date)}
                  />

                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="종료일"
                    maxDate={new Date()}
                    maxDateMessage="날짜는 오늘 이전으로 선택해주세요"
                    invalidDateMessage="올바른 날짜를 입력해주세요"
                    format="yyyy/MM/dd"
                    value={endDate}
                    InputAdornmentProps={{ position: "end" }}
                    onChange={date => handleEndDateChange(date)}
                  />
                </MuiPickersUtilsProvider>
            </div> :
            <div role="tabpanel">
              <Paper component="form" elevation={4} classes={{ elevation4: searchClasses.elevation4, root: searchClasses.root }}>
                <IconButton onClick={handlerSearchButtonClick} className={searchClasses.iconButton} aria-label="search">
                  <Search />
                </IconButton>
                <InputBase
                  className={searchClasses.input}
                  placeholder="검색어 입력"
                  onKeyPress={(e) => { searchInputKeyPress(e) }}
                  onChange={(e) => { setKeyword(e.target.value) }}
                />
                {isSearch &&
                  <IconButton onClick={handleSearchReset} aria-label="search">
                    <Clear />
                  </IconButton>}
              </Paper>
            </div>
        }
      </Paper>
      <Paper style={{ margin: "5px", padding: "10px", backgroundColor: "#e3e3e3" }}>
        <Grid container spacing={3} justify="center">
          {contents ? contents.map(post => (
            <Grid item key={post.assetSeq}>
              <Card>
                <GridList className={classes.gridList}>
                  {
                    post.assetFiles.map((assetFile, i) => {
                      let type = assetFile.assetType
                      let location = assetFile.assetLocation
                      let imgUrl = BASE_API_URL.substring(0, BASE_API_URL.lastIndexOf('/api'));
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
                          <GridListTile key={i} cols={(post.locationArray.length % 2 !== 0 && i === 0) ? 2 : 1} classes={{ root: classes.imageCountLessEqualTwo }}>
                            <img src={imgUrl} alt="" />

                          </GridListTile>
                          :
                          i <= 3 ?
                            <GridListTile key={i} cols={(post.locationArray.length % 2 !== 0 && i === 0 && post.locationArray.length <= 3) ? 2 : 1} classes={{ root: classes.imageCountOverTwo }}>
                              <img src={imgUrl} alt="" />
                              {(post.locationArray.length > 4 && i === 3) ?
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
      </Paper>
    </div>
  )
}

export default Posts;