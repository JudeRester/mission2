import React, {  } from 'react';
import clsx from 'clsx';
import { makeStyles,  Theme, createStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {
  Button,
  Fade,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../modules/member';
import { RootState } from '../../modules';
import api from '../../util/api';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
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
    },
    linkButton: {
      color: 'white',
    },
  }),
);


export default function SideHeader(props: any) {

  const user = useSelector((state: RootState) => state.member)
  api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
  const classes = useStyles();
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const adminMenuOpen = Boolean(adminMenuAnchorEl);

  const handleAdminMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAdminMenuAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchorEl(null);
  };


  const dispatch = useDispatch()
  const logoutHandler = () => {
    dispatch(logout());
    sessionStorage.setItem("current_user_token", '');
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6" noWrap>
            <Link to="/" style={{ color: "white" }}>Malgn</Link>
          </Typography>
          <Typography style={{ marginLeft: "auto" }}>
            <Link to="/"><Button classes={{ text: classes.linkButton }}>Home</Button></Link>
            <Link to="/upload"><Button classes={{ text: classes.linkButton }}>파일 업로드</Button></Link>
            {user ? user.userRole === "ROLE_ADMIN" && <>
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
                <MenuItem onClick={handleAdminMenuClose}><Link to="/admin/member">회원 관리</Link></MenuItem>
                <MenuItem onClick={handleAdminMenuClose}><Link to="/admin/category">카테고리 관리</Link></MenuItem>
              </Menu></> : null}
            <Link to="/"><Button onClick={logoutHandler} classes={{ text: classes.linkButton }}>로그아웃</Button></Link>
          </Typography>

        </Toolbar>
      </AppBar>
      <main
        className={clsx(classes.content)}
      >
      <div className={classes.drawerHeader} />
          {props.children} 
      </main>
    </div>
  );
}
