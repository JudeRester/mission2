import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, InputBase, ListItemSecondaryAction, Menu, MenuItem, Paper } from '@material-ui/core';
import SearchWindow from './SearchWindow';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../modules/member';
import { RootState } from '../../modules';
import axios from 'axios';
import arrayToTree from 'array-to-tree';
import { TreeItem, TreeView } from '@material-ui/lab';
import { Clear, Search } from '@material-ui/icons';

const drawerWidth = 450;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },

    linkButton: {
      color: 'white',
    },
  }),
);

const useStylesForSearch = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
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
  }),
);

function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

export default function SideHeader(props: any) {

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

  let token = sessionStorage.getItem("sessionUser");
  const user = useSelector((state: RootState) => state.member)
  if (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }
  const useTreeStyles = makeStyles({
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
  const treeClasses = useTreeStyles();
  const classes = useStyles();
  const searchClasses = useStylesForSearch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  let [categoriesHavingChild, setCategoriesHavingChild] = useState<Array<string>>();
  let [categories, setCategories] = useState([]);
  let [selectedCategory, setSelectedCategory] = useState<string>();
  let [tags, setTags] = useState<Array<Tags>>();
  const [checkedTags, setCheckedTags] = React.useState([]);
  const [keyword, setKeyword] = useState<string>('');
  const [crt, setCrt] = useState({ pageNum: 1, amount: 10 })
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [contents, setContents] = useState<Array<Asset>>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageInfo, setPageInfo] = useState<Page>();
  const [searchWindowOpen, setSearchWindowOpen] = useState<boolean>(false)
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const adminMenuOpen = Boolean(adminMenuAnchorEl);

  const handleAdminMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAdminMenuAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchorEl(null);
  };

  const handleCheck = (value: string) => () => {
    const currentIndex = checkedTags.indexOf(value);
    const newChecked = [...checkedTags];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedTags(newChecked);
  };

  useEffect(() => {
    search()
  }, [pageNum])

  useEffect(() => {
    token = sessionStorage.getItem("sessionUser");
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
    axios.get(`/api/category/list`)
      .then(response => {
        setCategories(arrayToTree(response.data.result, { parentProperty: 'categoryParent', customID: 'categoryId' }))
      })
    axios.get(`/api/tag/list`)
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
      setCategoriesHavingChild(tempArray)
    };
    getParents(categories);
  }, [categories])

  useEffect(() => {
    window.onpopstate = (event: any) => {
      if (isSearch) {
        setSearchWindowOpen(true)
      }
    }
  })

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const searchInputKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsSearch(true);
      setPageNum(pre => { return 1 })
      search()
    }
  }
  const handlerSearchButtonClick = () => {
    setIsSearch(true);
    setPageNum(pre => { return 1 })
    search()
  }
  const search = () => {
    if (isSearch) {
      let categoryList: Array<string> = [];
      axios.get(`/api/category/list`)
        .then(response => {
          if (selectedCategory)
            categoryList = (findChild(parseStringToNumber(selectedCategory), response.data.result).split('>'));
          axios.get(`/api/search?${setData()}`)
            .then(response => {
              setContents(response.data.result)
              setSearchWindowOpen(true)
              setPageInfo(response.data.reference)
            })
        })
      const setData = () => {
        let data: string = ''
        if (categoryList) {
          categoryList.forEach((element: any) => {
            data += `category=${element}&`
          })
        }
        if (checkedTags) {
          checkedTags.forEach((element: any) => {
            data += `tag=${element}&`
          })
        }
        if (keyword)
          data += `keyword=${keyword}&`
        data += `pageNum=${pageNum}`
        return data
      }
    }
  }
  const parseStringToNumber = (target: string) => {
    let parser: number = +target
    return parser
  }
  const findChild = (target: number, categories: Category[]) => {
    let pStr = "" + target;
    categories.forEach(element => {
      if (element.categoryParent == target) {
        pStr += '>' + findChild(element.categoryId, categories)
      }
    });
    // pStr+=target;
    return pStr;
  }
  type Category = {
    categoryId: number,
    categoryName: string,
    categoryParent: number,
    categoryOrder: number
  }
  type Tags = {
    assetSeq: number,
    assetTag: string,
    count: number
  }

  interface TreeViews {
    children?: TreeViews[];
    categoryName: string;
    categoryId: string;
  }
  interface CategoryProps {
    category: TreeViews
  }

  const renderTrees = (nodes: TreeViews) => (
    <TreeItem key={nodes.categoryId} nodeId={nodes.categoryId + ''} label={nodes.categoryName} classes={{ label: treeClasses.label }}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTrees(node)) : null}
    </TreeItem>
  );

  const Category = ({ category }: CategoryProps) => {
    useEffect(() => {

    }, [category]);
    return renderTrees(category);
  }
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleToggle = (event: any, nodeIds: string[]) => {
    event.preventDefault()
  };
  const handleNodeSelect = (event: any, nodeId: React.SetStateAction<string>) => {
    if (nodeId == selectedCategory) {
      setSelectedCategory('')
    } else
      setSelectedCategory(nodeId)
  };

  const handleSearchReset = () => {
    setIsSearch(false)
    setSearchWindowOpen(false)
    setContents([])
    handleNodeSelect(null, selectedCategory)
    setSelectedCategory('')
    setCheckedTags([])
  }

  const dispatch = useDispatch()
  const logoutHandler = () => {
    handleSearchReset()
    dispatch(logout());
    sessionStorage.setItem("sessionUser", '');
    sessionStorage.setItem("userInfo", '');
    console.log('logout');
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <Search />
          </IconButton>
          <Typography variant="h6" noWrap>
            Malgn
          </Typography>
          <Typography style={{ marginLeft: "auto" }}>
            <Link to="/"><Button onClick={handleSearchReset} classes={{ text: classes.linkButton }}>Home</Button></Link>
            <Link to="/upload"><Button onClick={handleSearchReset} classes={{ text: classes.linkButton }}>파일 업로드</Button></Link>
            {token ? parseJwt(token).userRole === "ROLE_ADMIN" && <>
              <Button aria-controls="fade-menu" aria-haspopup="true" classes={{ text: classes.linkButton }} onClick={handleAdminMenuClick}>
                관리자 메뉴
              </Button>
              <Menu
                id="fade-menu"
                anchorEl={adminMenuAnchorEl}
                keepMounted
                open={adminMenuOpen}
                onClose={handleAdminMenuClose}
                TransitionComponent={Fade}
              >
                <MenuItem onClick={handleAdminMenuClose}><Link to="/admin/member" onClick={handleSearchReset}>회원 관리</Link></MenuItem>
                <MenuItem onClick={handleAdminMenuClose}><Link to="/" onClick={handleSearchReset}>카테고리 관리</Link></MenuItem>
              </Menu></> : null}
              <Link to="/"><Button onClick={logoutHandler} classes={{ text: classes.linkButton }}>로그아웃</Button></Link>
          </Typography>

        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography align='left' variant='h5'>검색</Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem key={0}>
            <Paper component="form" className={searchClasses.root}>
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
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key={1}>
            {categories.length > 0 ? (
              <TreeView
                onNodeToggle={handleToggle}
                onNodeSelect={handleNodeSelect}
                className={classes.root}
                // defaultCollapseIcon={<ExpandMore />}
                // defaultExpandIcon={<ChevronRight />}
                expanded={categoriesHavingChild}
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
          </ListItem>
        </List>
        <Divider />
        <List style={{ overflow: 'auto' }}>
          {tags && tags.length > 0 ?
            tags.map((item, i) => {
              return (
                <ListItem key={i} role={undefined} dense button onClick={handleCheck(item.assetTag)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedTags.indexOf(item.assetTag) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText id={item.assetTag} primary={`${item.assetTag}(${item.count})`} />
                </ListItem>
              )
            }) : (<CircularProgress />)}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {!searchWindowOpen ? props.children : (
          <SearchWindow contents={contents} setSearchWindowOpen={setSearchWindowOpen} setPageNum={setPageNum} pageNum={pageNum} pageInfo={pageInfo} />
        )}
      </main>
    </div>
  );
}
