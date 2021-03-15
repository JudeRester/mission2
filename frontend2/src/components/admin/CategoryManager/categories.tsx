import api from "../../../util/api";

import {
    Card,
    CardHeader,
    Paper,
    makeStyles,
    CardContent,
    Grid,
    ListItem,
    List,
    CircularProgress,
    fade,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    Button,
    withStyles,
    Theme,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@material-ui/core";
import {
    amber,
    red
} from "@material-ui/core/colors";

import arrayToTree from "array-to-tree";
import React, 
{ 
    useEffect, 
    useState, 
} from "react";
import { TreeItem, TreeView } from "@material-ui/lab";
import { 
    Folder, 
    FolderOpen, 
    Remove, 
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../modules";
import CategoryNode from "./CategoryNode";
import {
    setArrayCategories,
    modifyCategory,
    addCategory,
} from "../../../modules/arrayCategories";

const ModifyButton = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.getContrastText(amber[500]),
        backgroundColor: amber[500],
        '&:hover': {
            backgroundColor: amber[700],
        },
        '&:disabled': {
            backgroundColor: "#757575"
        }

    },
}))(Button);
const DeleteButton = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.getContrastText(red[900]),
        backgroundColor: red[900],
        '&:hover': {
            backgroundColor: red[700],
        },
        '&:disabled': {
            backgroundColor: "#757575"
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
        alignItems: 'center',
        // display:'flex',
        width: "100%",
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
    elevation4: {
        boxShadow: "inset 0px 2px 4px -1px rgb(0 0 0 / 20%), inset 0px 4px 5px 0px rgb(0 0 0 / 14%), inset 0px 1px 10px 0px rgb(0 0 0 / 12%) !important"
    },
    paperRoot: {
        padding: 10,
        width: '100%',
        minHeight: '500px',
        overflow: "scroll"
    },
    paperInfo: {
        margin: 10,
        padding: 10,
        width: '100%',
        minHeight: '230px',
        overflow: "scroll"
    },
    tooltip: {
        fontSize: 15,
        textAlign: "center"
    }
}))

interface TreeViews {
    children?: TreeViews[];
    categoryName: string;
    categoryId: string;
}


interface CategoryInfo {
    categoryId: number,
    categoryName: string,
    categoryOrder: number,
    categoryParent: number,
    possessions?: number,
    newNode?: boolean,
    modifying?: boolean,
}
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



const Categories = () => {

    /**
     * ? store
     */
    const arrayCategories = useSelector((state: RootState) => state.arrayCategories)
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.member)
    const draggedNode = useSelector((state: RootState) => state.dragNode)

    api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;

    /**
     * ? state
     */

    const [treeCategories, setTreeCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [expendedCategory, setExpendedCategory] = useState<Array<string>>();
    const [selectedCategoryInfo, setSelectedCategoryInfo] = useState<CategoryInfo>();
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false)

    /**
     * ? style
     */

    const treeClasses = useTreeStyles();
    const classes = useStyles();

    /**
     * ? functions
     */

    const loadCategories = async () => {
        const response = await api.get('/category/list')
        const array = response.data.result
        dispatch(setArrayCategories(array))
    }

    useEffect(() => {
        loadCategories()
    }, [])


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
        setTreeCategories(arrayToTree(arrayCategories, { parentProperty: 'categoryParent', customID: 'categoryId' }))
        // handleTreeLabelClick("0")
    }, [arrayCategories])
    const handleToggle = (event: any, nodeIds: string[]) => {
        event.preventDefault()
    };
    const handleNodeSelect = (event: any, nodeId: React.SetStateAction<string>) => {
        event.stopPropagation();
        setSelectedCategory(nodeId)
    };

    const hasChild = () => {
        let tempArray: Array<string> = [];
        async function getParents(array: Array<TreeViews>) {
            await array.map((node: TreeViews) => {
                if (node.children) {
                    tempArray.push(node.categoryId + '');
                    getParents(node.children);
                }
            });
        }
        getParents(treeCategories);
        return tempArray.findIndex((e: string) => e === `${selectedCategoryInfo.categoryId}`)
    }

    const handleAddCategory = async () => {
        const order = await getLastOrder(selectedCategory)
        const newNode: CategoryInfo = {
            categoryId: new Date().getTime(),
            categoryName: '',
            categoryOrder: order,
            categoryParent: Number(selectedCategory),
            possessions: 0,
            newNode: true,
        }
        dispatch(addCategory(newNode))
    }

    const handleModifyCategory = () => {
        const targetIndex = arrayCategories.findIndex((e: CategoryInfo) => e.categoryId + '' === selectedCategory);
        dispatch(modifyCategory(targetIndex))
    }

    function getLastOrder(nodeId: string) {
        let count = 0
        for (let i = 0; i < arrayCategories.length; i++) {
            if (arrayCategories[i].categoryParent + '' === nodeId)
                count++
        }
        return count
    }
    const handleTreeLabelClick = async (nodeId: string) => {
        const response = await api.get(`/category/${nodeId}`)
        setSelectedCategoryInfo(response.data.result)
    }

    const handleTreeIconClick = (nodeId: string) => {
        const targetIndex = expendedCategory.findIndex((e: string) => e === nodeId);
        targetIndex === -1 ?
            setExpendedCategory(pre => {
                let temp: string[] = [...pre];
                temp = [...temp, nodeId]
                return temp
            })
            : setExpendedCategory(pre => {
                let temp: string[] = [...pre];
                temp.splice(targetIndex, 1)
                return temp;
            })
    }

    const deleteButtonClick = () => {
        setDeleteOpen(true)
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false)
    }
    const handleDeleteConfirm = () => {
        api.delete(`/category/${selectedCategoryInfo.categoryId}`)
            .then(response => {
                setSelectedCategory(null)
                setDeleteOpen(false)
                loadCategories()
                handleTreeLabelClick("0")
            })
    }


    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const onDrop = async (e: React.DragEvent, categoryId: string) => {
        e.stopPropagation()
        if (draggedNode.includes(String(categoryId))) {
            //드랍 불가능 액션
        } else {
            const node = arrayCategories[arrayCategories.findIndex((element) => element.categoryId === Number(draggedNode[0]))]
            node.categoryParent = Number(categoryId)
            await api.put(`category/order`, node)
            loadCategories()
        }
    }

    const setTestCategory = (target: Array<string>) => {
        setExpendedCategory(target);
    }

    return (
        <>
            <Paper style={{ maxWidth: 1024, margin: "auto" }}>
                <Card>
                    <CardHeader
                        title="카테고리 관리"
                    />
                    <CardContent>

                        <Grid item>

                            <Table>
                                <TableHead>
                                    <TableRow style={{ height: "50px" }}>
                                        {selectedCategoryInfo ?
                                            <>
                                                <TableCell>
                                                    카테고리 내 게시글 수 : {selectedCategoryInfo.possessions}
                                                </TableCell>
                                                <TableCell align="right" style={{ padding: 0 }}>
                                                    <Button variant="contained" color="primary" style={{ marginRight: 5 }} onClick={handleAddCategory}>추가</Button>
                                                    {selectedCategoryInfo.categoryId ?
                                                        <>
                                                            <ModifyButton onClick={handleModifyCategory}>수정</ModifyButton>
                                                            {selectedCategoryInfo.possessions || hasChild() !== -1 ?
                                                                <Tooltip classes={{ tooltip: classes.tooltip }} title="하위 카테고리나 게시물이 있는 카테고리는 삭제할 수 없습니다" arrow >
                                                                    <span>
                                                                        <DeleteButton disabled={true}>삭제</DeleteButton>
                                                                    </span>
                                                                </Tooltip>
                                                                :
                                                                <DeleteButton onClick={deleteButtonClick} disabled={false}>삭제</DeleteButton>
                                                            }
                                                        </>
                                                        :
                                                        null
                                                    }
                                                </TableCell>
                                            </>
                                            :
                                            <TableCell colSpan={2} align="center"
                                            //  style={{ textAlign: "center" }}
                                            >
                                                <Typography variant={"h6"}>카테고리를 선택해 주세요</Typography>
                                            </TableCell>
                                        }
                                    </TableRow>
                                </TableHead>
                            </Table>
                            <List>
                                <ListItem key={1}>
                                    <Paper elevation={4} classes={{ elevation4: classes.elevation4, root: classes.paperRoot }}>
                                        {treeCategories && expendedCategory ? (
                                            <TreeView
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
                                                    onDragOver={onDragOver}
                                                    onDrop={(e) => { onDrop(e, "0") }}
                                                    onIconClick={() => handleTreeIconClick("0")}
                                                    classes={{ label: treeClasses.label, group: treeClasses.group, iconContainer: treeClasses.iconContainer }}
                                                    onLabelClick={() => handleTreeLabelClick("0")}
                                                    endIcon={<Remove />}>
                                                    {treeCategories.map((category: TreeViews) => {
                                                        return <CategoryNode
                                                            key={category.categoryName}
                                                            category={category}
                                                            setExpendedCategoryList={setTestCategory}
                                                            expendedCategoryList={expendedCategory}
                                                            selectedInfo={setSelectedCategoryInfo} />
                                                    })}
                                                </TreeItem>
                                            </TreeView>
                                        ) :
                                            (<CircularProgress />)
                                        }
                                    </Paper>
                                </ListItem>
                            </List>
                        </Grid>
                    </CardContent>
                </Card>
            </Paper>

            <Dialog
                open={deleteOpen}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"카테고리 삭제"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {selectedCategoryInfo &&
                            `${selectedCategoryInfo.categoryName} 카테고리를 삭제하시겠습니까?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <DeleteButton onClick={handleDeleteConfirm}>
                        삭제
                    </DeleteButton>
                    <Button onClick={handleDeleteClose} color="primary" autoFocus>
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

}
export default Categories
