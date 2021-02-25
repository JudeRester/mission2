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
} from "@material-ui/core";
import arrayToTree from "array-to-tree";
import React, { useEffect, useState } from "react";
import { TreeItem, TreeView } from "@material-ui/lab";
import { ChevronRight, ExpandMore, SubdirectoryArrowRight } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../modules";

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
}))

interface TreeViews {
    children?: TreeViews[];
    categoryName: string;
    categoryId: string;
}
interface CategoryProps {
    category: TreeViews
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
    let [arrayCategories, setArrayCategories] = useState([]);
    let [treeCategories, setTreeCategories] = useState([]);
    let [selectedCategory, setSelectedCategory] = useState<string>();
    let [expendedCategory, setExpendedCategory] = useState<Array<string>>();

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
            setExpendedCategory([...tempArray,"0"])
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



    const renderTrees = (nodes: TreeViews) => (
        <TreeItem
            key={nodes.categoryId}
            nodeId={nodes.categoryId + ''}
            label={nodes.categoryName}
            onIconClick={() => handleTreeIconClick(nodes.categoryId + '')}
            classes={{ label: treeClasses.label, group: treeClasses.group, iconContainer: treeClasses.iconContainer }}
            onLabelClick={() => handleTreeLabelClick(nodes.categoryId + '')}
            endIcon={<SubdirectoryArrowRight />}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTrees(node)) : null}
        </TreeItem>
    );

    const Category = ({ category }: CategoryProps) => {
        useEffect(() => {

        }, [category]);
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

    const handleTreeLabelClick = async (nodeId: string) => {
        const response= await api.get(`/category/${nodeId}`)
        console.log(response)
        const index = arrayCategories.findIndex((element:any)=>element.categoryId+''===nodeId)
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
                        <Grid container direction="row">
                            <Grid item xs={6}>
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
                            <Grid container style={{ padding: 10 }} item xs={6} direction="column" >
                                <Grid item>
                                    <Paper elevation={4} classes={{ elevation4: classes.elevation4, root: classes.paperInfo }}>

                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper elevation={4} classes={{ elevation4: classes.elevation4, root: classes.paperInfo }}>
                                        카테고리 추가?
                                </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Paper>
        </>
    )

}
export default Categories
