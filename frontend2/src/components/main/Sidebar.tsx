import React from "react";
import {
    FormControl,
    InputLabel,
    Input,
    Button,
    TextField,
    ListItemText,
    Drawer,
    makeStyles,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    Divider,
    Typography,
    AppBar,
    CssBaseline
} from "@material-ui/core";
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
// import {InboxIcon, MailIcon} from "@material-ui/icons"

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

const Sidebar = (props: any) => {

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline />

            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <form>
                        <h1>검색</h1>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="name">제목</InputLabel>
                            <Input id="name" type="text" />
                        </FormControl>
                        <Button variant="contained" color="primary" size="medium">
                            검색
                        </Button>
                    </form>
                    {/* <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List> */}
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                <Toolbar />
                {props.children}
            </main>
        </div>
    );
}

export default Sidebar;