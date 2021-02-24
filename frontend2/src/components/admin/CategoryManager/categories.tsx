import axios from "axios";
import api from "../../../util/api";

import {
    Card,
    CardHeader,
    Button,
    Paper,
    makeStyles,
    CardContent,
    TableContainer,
    Grid,
    ListItem,
    List,
    CircularProgress
} from "@material-ui/core";
import arrayToTree from "array-to-tree";
import React, { useEffect, useState } from "react";
import { TreeItem, TreeView } from "@material-ui/lab";
import { Category } from "@material-ui/icons";

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
});


const Categories = () => {
    let token = sessionStorage.getItem("current_user_token");
    if (token) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
    useEffect(()=>{
         api({
                url: '/category/list',
                method: 'get'
            })
        .then(response => {
            console.log(response)
            setCategories(arrayToTree(response.data.result, { parentProperty: 'categoryParent', customID: 'categoryId' }))
        })
    })
   

    let [categories, setCategories] = useState([]);
    let [selectedCategory, setSelectedCategory] = useState<string>();
    let [categoriesHavingChild, setCategoriesHavingChild] = useState<Array<string>>();

    const treeClasses = useTreeStyles();
    const classes = useStyles();
    
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

    const handleToggle = (event: any, nodeIds: string[]) => {
        event.preventDefault()
      };
      const handleNodeSelect = (event: any, nodeId: React.SetStateAction<string>) => {
        if (nodeId == selectedCategory) {
          setSelectedCategory('')
        } else
          setSelectedCategory(nodeId)
      };

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

    return (
        <>
            <Paper>
                <Card>
                    <CardHeader
                        avatar={
                            <div>
                                <h2>카테고리 관리</h2>
                            </div>
                        }
                    />
                    <CardContent>
                        <Grid container>
                            <Grid item>
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
                            </Grid>
                            <Grid container direction="column">
                                <Grid item>hi</Grid>
                                <Grid item>bye</Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Paper>
        </>
    )

}
export default Categories