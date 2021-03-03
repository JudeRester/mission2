import {combineReducers} from 'redux';
import member from './member'
import fileList from './fileList';
import dragNode from './dragNode'
import arrayCategories from './arrayCategories'
const rootReducer = combineReducers({
    member,
    fileList,
    dragNode,
    arrayCategories
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;