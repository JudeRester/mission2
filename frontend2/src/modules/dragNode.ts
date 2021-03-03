
const SET = 'draggedNode/SET' as const;
const RESET = 'draggedNode/RESET' as const;

export const setDragged = (node:string[]) =>({type:SET, node})
export const resetDragged = ()=>({type:RESET})

type DragAction = 
    | ReturnType<typeof setDragged>
    | ReturnType<typeof resetDragged>

const initialState:string[]=[]

function dragNode(
    state=initialState,
    action:DragAction
):string[]{
    switch(action.type){
        case SET:
            return action.node;
        case RESET:
            return initialState;
        default :
            return state;
    }
}

export default dragNode