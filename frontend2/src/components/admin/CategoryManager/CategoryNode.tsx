import api from "../../../util/api";

import {
    makeStyles,
    fade,
    TextField,
} from "@material-ui/core";

import React, { useState, useCallback } from "react";
import { TreeItem } from "@material-ui/lab";
import { SubdirectoryArrowRight } from "@material-ui/icons";

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
}
interface CategoryProps {
    category: TreeViews,
    setExpendedCategoryList: React.Dispatch<React.SetStateAction<string[]>>,
    expendedCategoryList: string[],
    selectedInfo: React.Dispatch<React.SetStateAction<CategoryInfo>>
    setArrayCategoryList: React.Dispatch<React.SetStateAction<CategoryInfo[]>>,
    arrayCategoryList: CategoryInfo[],
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

const CategoryNode = ({ category, setExpendedCategoryList, expendedCategoryList, selectedInfo, setArrayCategoryList, arrayCategoryList }: CategoryProps) => {
    const treeClasses = useTreeStyles();
    const setExpendedCategory = setExpendedCategoryList
    const expendedCategory = expendedCategoryList
    const setSelectedCategoryInfo = selectedInfo
    const setArrayCategories = setArrayCategoryList
    const arrayCategories = arrayCategoryList
    const [addingCategoryName, setAddingCategoryName] = useState<string>('');

    const onChange = useCallback((e: React.ChangeEvent<{ value: string }>) => {
        setAddingCategoryName(e.target.value)

    }, []);



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
            case "ESC":
            case "Escape":
                cancelAddCategory()
                break;
            default:
                break;
        }
    }
    const checkIsNameEmpty= async ()=>{
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
                    setArrayCategories(response.data.result)
                    break;
                default:
                    break;
            }
        } else {
            cancelAddCategory()
        }
    }

    const cancelAddCategory =() =>{
        setArrayCategories(pre => {
            const targetIndex = pre.findIndex((e: CategoryInfo) => e.newNode === true)
            let temp: CategoryInfo[] = [...pre]
            temp.splice(targetIndex, 1)
            return temp;
        })
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

    return <TreeItem
        key={category.categoryId}
        nodeId={category.categoryId + ''}
        label={category.categoryName ? category.categoryName :
            <TextField
                id="standard-basic"
                onKeyPress={(e) => { handleInputNewCategoryName(e) }}
                onChange={onChange}
                onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
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
        endIcon={<SubdirectoryArrowRight />}>

        {Array.isArray(category.children) ? category.children.map((node) => <CategoryNode category={node} setExpendedCategoryList={setExpendedCategory} expendedCategoryList={expendedCategory} selectedInfo={setSelectedCategoryInfo} setArrayCategoryList={setArrayCategories} arrayCategoryList={arrayCategories} />) : null}
    </TreeItem>;
}

export default CategoryNode