const SET = 'arrayCategories/SET' as const;
const RESET = 'arrayCategories/RESET' as const;
const MODIFY = 'arrayCategories/MODIFY' as const;
const ADD = 'arrayCategories/ADD' as const;
const CANCELADD = 'arrayCategories/CANCELADD' as const;

export const setArrayCategories = (array:CategoryInfo[])=>({type:SET, array})
export const resetArrayCategories = ()=>({type:RESET})
export const modifyCategory = ((node:number)=>({type:MODIFY, node}))
export const addCategory = ((node:CategoryInfo)=>({type:ADD,node}))

type ArrayCategoriesAction = 
    | ReturnType<typeof setArrayCategories>
    | ReturnType<typeof resetArrayCategories>
    | ReturnType<typeof modifyCategory>
    | ReturnType<typeof addCategory>

interface CategoryInfo {
    categoryId: number,
    categoryName: string,
    categoryOrder: number,
    categoryParent: number,
    possessions?: number,
    newNode?: boolean,
    modifying?: boolean,
}


const initialState:CategoryInfo[]=[]

function arrayCategories(
    state=initialState,
    action:ArrayCategoriesAction
):CategoryInfo[]{
    switch (action.type) {
        case SET:
            return action.array;
        case RESET:
            return initialState;
        case MODIFY:
            let tempMod = [...state];
            tempMod[action.node].modifying = true;
            return tempMod;
        case ADD:
            let tempAdd = [...state];
            tempAdd=[...tempAdd,action.node];
            return tempAdd;
       
        default:
            return state;
    }   
}

export default arrayCategories