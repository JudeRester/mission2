import { UploadFileInfo } from "../util/types";

/**
 * 파일 관련 액션
 */
const ADD = 'uploadFile/FileAddFromList' as const;
const REMOVE = 'uploadFile/FileRemoveFromList' as const;
const RESET = 'uploadFile/ResetList' as const;
const SET = 'uploadFile/SetList' as const;
/**
 * 파일 액션 생성 함수
 */
export const setFileList = (list: UploadFileInfo[]) => ({ type: SET, list })
export const addFile = (file: UploadFileInfo) => ({ type: ADD, file })
export const removeFile = (index: number) => ({ type: REMOVE, index })
export const reset = () => ({ type: RESET })
/**
 * 타입 정의
 */

type FileAction =
    | ReturnType<typeof addFile>
    | ReturnType<typeof removeFile>
    | ReturnType<typeof reset>
    | ReturnType<typeof setFileList>


/**
 * 파일 초기값
 */
const initialState: UploadFileInfo[] = []

function fileList(
    state = initialState,
    action: FileAction
): UploadFileInfo[] {
    switch (action.type) {
        case SET:
            return action.list;
        case ADD:
            let addFileList=[...state]
            addFileList.push(action.file)
            return addFileList;
        case REMOVE:
            let tempFileList:UploadFileInfo[] = [...state]
            tempFileList.splice(action.index,1)
            return tempFileList;
        case RESET:
            return initialState;
        default:
            return state;
    }
}

export default fileList;