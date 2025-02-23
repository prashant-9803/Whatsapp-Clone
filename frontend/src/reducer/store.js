import {combineReducers} from 'redux'
import authReducer from '../slices/authSlice'
import uiReducer from "../slices/uiSlice"
import messageReducer from "../slices/messageSlice"

const rootReducer = combineReducers({
    auth: authReducer,
    ui: uiReducer,
    message: messageReducer
})

export default rootReducer