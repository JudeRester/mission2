/**
 * 파일 관련 액션
 */
const ADD = 'uploadFile/FileAdd' as const;
const REMOVE = 'uploadFile/FileRemove' as const;
const RESET = 'uploadFile/FileReset' as const;

/**
 * 파일 액션 생성 함수
 */
export const add = (file:File) => ({ type: ADD, file })
export const remove = (index:number) => ({type:REMOVE, index})
export const reset = () => ({type:RESET})
/**
 * 타입 정의
 */

type FileAction = 
    | ReturnType<typeof add>
    | ReturnType<typeof remove>
    | ReturnType<typeof reset>

/**
 * 파일 초기값
 */
const initialState:File[] = []

function fileList(
    state = initialState,
    action: FileAction
): File[] {
    switch(action.type){
        case ADD:
            return [...state, action.file];
        case REMOVE:
            let tempFileList:File[] = [...state]
            tempFileList.splice(action.index,1)
            return tempFileList;
        case RESET:
            return initialState;
        default :
            return state;
    }
}

export default fileList;