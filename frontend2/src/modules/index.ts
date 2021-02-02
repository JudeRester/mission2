import {combineReducers} from 'redux';
import member from './member'
import fileList from './fileList';

const rootReducer = combineReducers({
    member,
    fileList
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;