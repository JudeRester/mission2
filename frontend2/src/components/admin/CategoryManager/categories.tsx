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
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Button,
    withStyles,
    Theme,
    Tooltip,
    TextField,
} from "@material-ui/core";
import {
    amber,
    red
} from "@material-ui/core/colors";

import arrayToTree from "array-to-tree";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { TreeItem, TreeView } from "@material-ui/lab";
import { ChevronRight, ExpandMore, SubdirectoryArrowRight } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../modules";

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
        fontSize: 15
    }
}))

interface TreeViews {
    children?: TreeViews[];
    categoryName: string;
    categoryId: string;
}
interface CategoryProps {
    category: TreeViews
}

interface CategoryInfo {
    categoryId: number,
    categoryName: string,
    categoryOrder: number,
    categoryParent: number,
    possessions?: number,
    newNode?: boolean,
}
const useTreeStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        // maxWidth: 400,
        display: 'contents',
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
    useEffect(() => {
        loadCategories()
    }, [])

    const user = useSelector((state: RootState) => state.member)
    api.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    const [arrayCategories, setArrayCategories] = useState<Array<CategoryInfo>>([]);
    const [treeCategories, setTreeCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [expendedCategory, setExpendedCategory] = useState<Array<string>>();
    const [selectedCategoryInfo, setSelectedCategoryInfo] = useState<CategoryInfo>();
    const [addingCategoryName, setAddingCategoryName] = useState<string>('');

    const treeClasses = useTreeStyles();
    const classes = useStyles();

    const loadCategories = async () => {
        const response = await api.get('/category/list')
        setArrayCategories(response.data.result)
    }

    useEffect(() => {
        let tempArray: Array<string> = [];
        async function getParents(array: Array<TreeViews>) {
            await array.map((node: TreeViews) => {
                if (node.children) {
                    tempArray.push(node.categoryId + '');
                    getParents(node.children);
                }
            });
            setExpendedCategory([...tempArray, "0"])
        };
        getParents(treeCategories);
    }, [treeCategories])

    useEffect(() => {
        setTreeCategories(arrayToTree(arrayCategories, { parentProperty: 'categoryParent', customID: 'categoryId' }))
    }, [arrayCategories])
    const handleToggle = (event: any, nodeIds: string[]) => {
        event.preventDefault()
    };
    const handleNodeSelect = (event: any, nodeId: React.SetStateAction<string>) => {
        if (nodeId === selectedCategory) {
            setSelectedCategory('')
        } else
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
    const onChange = useCallback((e: React.ChangeEvent<{ value: string }>) => {
        setAddingCategoryName(e.target.value)
        
    }, []);

    const renderTrees = (nodes: TreeViews) => {


        return (
            <TreeItem
                key={nodes.categoryId}
                nodeId={nodes.categoryId + ''}
                label={nodes.categoryName ? nodes.categoryName :
                    <TextField
                        id="standard-basic"
                        label="새 카테고리 이름"
                        // onKeyPress={(e)=>{handleInputNewCategoryName(e)}}
                        onChange={onChange}
                        value={addingCategoryName}
                    />
                }
                onIconClick={() => handleTreeIconClick(nodes.categoryId + '')}
                classes={{ label: treeClasses.label, group: treeClasses.group, iconContainer: treeClasses.iconContainer }}
                onLabelClick={nodes.categoryName ? () => handleTreeLabelClick(nodes.categoryId + '') : null}
                endIcon={<SubdirectoryArrowRight />}>
                {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTrees(node)) : null}
            </TreeItem>
        )
    }
    const Category = ({ category }: CategoryProps) => {
        // useEffect(() => {

        // }, [category]);
        return renderTrees(category);
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

    const handleAddCategory = () => {
        const newNode: CategoryInfo = {
            categoryId: new Date().getTime(),
            categoryName: '',
            categoryOrder: getLastOrder(selectedCategory),
            categoryParent: parseStringToNumber(selectedCategory),
            possessions: 0,
            newNode: true,
        }
        setArrayCategories(pre => {
            const temp = [...pre, newNode];
            return temp
        })
    }
    const parseStringToNumber = (target: string) => {
        let parser: number = +target
        return parser
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
        // const index = arrayCategories.findIndex((element: any) => element.categoryId + '' === nodeId)
    }
    const handleInputNewCategoryName = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            console.log(e.target)
        }
    }
    return (
        <>
            <Paper style={{ maxWidth: 1024, margin: "auto" }}>
                <Card>
                    <CardHeader
                        avatar={
                            <div>
                                <h2>카테고리 관리</h2>
                            </div>
                        }
                    />
                    <CardContent>

                        <Grid item>
                            {selectedCategoryInfo ?
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                카테고리 내 게시글 수 : {selectedCategoryInfo.possessions}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant="contained" color="primary" style={{ marginRight: 5 }} onClick={handleAddCategory}>추가</Button>
                                                {selectedCategoryInfo.categoryId ?
                                                    <>
                                                        <ModifyButton>수정</ModifyButton>
                                                        {selectedCategoryInfo.possessions || hasChild() !== -1 ?
                                                            <Tooltip classes={{ tooltip: classes.tooltip }} title="하위 카테고리나 게시물이 있는 카테고리는 삭제할 수 없습니다" placement="top-start">
                                                                <span>
                                                                    <DeleteButton disabled={true}>삭제</DeleteButton>
                                                                </span>
                                                            </Tooltip>
                                                            :
                                                            <DeleteButton disabled={false}>삭제</DeleteButton>
                                                        }
                                                    </>
                                                    :
                                                    null
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                                :
                                <Typography>카테고리를 선택해 주세요</Typography>
                            }
                            <List>
                                <ListItem key={1}>
                                    <Paper elevation={4} classes={{ elevation4: classes.elevation4, root: classes.paperRoot }}>
                                        {treeCategories.length > 0 ? (
                                            <TreeView
                                                onNodeToggle={handleToggle}
                                                onNodeSelect={handleNodeSelect}
                                                className={classes.root}
                                                defaultCollapseIcon={<ExpandMore />}
                                                defaultExpandIcon={<ChevronRight />}
                                                expanded={expendedCategory}
                                            >
                                                <TreeItem
                                                    key={"0"}
                                                    nodeId={"0"}
                                                    label={"전체 보기"}
                                                    onIconClick={() => handleTreeIconClick("0")}
                                                    classes={{ label: treeClasses.label, group: treeClasses.group, iconContainer: treeClasses.iconContainer }}
                                                    onLabelClick={() => handleTreeLabelClick("0")}
                                                    endIcon={<SubdirectoryArrowRight />}>
                                                    {treeCategories.map((category: TreeViews) => {
                                                        return <Category key={category.categoryId} category={category} />
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
        </>
    )

}
export default Categories
