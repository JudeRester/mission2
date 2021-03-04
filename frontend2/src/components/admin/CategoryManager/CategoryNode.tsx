import api from "../../../util/api";

import {
    makeStyles,
    fade,
    TextField,
} from "@material-ui/core";

import React, { useState, useCallback, useEffect } from "react";
import { TreeItem } from "@material-ui/lab";
import { Remove, SubdirectoryArrowRight } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../modules";
import { setDragged } from "../../../modules/dragNode";
import DropForHighOrder from "./DropForHighOrder";
import { setArrayCategories } from "../../../modules/arrayCategories";
import DropForLowOrder from "./DropForLowOrder";

interface TreeViews {
    children?: TreeViews[],
    categoryName: string,
    categoryId: string,
    modifying?: boolean,
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
interface CategoryProps {
    category: TreeViews,
    // setExpendedCategoryList: React.Dispatch<React.SetStateAction<string[]>>,
    setExpendedCategoryList: (target: Array<string>) => void,
    expendedCategoryList: string[],
    selectedInfo: React.Dispatch<React.SetStateAction<CategoryInfo>>
}
const useTreeStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        // maxWidth: 400,
        display: 'contents',

    },
    label: {
        textAlign: 'left',
        backgroundColor: (props: {backgroundColor:string})=>
            props.backgroundColor,
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

const CategoryNode = (props: CategoryProps) => {
    /**
     * ? store
     */
    const arrayCategories =useSelector((state:RootState)=>state.arrayCategories)
    const draggedNode = useSelector((state: RootState) => state.dragNode)
    const dispatch = useDispatch()
    /**
     * ? props
     */
    const {category, setExpendedCategoryList, expendedCategoryList, selectedInfo} = props;
    const expendedCategory = expendedCategoryList
    const setSelectedCategoryInfo = selectedInfo
    /**
     * ?state
     */
    const [addingCategoryName, setAddingCategoryName] = useState<string>('');
    const [styleProps,setStyleProps] = useState({backgroundColor: null})

    const treeClasses = useTreeStyles(styleProps);
    
    const onChange = useCallback((e: React.ChangeEvent<{ value: string }>) => {
        setAddingCategoryName(e.target.value)

    }, []);

    const loadCategories = async () => {
        const response = await api.get('/category/list')
        dispatch(setArrayCategories(response.data.result))
    }
    useEffect(() => {
        const targetIndex = arrayCategories.findIndex((e: CategoryInfo) => e.modifying === true);
        if (targetIndex !== -1)
            setAddingCategoryName(arrayCategories[targetIndex].categoryName)
    }, [arrayCategories])


    const handleTreeLabelClick = async (nodeId: string) => {
        const response = await api.get(`/category/${nodeId}`)
        setSelectedCategoryInfo(response.data.result)
        // const index = arrayCategories.findIndex((element: any) => element.categoryId + '' === nodeId)
    }
    const handleInputNewCategoryName = async (e: React.KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
            case "Enter":
                checkIsNameEmpty()
                break;
            case "Esc":
            case "Escape":
                cancelAddCategory()
                break;
            default:
                break;
        }
    }

    const checkIsNameEmpty = async () => {
        if (addingCategoryName.trim()) {
            const targetIndex = arrayCategories.findIndex((e: CategoryInfo) => e.newNode === true);
            const newNode: CategoryInfo = {
                categoryId: 0,
                categoryName: addingCategoryName,
                categoryOrder: arrayCategories[targetIndex].categoryOrder,
                categoryParent: arrayCategories[targetIndex].categoryParent,
            }
            const response = await api.post(`category`, newNode)
            switch (response.data.code) {
                case 200:
                    const response = await api.get('/category/list')
                    // setArrayCategories(response.data.result)
                    dispatch(setArrayCategories(response.data.result))
                    break;
                default:
                    break;
            }
        } else {
            cancelAddCategory()
        }
    }

    const cancelAddCategory = () => {
        const targetIndex = arrayCategories.findIndex((e: CategoryInfo) => e.newNode === true)
        let temp =[...arrayCategories]
        temp.splice(targetIndex, 1)
        dispatch(setArrayCategories(temp))
        // setArrayCategories(pre => {
        //     const targetIndex = pre.findIndex((e: CategoryInfo) => e.newNode === true)
        //     let temp: CategoryInfo[] = [...pre]
        //     temp.splice(targetIndex, 1)
        //     return temp;
        // })
    }



    const handleModifyCategoryName = async (e: React.KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
            case "Enter":
                checkIsNameEmptyForModify()
                break;
            case "Esc":
            case "Escape":
                cancelModifyCategory()
                break;
            default:
                break;
        }
    }
    const checkIsNameEmptyForModify = async () => {
        if (addingCategoryName.trim()) {
            const targetIndex = arrayCategories.findIndex((e: CategoryInfo) => e.modifying === true);
            const data = {
                categoryId: arrayCategories[targetIndex].categoryId,
                categoryName: addingCategoryName,
            }
            const response = await api.put(`category`, data)
            switch (response.data.code) {
                case 200:
                    const response = await api.get('/category/list')
                    // setArrayCategories(response.data.result)
                    dispatch(setArrayCategories(response.data.result))
                    break;
                default:
                    break;
            }
        } else {
            cancelModifyCategory()
        }
    }

    const cancelModifyCategory = () => {

            const targetIndex = arrayCategories.findIndex((e: CategoryInfo) => e.modifying === true)
            let temp: CategoryInfo[] = [...arrayCategories]
            temp[targetIndex].modifying = false;
            dispatch(setArrayCategories(temp));
        // setArrayCategories(pre => {
        //     const targetIndex = pre.findIndex((e: CategoryInfo) => e.modifying === true)
        //     let temp: CategoryInfo[] = [...pre]
        //     temp[targetIndex].modifying = false;
        //     return temp;
        // })
    }
    const handleTreeIconClick = (nodeId: string) => {
        const targetIndex = expendedCategory.findIndex((e: string) => e === nodeId);
        targetIndex === -1 ?
            // setExpendedCategory(pre => {
            //     let temp: string[] = [...pre];
            //     temp = [...temp, nodeId]
            //     return temp
            // })

            setExpendedCategoryList(expendedCategory.concat(nodeId))

            // : setExpendedCategory(pre => {
            //     let temp: string[] = [...pre];
            //     temp.splice(targetIndex, 1)
            //     return temp;
            // })
            : setExpendedCategoryList(expendedCategory.filter(item => item !== nodeId));
    }

    const onDragStart = async (e: React.DragEvent, category: TreeViews) => {
        e.stopPropagation()
        e.dataTransfer.effectAllowed = "move";
        const forbidNodes: string[] = [];
        forbidNodes.push(String(category.categoryId))
        let targetTemp = (e.target as HTMLElement).getElementsByTagName('li')
        for (let i = 0; i < targetTemp.length; i++) {
            let node: string = targetTemp[i].id
            forbidNodes.push(node)
        }
        dispatch(setDragged(forbidNodes))
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const onDrop = async (e: React.DragEvent, categoryId: string) => {
        e.stopPropagation()
        setStyleProps({backgroundColor: null})
        if (draggedNode.includes(String(categoryId))) {
            //드랍 불가능 액션
        } else {
            const node = arrayCategories[arrayCategories.findIndex((element) => element.categoryId === Number(draggedNode[0]))]
            node.categoryParent = Number(categoryId)
            await api.put(`category/order`, node)
            loadCategories()
        }
    }

    const onDragEnter = (e: React.DragEvent, categoryId: string) => {
        e.stopPropagation()
        if (draggedNode.includes(String(categoryId))) {
            //드랍 불가능 표시
            setStyleProps({backgroundColor:"red"})
        } else {
            //드랍 가능 표시
            setStyleProps({backgroundColor:"lightblue"})
        }
    }

    const onDragLeave = (e: React.DragEvent, categoryId: string) => {
        e.stopPropagation()
        setStyleProps({backgroundColor: null})
        // let targetIndex = arrayCategories.findIndex((e: CategoryInfo) => e.categoryId === -1)
        // const temp = [...arrayCategories]
        // temp.splice(targetIndex, 1)
        // setArrayCategories(temp)
    }

    return(
    <>
        <DropForHighOrder id={category.categoryId}/>
        <TreeItem
            draggable
            onDragStart={(e) => { onDragStart(e, category) }}
            onDragOver={onDragOver}
            onDrop={(e) => { onDrop(e, category.categoryId) }}
            onDragEnter={(e) => { onDragEnter(e, category.categoryId) }}
            onDragLeave={(e) => { onDragLeave(e, category.categoryId) }}
            id={category.categoryId}
            key={category.categoryId}
            nodeId={category.categoryId + ''}
            label={category.categoryName ?
                category.modifying ?
                    <TextField
                        id="standard-basic"
                        onKeyPress={(e) => { handleModifyCategoryName(e) }}
                        onChange={onChange}
                        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                            event.stopPropagation()
                        }}
                        onBlur={cancelModifyCategory}
                        value={addingCategoryName}
                        autoFocus
                    />
                    :
                    category.categoryName :
                <TextField
                    id="standard-basic"
                    onKeyPress={(e) => { handleInputNewCategoryName(e) }}
                    onChange={onChange}
                    onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        event.stopPropagation()
                    }}
                    onBlur={cancelAddCategory}
                    value={addingCategoryName}
                    autoFocus
                />
            }
            onIconClick={() => handleTreeIconClick(category.categoryId + '')}
            classes={{ label: treeClasses.label, group: treeClasses.group, iconContainer: treeClasses.iconContainer }}
            onLabelClick={category.categoryName ?
                () => handleTreeLabelClick(category.categoryId + '')
                : null}
            endIcon={<Remove />}>

            {Array.isArray(category.children) ? category.children.map((node) => 
            <CategoryNode 
            {...props}
            category={node} 
            // setExpendedCategoryList={setExpendedCategoryList} expendedCategoryList={expendedCategory} selectedInfo={setSelectedCategoryInfo} treeCategoryList={treeCategories} setTreeCategoryList={setTreeCategories} 
            />) : null}
        </TreeItem>
        <DropForLowOrder id={category.categoryId} />
    </>)
}

export default CategoryNode