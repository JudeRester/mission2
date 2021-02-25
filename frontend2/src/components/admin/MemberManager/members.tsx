import {
    TableContainer, TableHead, Table, TableRow, TableBody, Card, CardHeader, Button, Paper, makeStyles, CardContent, createStyles, withStyles, Theme, TableCell, CardActions, Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    CircularProgress,
    IconButton,
    InputBase,
    Divider,
    FormControl,
    Select,
    MenuItem,
} from "@material-ui/core";
import { amber, red } from "@material-ui/core/colors";
import { Clear, Search } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../../modules";
import api from "../../../util/api";

type MatchParams = {
    pageNum: string
}

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

const mailVali = RegExp(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i);
const phoneVali = RegExp(/^[0-9]{10,11}$/);
const idVali = RegExp(/^[a-zA-Z][a-zA-Z0-9_\.\-]{3,}$/);


interface InputData<T> {
    data: T;
    error: boolean;
}

type MemberInfo = {
    userId: string,
    userPass: string,
    userName: string,
    userEmail: string,
    userPhone: string,
}

type Page = {
    startPage: number,
    endPage: number,
    prev: false,
    next: false,
    total: number
}

interface DeleteTarget {
    userId: string,
    count: number
}
// const Members = (props: MatchParams) => {
const Members = () => {
    const [memberList, setMemberList] = useState<Array<MemberInfo>>();
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageInfo, setPageInfo] = useState<Page>();
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [modOpen, setModOpen] = useState<boolean>(false);
    const [addUserId, setAddUserId] = useState<InputData<string>>({ data: '', error: true })
    const [addUserPassword, setAddUserPassword] = useState<InputData<string>>({ data: '', error: true })
    const [addUserPasswordCheck, setAddUserPasswordCheck] = useState<InputData<string>>({ data: '', error: true })
    const [addUsername, setAddUsername] = useState<InputData<string>>({ data: '', error: true })
    const [addUserPhone, setAddUserPhone] = useState<InputData<string>>({ data: '', error: true })
    const [addUserEmail, setAddUserEmail] = useState<InputData<string>>({ data: '', error: true })
    const [idInvalidMessage, setIdInvalidMessage] = useState<string>('')
    const [passwordInvalidMessage, setPasswordInvalidMessage] = useState<string>('')
    const [passwordCheckInvalidMessage, setPasswordCheckInvalidMessage] = useState<string>('')
    const [usernameInvalidMessage, setUsernameInvalidMessage] = useState<string>('')
    const [userPhoneInvalidMessage, setUserPhoneInvalidMessage] = useState<string>('')
    const [uesrEmailInvalidMessage, setUserEmailInvalidMessage] = useState<string>('')
    const [totalValid, setTotalValid] = useState<boolean>(true)
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>()
    const [searchCondition, setSearchCondition] = useState<string>('userId')
    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('');
    const user = useSelector((state:RootState)=>state.member)
    api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;

    const handleAddOpen = () => {
        setAddOpen(true)
    }

    const handleAddClose = () => {
        setDataReset()
        setAddOpen(false)
    }

    const handleAddConfirm = () => {
        if (validCheck()) {
            const data: MemberInfo = {
                userId: addUserId.data,
                userPass: addUserPassword.data,
                userName: addUsername.data,
                userEmail: addUserEmail.data,
                userPhone: addUserPhone.data,
            }
            api.post(`/member/user`, data)
                .then(response => {
                    const data = response.data
                    if (data.code === 200) {
                        handleAddClose()
                        loadMembers()
                    }
                })
        } else {
            setTotalValid(false)
        }
    }

    const validCheck = () => {
        const data = [
            addUserId, addUserPassword, addUserPasswordCheck, addUsername, addUserPhone, addUserEmail
        ]
        let isCompletelyValid = true
        if (addUserId.data && addUserPassword.data && addUserPasswordCheck.data && addUsername.data && addUserPhone.data && addUserEmail.data) {
            for (let i = 0; i < data.length; i++) {
                if (!data[i].error) {
                    isCompletelyValid = false
                    break;
                }
            }
        } else { isCompletelyValid = false }
        return isCompletelyValid
    }

    const setDataReset = () => {
        const dataSet = [setAddUserId, setAddUserPassword, setAddUserPasswordCheck, setAddUsername, setAddUserPhone, setAddUserEmail]
        dataSet.forEach(element => {
            element({ data: '', error: true })
        });
        const messageSet = [
            setIdInvalidMessage, setPasswordInvalidMessage, setPasswordCheckInvalidMessage, setUsernameInvalidMessage, setUserPhoneInvalidMessage, setUserEmailInvalidMessage
        ]
        messageSet.forEach(element => {
            element('')
        })
        setTotalValid(true)
    }

    const handleAddInputId = (value: string) => {
        idDupCheck(value)
    }
    function idDupCheck(value: string) {
        if (idVali.test(value)) {
            api.get(`/member/user?userId=${value}`)
                .then(response => {
                    if (response.data.result) {
                        setAddUserId({ data: value, error: false })
                        setIdInvalidMessage('사용할 수 없는 아이디입니다');
                    } else {
                        setAddUserId({ data: value, error: true })
                        setIdInvalidMessage('');
                    }
                })
        } else {
            setIdInvalidMessage('아이디는 4글자 이상 영어 대소문자 및 숫자 조합');
            setAddUserId({ data: value, error: false })
        }
    }

    const handledAddPassword = (value: string) => {
        if (value) {
            setAddUserPassword({ data: value, error: true })
            setPasswordInvalidMessage('')
        } else {
            setAddUserPassword({ data: value, error: false })
            setPasswordInvalidMessage('비밀번호는 공백일 수 없습니다')
        }

    }

    const handleAddPasswordCheck = (value: string) => {
        if (value === addUserPassword.data) {
            setAddUserPasswordCheck({ data: value, error: true })
            setPasswordCheckInvalidMessage('')
        }
        else {
            setAddUserPasswordCheck({ data: value, error: false })
            setPasswordCheckInvalidMessage('비밀번호가 일치하지 않습니다')
        }
    }

    const handledAddUsername = (value: string) => {
        if (value) {
            setAddUsername({ data: value, error: true })
            setUsernameInvalidMessage('')
        } else {
            setAddUsername({ data: value, error: false })
            setUsernameInvalidMessage('이름을 입력해주세요')
        }
    }
    const handledAddUserPhone = (value: string) => {
        if (!value) {
            setAddUserPhone({ data: value, error: false })
            setUserPhoneInvalidMessage('전화번호를 입력해주세요')
        }
        else if (phoneVali.test(value)) {
            setAddUserPhone({ data: value, error: true })
            setUserPhoneInvalidMessage('')
        } else {
            setAddUserPhone({ data: value, error: false })
            setUserPhoneInvalidMessage('올바른 전화번호를 적어주세요 ex)01012345678')
        }
    }
    const handledAddUserEmail = (value: string) => {
        if (!value) {
            setAddUserEmail({ data: value, error: false })
            setUserEmailInvalidMessage('이메일을 입력해주세요.')
        }
        else if (mailVali.test(value)) {
            setAddUserEmail({ data: value, error: true })
            setUserEmailInvalidMessage('')
        } else {
            setAddUserEmail({ data: value, error: false })
            setUserEmailInvalidMessage('올바른 형식을 사용해주세요')
        }
    }

    const handleModifyClick = (user: MemberInfo) => {
        setAddUserId({ data: user.userId, error: true })
        setAddUsername({ data: user.userName, error: true })
        setAddUserPhone({ data: user.userPhone, error: true })
        setAddUserEmail({ data: user.userEmail, error: true })
        setModOpen(true)
    }

    const handleModClose = () => {
        setDataReset()
        setModOpen(false)
    }

    const handledModPassword = (value: string) => {
        if (value) {
            setAddUserPassword({ data: value, error: true })
        }
    }
    const modValidCheck = () => {
        const data = [
            addUserId, addUserPassword, addUserPasswordCheck, addUsername, addUserPhone, addUserEmail
        ]
        let isCompletelyValid = true
        if (addUserId.data && addUsername.data && addUserPhone.data && addUserEmail.data) {
            for (let i = 0; i < data.length; i++) {
                if (!data[i].error) {
                    isCompletelyValid = false
                    break;
                }
            }
        } else { isCompletelyValid = false }
        return isCompletelyValid
    }
    const handleModConfirm = () => {
        if (modValidCheck()) {
            const data: MemberInfo = {
                userId: addUserId.data,
                userPass: addUserPassword.data,
                userName: addUsername.data,
                userEmail: addUserEmail.data,
                userPhone: addUserPhone.data,
            }
            api.put(`/member/user`, data)
                .then(response => {
                    const data = response.data
                    if (data.code === 200) {
                        handleModClose()
                        loadMembers()
                    }
                })
        } else {
            setTotalValid(false)
        }
    }
    const handleDelete = (userId: string) => {
        setDeleteOpen(true)
        api.get(`/member/user/assetcount/${userId}`)
            .then(response => {
                setDeleteTarget({ userId: userId, count: response.data.result })
            })
    }

    const handleDeleteClose = () => {
        setDeleteTarget(null)
        setDeleteOpen(false)
    }
    const handleDeleteConfirm = () => {
        api.delete(`/member/user/${deleteTarget.userId}`)
            .then(response => {
                setDeleteTarget(null)
                setDeleteOpen(false)
                loadMembers()
            })
    }

    const handleSearchCondition = (condition: string) => {
        setSearchCondition(condition)
    }

    const searchInputKeyPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setIsSearch(pre=>{let temp = true;return temp});
            setPageNum(pre=>{let temp =1; return temp})
            loadMembers();
        }
    }
    const handlerSearchButtonClick = () => {
        setIsSearch(pre=>{let temp = true;return temp});
        setPageNum(pre=>{let temp = 1; return temp})
        loadMembers();
    }
    
    const setData = () => {
        let data: string = ''
        data += `condition=${searchCondition}&`
        data += `keyword=${keyword}&`
        data += `pageNum=${pageNum}`
        return data
    }
    const handleSearchReset = () => {
        setKeyword('')
        setPageNum(1)
        setIsSearch(pre=>{return false})
        loadMembers();
    }
    async function loadMembers() {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
        let response
        switch (isSearch) {
            case true:
                response = await api.get(`/member/search?${setData()}`)
                break;
            default:
                response = await api.get(`/member/list/${pageNum}`)
                break;
        }
        const list: Array<MemberInfo> = response.data.result
        setPageInfo(response.data.reference)
        setMemberList(list)
    };
    useEffect(()=>{
        setPageNum(pre=>{let temp =1; return temp})
        loadMembers();
    },[isSearch])
    useEffect(() => {
        loadMembers();
    }, [pageNum]);

    const ModifyButton = withStyles((theme: Theme) => ({
        root: {
            color: theme.palette.getContrastText(amber[500]),
            backgroundColor: amber[500],
            '&:hover': {
                backgroundColor: amber[700],
            },
        },
    }))(Button);
    const DeleteButton = withStyles((theme: Theme) => ({
        root: {
            color: theme.palette.getContrastText(red[900]),
            backgroundColor: red[900],
            '&:hover': {
                backgroundColor: red[700],
            },
            marginLeft: 5
        },
    }))(Button);
    const useStyles = makeStyles(() => ({
        addButton: {
            margin: "auto",
        },
        ul: {
            justifyContent: 'center',
            padding: 10,
        },
        dialogPaper: {
            width: "400px",
        },
        dialogTextField: {
            width: "100%",
            height: "90px"
        },
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
        },
        input: {
            flex: 1,
            width: 250
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
        formControl: {
            margin: 1,
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: 2,
        },
    }))

    const classes = useStyles();

    return (
        <>
            <Paper>
                <Card>
                    <CardHeader classes={{ action: classes.addButton }}
                        avatar={
                            <div>
                                <h2>회원 관리</h2>
                            </div>
                        }

                        action={
                            <Button variant="contained" color="primary" onClick={handleAddOpen}>
                                회원 추가
                    </Button>
                        }
                    />
                    <CardContent>
                        <Paper component="form" elevation={2} style={{ margin: 3 }} className={classes.root}>
                            <IconButton className={classes.iconButton} aria-label="menu">
                                <FormControl className={classes.formControl}>
                                    <Select
                                        value={searchCondition}
                                        onChange={e => { handleSearchCondition(e.target.value as string) }}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem value="userId">아이디</MenuItem>
                                        <MenuItem value="userName">이름</MenuItem>
                                        <MenuItem value="userEmail">이메일</MenuItem>
                                    </Select>
                                </FormControl>
                            </IconButton>
                            <Divider className={classes.divider} orientation="vertical" />
                            <InputBase
                                className={classes.input}
                                placeholder="검색"
                                onKeyPress={(e) => { searchInputKeyPress(e) }}
                                onChange={(e) => { setKeyword(e.target.value) }}
                                value={keyword}
                            />
                            {isSearch &&
                                <IconButton onClick={handleSearchReset} aria-label="search">
                                    <Clear />
                                </IconButton>}
                            <IconButton onClick={handlerSearchButtonClick} className={classes.iconButton} aria-label="search">
                                <Search />
                            </IconButton>

                        </Paper>
                        <TableContainer component={Paper}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>아이디</StyledTableCell>
                                        <StyledTableCell align="right">이름</StyledTableCell>
                                        <StyledTableCell align="right">이메일</StyledTableCell>
                                        <StyledTableCell align="right">전화번호</StyledTableCell>
                                        <StyledTableCell align="right">&nbsp;</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {memberList && memberList.map((user) => (
                                        <StyledTableRow key={user.userId}>
                                            <StyledTableCell component="th" scope="row">
                                                {user.userId}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">{user.userName}</StyledTableCell>
                                            <StyledTableCell align="right">{user.userEmail}</StyledTableCell>
                                            <StyledTableCell align="right">{user.userPhone}</StyledTableCell>
                                            <StyledTableCell align="right">
                                                <ModifyButton onClick={e => { handleModifyClick(user) }} >수정</ModifyButton>
                                                <DeleteButton onClick={e => { handleDelete(user.userId) }}>삭제</DeleteButton>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <CardActions style={{ justifyContent: "center" }}>
                            {pageInfo && <Pagination classes={{ ul: classes.ul }}
                                hideNextButton={!pageInfo.next}
                                hidePrevButton={!pageInfo.prev}
                                count={pageInfo.endPage}
                                page={pageNum}
                                onChange={(e: React.ChangeEvent<unknown>, value: number) => { setPageNum(value) }}
                                shape="rounded" />}
                        </CardActions>
                    </CardContent>
                </Card>
            </Paper>

            <Dialog
                classes={{ paper: classes.dialogPaper }}
                open={addOpen}
                onClose={handleAddClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"회원등록"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <TextField
                            required
                            autoFocus
                            classes={{ root: classes.dialogTextField }}
                            error={!addUserId.error}
                            autoComplete='off'
                            id="outlined-required"
                            label="아이디"
                            value={addUserId.data}
                            onChange={e => handleAddInputId(e.target.value)}
                            onBlur={e => handleAddInputId(e.target.value)}
                            helperText={idInvalidMessage}
                            variant="outlined"
                        />
                        <TextField
                            required
                            classes={{ root: classes.dialogTextField }}
                            error={!addUserPassword.error}
                            autoComplete='off'
                            type="password"
                            id="outlined-required"
                            label="비밀번호"
                            value={addUserPassword.data}
                            onChange={e => handledAddPassword(e.target.value)}
                            onBlur={e => handledAddPassword(e.target.value)}
                            helperText={passwordInvalidMessage}
                            variant="outlined"
                        />
                        <TextField
                            required
                            classes={{ root: classes.dialogTextField }}
                            error={!addUserPasswordCheck.error}
                            autoComplete='off'
                            type="password"
                            id="outlined-required"
                            label="비밀번호 확인"
                            value={addUserPasswordCheck.data}
                            onChange={e => handleAddPasswordCheck(e.target.value)}
                            onBlur={e => handleAddPasswordCheck(e.target.value)}
                            helperText={passwordCheckInvalidMessage}
                            variant="outlined"
                        />
                        <TextField
                            required
                            classes={{ root: classes.dialogTextField }}
                            error={!addUsername.error}
                            autoComplete='off'
                            id="outlined-required"
                            label="이름"
                            value={addUsername.data}
                            onChange={e => handledAddUsername(e.target.value)}
                            onBlur={e => handledAddUsername(e.target.value)}
                            helperText={usernameInvalidMessage}
                            variant="outlined"
                        />
                        <TextField
                            required
                            classes={{ root: classes.dialogTextField }}
                            error={!addUserPhone.error}
                            autoComplete='off'
                            id="outlined-required"
                            label="전화번호"
                            value={addUserPhone.data}
                            onChange={e => handledAddUserPhone(e.target.value)}
                            onBlur={e => handledAddUserPhone(e.target.value)}
                            helperText={userPhoneInvalidMessage}
                            variant="outlined"
                        />
                        <TextField
                            required
                            classes={{ root: classes.dialogTextField }}
                            error={!addUserEmail.error}
                            autoComplete='off'
                            id="outlined-required"
                            label="이메일"
                            value={addUserEmail.data}
                            onChange={e => handledAddUserEmail(e.target.value)}
                            onBlur={e => handledAddUserEmail(e.target.value)}
                            helperText={uesrEmailInvalidMessage}
                            variant="outlined"
                        />
                        {
                            <p style={{ color: 'red', justifyContent: 'center' }}>{totalValid ? '' : '작성내용을 확인해주세요'}</p>
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleAddConfirm} color="primary">
                        확인
                    </Button>
                    <Button variant="contained" onClick={handleAddClose} color="secondary">
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                classes={{ paper: classes.dialogPaper }}
                open={modOpen}
                onClose={handleModClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"회원수정"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <TextField
                            disabled
                            classes={{ root: classes.dialogTextField }}
                            error={!addUserId.error}
                            autoComplete='off'
                            id="outlined-required"
                            label="아이디"
                            value={addUserId.data}
                            variant="outlined"
                        />
                        <TextField
                            required
                            classes={{ root: classes.dialogTextField }}
                            error={!addUserPassword.error}
                            autoComplete='off'
                            type="password"
                            id="outlined-required"
                            label="비밀번호"
                            value={addUserPassword.data}
                            onChange={e => handledModPassword(e.target.value)}
                            onBlur={e => handledAddPassword(e.target.value)}
                            helperText={passwordInvalidMessage}
                            variant="outlined"
                        />
                        <TextField
                            required
                            classes={{ root: classes.dialogTextField }}
                            error={!addUserPasswordCheck.error}
                            autoComplete='off'
                            type="password"
                            id="outlined-required"
                            label="비밀번호 확인"
                            value={addUserPasswordCheck.data}
                            onChange={e => handleAddPasswordCheck(e.target.value)}
                            onBlur={e => handleAddPasswordCheck(e.target.value)}
                            helperText={passwordCheckInvalidMessage}
                            variant="outlined"
                        />
                        <TextField
                            required
                            classes={{ root: classes.dialogTextField }}
                            error={!addUsername.error}
                            autoComplete='off'
                            id="outlined-required"
                            label="이름"
                            value={addUsername.data}
                            onChange={e => handledAddUsername(e.target.value)}
                            onBlur={e => handledAddUsername(e.target.value)}
                            helperText={usernameInvalidMessage}
                            variant="outlined"
                        />
                        <TextField
                            required
                            classes={{ root: classes.dialogTextField }}
                            error={!addUserPhone.error}
                            autoComplete='off'
                            id="outlined-required"
                            label="전화번호"
                            value={addUserPhone.data}
                            onChange={e => handledAddUserPhone(e.target.value)}
                            onBlur={e => handledAddUserPhone(e.target.value)}
                            helperText={userPhoneInvalidMessage}
                            variant="outlined"
                        />
                        <TextField
                            required
                            classes={{ root: classes.dialogTextField }}
                            error={!addUserEmail.error}
                            autoComplete='off'
                            id="outlined-required"
                            label="이메일"
                            value={addUserEmail.data}
                            onChange={e => handledAddUserEmail(e.target.value)}
                            onBlur={e => handledAddUserEmail(e.target.value)}
                            helperText={uesrEmailInvalidMessage}
                            variant="outlined"
                        />
                    </DialogContentText>
                    {

                    }
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleModConfirm} color="primary">
                        확인
                    </Button>
                    <Button variant="contained" onClick={handleModClose} color="secondary">
                        취소
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteOpen}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"회원 삭제"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {deleteTarget ?
                            deleteTarget.count ?
                                `해당 회원은 ${deleteTarget.count}개의 게시물이 있어 삭제할수없습니다.` :
                                `${deleteTarget.userId} 회원을 삭제하시겠습니까?`
                            :
                            <CircularProgress />
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {deleteTarget ? !deleteTarget.count && <DeleteButton onClick={handleDeleteConfirm}>
                        삭제
                    </DeleteButton> : null}
                    <Button onClick={handleDeleteClose} color="primary" autoFocus>
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    )
}
export default Members