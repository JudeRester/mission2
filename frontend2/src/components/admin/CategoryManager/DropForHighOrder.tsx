import React from "react";
import styled from "@emotion/styled";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../modules";
import { setArrayCategories } from "../../../modules/arrayCategories";
import api from "../../../util/api";

let DropDiv = styled.div`
width:100%;
min-height:5px;
`;
interface props {
    id: string
}


const DropForHighOrder = ({ id }: props) => {
    const arrayCategories = useSelector((state: RootState) => state.arrayCategories)
    const draggedNode = useSelector((state: RootState) => state.dragNode)
    const dispatch = useDispatch()
    const [isAble, setIsAble] = useState<boolean>(false)
    const loadCategories = async () => {
        const response = await api.get('/category/list')
        dispatch(setArrayCategories(response.data.result))
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const onDrop = async (e: React.DragEvent, categoryId: string) => {
        e.stopPropagation()
        setIsAble(false)
        if (draggedNode.includes(String(categoryId))) {
            //드랍 불가능 액션
        } else {
            const targetNode = arrayCategories[arrayCategories.findIndex((element) => element.categoryId === Number(categoryId))]
            let temp = [...arrayCategories]
            let parentId = targetNode.categoryParent
            let order = targetNode.categoryOrder
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].categoryParent === parentId && order <= temp[i].categoryOrder) {
                    temp[i].categoryOrder++
                }
            }
            let node = temp.findIndex((element) => element.categoryId === Number(draggedNode[0]))
            temp[node].categoryParent = parentId
            temp[node].categoryOrder = order
            await api.put(`category/orders`, temp)
            loadCategories()
        }
    }

    const onDragEnter = (e: React.DragEvent, categoryId: string) => {
        e.stopPropagation()
        if (draggedNode.includes(String(categoryId))) {
            //드랍 불가능 표시
        } else {
            //드랍 가능 표시
            setIsAble(true)
        }
    }
    const onDragLeave = (e: React.DragEvent) => {
        e.stopPropagation()
        setIsAble(false)
    }
    return (
        <DropDiv
            id={id}
            onDragOver={onDragOver}
            onDrop={(e) => { onDrop(e, id) }}
            onDragEnter={(e) => { onDragEnter(e, id) }}
            onDragLeave={(e) => { onDragLeave(e) }}
        >
            {isAble &&
                <ArrowRightIcon/>
            }
        </DropDiv>
    )
}
export default DropForHighOrder