import {
    createStyles,
    Paper,
    TableCell,
    TableContainer,
    TableRow,
    Theme,
    withStyles,
    Table,
    TableHead,
    TableBody,
    Button,
    TableSortLabel,
    makeStyles,

} from "@material-ui/core";
import { amber, red } from "@material-ui/core/colors";
import React, { useState } from "react";
import { MemberInfo, Order } from "../../../util/types";

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRight: "solid 0.5px lightgrey",
            overflow: "scroll",
        },
        head: {
            backgroundColor: theme.palette.action.hover,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {

            '&:nth-of-type(even)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }),
);

type props = {
    memberList: MemberInfo[],
    handleModifyClick: (user: MemberInfo) => void,
    handleDelete: (userId: string) => void,
    handleRequestSort: (property: string) => void,
    orderBy: string,
    order: Order,
}

interface HeadCell {
    id: string;
    label: string;
    numeric: boolean;
}
type Align = "right" | "left" | "center"
const headCells: HeadCell[] = [
    { id: 'userCreateDate', numeric: false, label: '등록일자' },
    { id: 'userId', numeric: true, label: '아이디' },
    { id: 'userName', numeric: true, label: '이름' },
    { id: 'userEmail', numeric: true, label: '이메일' },
    { id: 'userPhone', numeric: true, label: '전화번호' },
    { id: 'buttons', numeric: true, label: '' },
];

const MembersTable = (props: props) => {
    const { memberList, handleModifyClick, handleDelete, handleRequestSort, orderBy, order } = props;

    const classes = useStyles();

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell, index) => {
                                let alignStr: Align = "center";
                                // if(index===0)alignStr="center"
                                return (
                                    <StyledTableCell align={alignStr}>
                                        {headCell.label ?
                                            <TableSortLabel
                                                active={orderBy === headCell.id}
                                                direction={orderBy === headCell.id ? order : 'asc'}
                                                onClick={() => { handleRequestSort(headCell.id) }}
                                            >
                                                {headCell.label}
                                                {orderBy === headCell.id ? (
                                                    <span className={classes.visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel> :
                                            null
                                        }

                                    </StyledTableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {memberList && memberList.map((user) => (
                            <StyledTableRow key={user.userId}>
                                <StyledTableCell align="center" component="th" scope="row">{user.userCreateDate}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {user.userId}
                                </StyledTableCell>
                                <StyledTableCell align="center">{user.userName}</StyledTableCell>
                                <StyledTableCell align="center">{user.userEmail}</StyledTableCell>
                                <StyledTableCell align="center">{user.userPhone}</StyledTableCell>
                                <StyledTableCell align="center" style={{ width: "200px" }}>
                                    <ModifyButton onClick={e => { handleModifyClick(user) }} >수정</ModifyButton>
                                    <DeleteButton onClick={e => { handleDelete(user.userId) }}>삭제</DeleteButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default MembersTable;